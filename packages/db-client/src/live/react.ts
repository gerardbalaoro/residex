import { useLiveIncrementalQuery, useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import type { SyncShapeToTableOptions, SyncShapeToTableResult } from "@electric-sql/pglite-sync";
import { Column, type DrizzleConfig, type ExtractTablesWithRelations, SQL, is } from "drizzle-orm";
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { type PgliteDatabase, drizzle as createPgLiteClient } from "drizzle-orm/pglite";
import { useState } from "react";

import {
  type DrizzleQueryType,
  type LiveQueryReturnType,
  type PGLiteWithElectric,
  syncShapeToTable,
} from "./index";
import { processQueryResults } from "./relation-query-parser";

type CreateDrizzleReturnType<TSchema extends Record<string, unknown>> = {
  useDrizzleLive: <T extends DrizzleQueryType>(
    fn: (db: PgliteDatabase<TSchema>) => T,
  ) => LiveQueryReturnType<T>;
  useDrizzleLiveIncremental: <T extends DrizzleQueryType>(
    diffKey: string,
    fn: (db: PgliteDatabase<TSchema>) => T,
  ) => LiveQueryReturnType<T>;
  syncShapeToTable: <
    TTableKey extends keyof ExtractTablesWithRelations<TSchema>,
    TPrimaryKey extends keyof ExtractTablesWithRelations<TSchema>[TTableKey]["columns"],
  >(
    pg: PGLiteWithElectric,
    options: {
      table: TTableKey;
      primaryKey: TPrimaryKey;
    } & Omit<SyncShapeToTableOptions, "table" | "primaryKey">,
  ) => Promise<SyncShapeToTableResult>;
  useDrizzlePGlite: () => PgliteDatabase<TSchema>;
};

export function createDrizzle<TSchema extends Record<string, unknown> = Record<string, never>>(
  config: DrizzleConfig<TSchema>,
): CreateDrizzleReturnType<TSchema> {
  return {
    useDrizzleLive: (fn) => {
      const drizzle = useDrizzlePGlite(config);
      return useDrizzleLive(fn(drizzle));
    },
    useDrizzleLiveIncremental: (diffKey, fn) => {
      const drizzle = useDrizzlePGlite(config);
      return useDrizzleLiveIncremental(diffKey, fn(drizzle));
    },
    useDrizzlePGlite: () => useDrizzlePGlite(config),
    syncShapeToTable: (pg, options) =>
      syncShapeToTable<TSchema, typeof options.table, typeof options.primaryKey>(pg, options),
  };
}

function createQueryResult<T extends DrizzleQueryType>(
  mappedRows: Record<string, any>[],
  mode: "many" | "one",
  items?: { affectedRows?: number; fields?: any[]; blob?: any },
): LiveQueryReturnType<T> {
  return {
    data: (mode === "many" ? mappedRows : mappedRows[0] || undefined) as Awaited<T>,
    isLoading: items === undefined,
    affectedRows: items?.affectedRows || 0,
    fields: items?.fields || [],
    blob: items?.blob,
  };
}

function applyColumnMappers(
  selectedFields: Record<string, unknown>,
  row: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(selectedFields)) {
    const raw = row[key];
    if (raw === null || raw === undefined) {
      result[key] = raw;
    } else if (is(field, Column)) {
      result[key] = field.mapFromDriverValue(raw);
    } else if (is(field, SQL)) {
      const decoder = (field as any).decoder;
      result[key] = decoder ? decoder.mapFromDriverValue(raw) : raw;
    } else {
      result[key] = raw;
    }
  }
  return result;
}

function mapSelectRows(query: unknown, rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const selectedFields = (query as any).getSelectedFields?.();
  if (!selectedFields) return rows;
  return rows.map((row) => applyColumnMappers(selectedFields, row));
}

export const useDrizzleLive = <T extends DrizzleQueryType>(query: T): LiveQueryReturnType<T> => {
  const sqlData = (query as any).toSQL();
  const items = useLiveQuery(sqlData.sql, sqlData.params);

  // Track which SQL the last PGlite response corresponds to.
  // `items` is a stable useState reference inside useLiveQuery — it only gets a new object
  // when PGlite fires a callback. Using it (not mapped data) avoids false-positives from
  // mapSelectRows/processQueryResults creating new arrays on every render.
  // useLiveQuery returns `u && { rows: u.rows, ... }` — new wrapper object every render.
  // items?.rows (= u.rows) is stable until PGlite fires a callback with new data.
  // Use React's derived-state pattern: when rows ref changes, record which SQL produced it.
  const [lastRows, setLastRows] = useState(items?.rows);
  const [resolvedSql, setResolvedSql] = useState(sqlData.sql);
  if (lastRows !== items?.rows) {
    setLastRows(items?.rows);
    setResolvedSql(sqlData.sql);
  }
  const isStale = items !== undefined && resolvedSql !== sqlData.sql;

  if (is(query, PgRelationalQuery)) {
    const mappedRows = processQueryResults(query, items?.rows || []);
    const result = createQueryResult<T>(mappedRows, (query as any).mode, items);
    return { ...result, isLoading: result.isLoading || isStale };
  }

  const result = createQueryResult<T>(mapSelectRows(query, items?.rows || []), "many", items);
  return { ...result, isLoading: result.isLoading || isStale };
};

export const useDrizzleLiveIncremental = <T extends DrizzleQueryType>(
  diffKey: string,
  query: T,
): LiveQueryReturnType<T> => {
  const sqlData = (query as any).toSQL();
  const items = useLiveIncrementalQuery(sqlData.sql, sqlData.params, diffKey);

  if (is(query, PgRelationalQuery)) {
    const mappedRows = processQueryResults(query, items?.rows || []);
    return createQueryResult<T>(mappedRows, (query as any).mode, items);
  }

  return createQueryResult<T>(mapSelectRows(query, items?.rows || []), "many", items);
};

export const useDrizzlePGlite = <TSchema extends Record<string, unknown>>(
  config: DrizzleConfig<TSchema>,
): PgliteDatabase<TSchema> => {
  const pg = usePGlite();
  return createPgLiteClient<TSchema>(pg as any, config);
};

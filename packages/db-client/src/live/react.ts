import { useLiveIncrementalQuery, useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import type { SyncShapeToTableOptions, SyncShapeToTableResult } from "@electric-sql/pglite-sync";
import { type DrizzleConfig, type ExtractTablesWithRelations, is } from "drizzle-orm";
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { type PgliteDatabase, drizzle as createPgLiteClient } from "drizzle-orm/pglite";

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
    affectedRows: items?.affectedRows || 0,
    fields: items?.fields || [],
    blob: items?.blob,
  };
}

export const useDrizzleLive = <T extends DrizzleQueryType>(query: T): LiveQueryReturnType<T> => {
  const sqlData = (query as any).toSQL();
  const items = useLiveQuery(sqlData.sql, sqlData.params);

  if (is(query, PgRelationalQuery)) {
    const mappedRows = processQueryResults(query, items?.rows || []);
    return createQueryResult<T>(mappedRows, (query as any).mode, items);
  }

  return createQueryResult<T>(items?.rows || [], "many", items);
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

  return createQueryResult<T>(items?.rows || [], "many", items);
};

export const useDrizzlePGlite = <TSchema extends Record<string, unknown>>(
  config: DrizzleConfig<TSchema>,
): PgliteDatabase<TSchema> => {
  const pg = usePGlite();
  return createPgLiteClient<TSchema>(pg as any, config);
};

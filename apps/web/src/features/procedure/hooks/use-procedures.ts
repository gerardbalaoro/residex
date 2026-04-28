import { useDrizzleLive } from "@residex/db-client/live/react";
import { ProceduresTable } from "@residex/db-client/schema";
import { Sex } from "@residex/db-schema/entities/patient";
import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { useMemo } from "react";
import z from "zod";

import { useDatabase } from "~/lib/db";
import { createPagination } from "~/lib/pagination";

const ProcedureListInputSchema = z.object({
  search: z.string().trim().optional(),
  sex: z.enum(Sex).optional(),
  page: z.number().int().positive().optional().default(1),
  size: z.number().int().positive().optional().default(12),
  sort: z.enum(["name", "updatedAt"]).optional().default("updatedAt"),
});

export type ProcedureListInput = z.input<typeof ProcedureListInputSchema>;

export function useProcedures(input: ProcedureListInput) {
  const db = useDatabase()!.db;
  const { search, sex, page, size, sort } = ProcedureListInputSchema.parse(input);
  const offset = (page - 1) * size;

  const conditions = useMemo(() => {
    const filters = [isNull(ProceduresTable.deletedAt)];
    if (sex) filters.push(eq(ProceduresTable.sex, sex));
    if (search) {
      filters.push(
        or(
          ilike(ProceduresTable.name, `%${search}%`),
          ilike(sql<string>`coalesce(${ProceduresTable.description}, '')`, `%${search}%`),
        )!,
      );
    }
    return and(...filters);
  }, [search, sex]);

  const order = useMemo(
    () =>
      sort === "name"
        ? [asc(ProceduresTable.name), desc(ProceduresTable.updatedAt)]
        : [desc(ProceduresTable.updatedAt), asc(ProceduresTable.name)],
    [sort],
  );

  const rowsQuery = useMemo(
    () =>
      db
        .select({
          id: ProceduresTable.id,
          name: ProceduresTable.name,
          description: ProceduresTable.description,
          minAgeYears: ProceduresTable.minAgeYears,
          maxAgeYears: ProceduresTable.maxAgeYears,
          sex: ProceduresTable.sex,
          isPreset: ProceduresTable.isPreset,
          createdAt: ProceduresTable.createdAt,
          updatedAt: ProceduresTable.updatedAt,
        })
        .from(ProceduresTable)
        .where(conditions)
        .orderBy(...order)
        .limit(size)
        .offset(offset),
    [db, offset, size, conditions, order],
  );

  const countQuery = useMemo(
    () =>
      db
        .select({ count: sql<number>`count(*)::int`.as("count") })
        .from(ProceduresTable)
        .where(conditions),
    [db, conditions],
  );

  const { data, isLoading } = useDrizzleLive(rowsQuery);
  const { data: countData } = useDrizzleLive(countQuery);
  const totalCount = countData?.[0]?.count ?? 0;

  return {
    data: data ?? [],
    count: totalCount,
    isLoading,
    pagination: createPagination(totalCount, size),
  };
}

export type ProcedureItem = ReturnType<typeof useProcedures>["data"][number];

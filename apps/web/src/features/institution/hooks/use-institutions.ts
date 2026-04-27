import { useDrizzleLive } from "@residex/db-client/live/react";
import { InstitutionsTable } from "@residex/db-client/schema";
import { and, asc, desc, ilike, isNull, or, sql } from "drizzle-orm";
import { useMemo } from "react";
import z from "zod";

import { useDatabase } from "~/lib/db";
import { createPagination } from "~/lib/pagination";

const InstitutionListInputSchema = z.object({
  search: z.string().trim().optional(),
  page: z.number().int().positive().optional().default(1),
  size: z.number().int().positive().optional().default(12),
  sort: z.enum(["name", "updatedAt"]).optional().default("updatedAt"),
});

export type InstitutionListInput = z.input<typeof InstitutionListInputSchema>;

export function useInstitutions(input: InstitutionListInput) {
  const db = useDatabase()!.db;
  const { search, page, size, sort } = InstitutionListInputSchema.parse(input);
  const offset = (page - 1) * size;

  const conditions = useMemo(
    () =>
      search
        ? and(
            isNull(InstitutionsTable.deletedAt),
            or(
              ilike(InstitutionsTable.name, `%${search}%`),
              ilike(sql<string>`coalesce(${InstitutionsTable.location}, '')`, `%${search}%`),
            ),
          )
        : isNull(InstitutionsTable.deletedAt),
    [search],
  );

  const order = useMemo(
    () =>
      sort === "name"
        ? [asc(InstitutionsTable.name), desc(InstitutionsTable.updatedAt)]
        : [desc(InstitutionsTable.updatedAt), asc(InstitutionsTable.name)],
    [sort],
  );

  const rowsQuery = useMemo(
    () =>
      db
        .select({
          id: InstitutionsTable.id,
          name: InstitutionsTable.name,
          location: InstitutionsTable.location,
          createdAt: InstitutionsTable.createdAt,
          updatedAt: InstitutionsTable.updatedAt,
        })
        .from(InstitutionsTable)
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
        .from(InstitutionsTable)
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

export type InstitutionItem = ReturnType<typeof useInstitutions>["data"][number];

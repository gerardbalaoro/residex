import { useDrizzleLive } from "@residex/db-client/live/react";
import { SkillsTable } from "@residex/db-client/schema";
import { SkillType } from "@residex/db-schema/entities/skills";
import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { useMemo } from "react";
import z from "zod";

import { useDatabase } from "~/lib/db";
import { createPagination } from "~/lib/pagination";

const SkillListInputSchema = z.object({
  search: z.string().trim().optional(),
  type: z.enum(SkillType).optional(),
  page: z.number().int().positive().optional().default(1),
  size: z.number().int().positive().optional().default(12),
  sort: z.enum(["name", "updatedAt"]).optional().default("updatedAt"),
});

export type SkillListInput = z.input<typeof SkillListInputSchema>;

export function useSkills(input: SkillListInput) {
  const db = useDatabase()!.db;
  const { search, type, page, size, sort } = SkillListInputSchema.parse(input);
  const offset = (page - 1) * size;

  const conditions = useMemo(() => {
    const filters = [isNull(SkillsTable.deletedAt)];
    if (type) filters.push(eq(SkillsTable.type, type));
    if (search) {
      filters.push(
        or(
          ilike(SkillsTable.name, `%${search}%`),
          ilike(sql<string>`coalesce(${SkillsTable.description}, '')`, `%${search}%`),
        )!,
      );
    }
    return and(...filters);
  }, [search, type]);

  const order = useMemo(
    () =>
      sort === "name"
        ? [asc(SkillsTable.name), desc(SkillsTable.updatedAt)]
        : [desc(SkillsTable.updatedAt), asc(SkillsTable.name)],
    [sort],
  );

  const rowsQuery = useMemo(
    () =>
      db
        .select({
          id: SkillsTable.id,
          name: SkillsTable.name,
          type: SkillsTable.type,
          description: SkillsTable.description,
          isPreset: SkillsTable.isPreset,
          createdAt: SkillsTable.createdAt,
          updatedAt: SkillsTable.updatedAt,
        })
        .from(SkillsTable)
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
        .from(SkillsTable)
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

export type SkillItem = ReturnType<typeof useSkills>["data"][number];

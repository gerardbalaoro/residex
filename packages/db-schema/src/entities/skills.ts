import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export enum SkillType {
  Surgical = "surgical",
  Communication = "communication",
}

export const SkillTypeEnum = pgEnum(
  "skill_type",
  Object.values(SkillType) as [string, ...string[]],
);

export const SkillsTable = pgTable("skills", {
  id: id(),
  name: text().notNull(),
  type: SkillTypeEnum().notNull(),
  description: text(),
  isPreset: boolean().notNull().default(false),
  ...timestamps,
});

export const SkillSchema = createSelectSchema(SkillsTable);
export const SkillInsertSchema = createInsertSchema(SkillsTable);
export const SkillUpdateSchema = createUpdateSchema(SkillsTable);

export type Skill = z.infer<typeof SkillSchema>;
export type SkillInsert = z.infer<typeof SkillInsertSchema>;
export type SkillUpdate = z.infer<typeof SkillUpdateSchema>;

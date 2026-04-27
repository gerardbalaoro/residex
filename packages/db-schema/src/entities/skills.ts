import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { pgNativeEnum } from "@residex/db-schema/utils/enum";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export enum SkillType {
  Surgical = "surgical",
  Communication = "communication",
}

export const SkillTypeEnum = pgNativeEnum("skill_type", SkillType);

export const SkillsTable = pgTable("skills", {
  id: id(),
  name: text().notNull(),
  type: SkillTypeEnum().notNull(),
  description: text(),
  isPreset: boolean().notNull().default(false),
  ...timestamps,
});

export const SkillSchema = createSelectSchema(SkillsTable);
export const SkillInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required")
    .max(120, "Skill name must be 120 characters or less"),
  type: z.enum(SkillType),
  description: z.string().trim().max(500, "Description must be 500 characters or less"),
});

export type Skill = z.infer<typeof SkillSchema>;
export type SkillInput = z.infer<typeof SkillInputSchema>;

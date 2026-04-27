import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { AgeYearsSchema, Sex, SexEnum } from "@residex/db-schema/entities/patient";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const ProceduresTable = pgTable("procedures", {
  id: id(),
  name: text().notNull(),
  description: text(),
  minAgeYears: integer(),
  maxAgeYears: integer(),
  sex: SexEnum(),
  isPreset: boolean().notNull().default(false),
  ...timestamps,
});

export const ProcedureSchema = createSelectSchema(ProceduresTable);
export const ProcedureInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Procedure name is required")
      .max(120, "Procedure name must be 120 characters or less"),
    description: z.string().trim().max(500, "Description must be 500 characters or less"),
    minAgeYears: AgeYearsSchema.nullable(),
    maxAgeYears: AgeYearsSchema.nullable(),
    sex: z.enum(Sex).nullable(),
  })
  .refine(
    ({ minAgeYears, maxAgeYears }) =>
      minAgeYears == null || maxAgeYears == null || minAgeYears <= maxAgeYears,
    { path: ["maxAgeYears"], message: "Max age must be greater than or equal to min age" },
  );

export type Procedure = z.infer<typeof ProcedureSchema>;
export type ProcedureInput = z.infer<typeof ProcedureInputSchema>;

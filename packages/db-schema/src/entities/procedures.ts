import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { SexEnum } from "@residex/db-schema/entities/patient";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
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
export const ProcedureInsertSchema = createInsertSchema(ProceduresTable);
export const ProcedureUpdateSchema = createUpdateSchema(ProceduresTable);

export type Procedure = z.infer<typeof ProcedureSchema>;
export type ProcedureInsert = z.infer<typeof ProcedureInsertSchema>;
export type ProcedureUpdate = z.infer<typeof ProcedureUpdateSchema>;

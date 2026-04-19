import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { CasesTable } from "@residex/db-schema/entities/cases";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const InstitutionsTable = pgTable("institutions", {
  id: id(),
  name: text().notNull(),
  description: text(),
  ...timestamps,
});

export const InstitutionsRelations = relations(InstitutionsTable, ({ many }) => ({
  cases: many(CasesTable),
}));

export const InstitutionSchema = createSelectSchema(InstitutionsTable);
export const InstitutionInsertSchema = createInsertSchema(InstitutionsTable);
export const InstitutionUpdateSchema = createUpdateSchema(InstitutionsTable);

export type Institution = z.infer<typeof InstitutionSchema>;
export type InstitutionInsert = z.infer<typeof InstitutionInsertSchema>;
export type InstitutionUpdate = z.infer<typeof InstitutionUpdateSchema>;

import { id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { CasesTable } from "@residex/db-schema/entities/cases";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const InstitutionsTable = pgTable("institutions", {
  id: id(),
  name: text().notNull(),
  location: text(),
  ...timestamps,
});

export const InstitutionsRelations = relations(InstitutionsTable, ({ many }) => ({
  cases: many(CasesTable),
}));

export const InstitutionSchema = createSelectSchema(InstitutionsTable);
export const InstitutionInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Institution name is required")
    .max(120, "Institution name must be 120 characters or less"),
  location: z.string().trim().max(200, "Location must be 200 characters or less"),
});

export type Institution = z.infer<typeof InstitutionSchema>;
export type InstitutionInput = z.infer<typeof InstitutionInputSchema>;

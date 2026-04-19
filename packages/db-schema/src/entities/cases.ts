import { fk, id } from "@residex/db-schema/columns/id";
import { timestamps } from "@residex/db-schema/columns/timestamps";
import { InstitutionsTable } from "@residex/db-schema/entities/institutions";
import { SexEnum } from "@residex/db-schema/entities/patient";
import { relations } from "drizzle-orm";
import { doublePrecision, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export enum CaseType {
  Emergency = "emergency",
  Ambulatory = "ambulatory",
  Ward = "ward",
  HomeCare = "home_care",
}

export enum Disposition {
  Admitted = "admitted",
  Discharged = "discharged",
  Transferred = "transferred",
  Home = "home",
  Deceased = "deceased",
}

export const CaseTypeEnum = pgEnum("case_type", Object.values(CaseType) as [string, ...string[]]);
export const DispositionEnum = pgEnum(
  "disposition",
  Object.values(Disposition) as [string, ...string[]],
);

export const CasesTable = pgTable("cases", {
  id: id(),
  caseType: CaseTypeEnum().notNull(),
  institutionId: fk().references(() => InstitutionsTable.id),
  encounterDate: timestamp({ mode: "date", withTimezone: true }).notNull(),
  patientName: text().notNull(),
  patientAge: doublePrecision().notNull(),
  patientSex: SexEnum().notNull(),
  disposition: DispositionEnum(),
  history: text(),
  diagnosis: text(),
  procedures: text(),
  management: text(),
  ...timestamps,
});

export const CasesRelations = relations(CasesTable, ({ one }) => ({
  institution: one(InstitutionsTable, {
    fields: [CasesTable.institutionId],
    references: [InstitutionsTable.id],
  }),
}));

export const CaseSchema = createSelectSchema(CasesTable);
export const CaseInsertSchema = createInsertSchema(CasesTable);
export const CaseUpdateSchema = createUpdateSchema(CasesTable);

export type Case = z.infer<typeof CaseSchema>;
export type CaseInsert = z.infer<typeof CaseInsertSchema>;
export type CaseUpdate = z.infer<typeof CaseUpdateSchema>;

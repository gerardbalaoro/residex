import { pgNativeEnum } from "@residex/db-schema/utils/enum";
import { z } from "zod";

export enum Sex {
  Male = "male",
  Female = "female",
  Other = "other",
}

export const SexEnum = pgNativeEnum("sex", Sex);

export const AgeYearsSchema = z
  .number()
  .int("Age must be a whole number")
  .min(0, "Age must be 0 or greater")
  .max(150, "Age must be 150 or less");

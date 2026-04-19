import { pgEnum } from "drizzle-orm/pg-core";

export enum Sex {
  Male = "male",
  Female = "female",
  Other = "other",
}

export const SexEnum = pgEnum("sex", Object.values(Sex) as [string, ...string[]]);

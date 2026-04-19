import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp({ mode: "date", withTimezone: true }),
};

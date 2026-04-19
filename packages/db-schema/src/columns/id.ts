import { text } from "drizzle-orm/pg-core";
import { ulid } from "uniku/ulid";

export const id = () =>
  text()
    .primaryKey()
    .$defaultFn(() => ulid());

export const fk = () => text();

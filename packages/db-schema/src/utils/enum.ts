import { pgEnum, type PgEnum } from "drizzle-orm/pg-core";

type EnumValue<T extends Record<string, string>> = T[keyof T];
type EnumValues<T extends Record<string, string>> = [EnumValue<T>, ...EnumValue<T>[]];

export function pgNativeEnum<T extends Record<string, string>>(
  name: string,
  enumObject: T,
): PgEnum<EnumValues<T>> {
  const values = Object.values(enumObject);

  if (values.length === 0) {
    throw new Error(`Cannot create PostgreSQL enum "${name}" from an empty enum object`);
  }

  return pgEnum(name, values as EnumValues<T>);
}

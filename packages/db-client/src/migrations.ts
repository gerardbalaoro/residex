import type { MigrationMeta } from "drizzle-orm/migrator";

import journal from "../drizzle/meta/_journal.json";

const files = import.meta.glob<string>("../drizzle/*.sql", {
  query: "?raw",
  import: "default",
  eager: true,
});

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getMigrations(): Promise<MigrationMeta[]> {
  return Promise.all(
    journal.entries.map(async (entry) => {
      const key = Object.keys(files).find((k) => k.includes(entry.tag));
      if (!key) throw new Error(`Migration SQL not found: ${entry.tag}`);
      const rawSql = files[key]!;
      return {
        sql: rawSql.split("--> statement-breakpoint"),
        bps: entry.breakpoints,
        folderMillis: entry.when,
        hash: await sha256hex(rawSql),
      };
    }),
  );
}

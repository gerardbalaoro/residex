import type { PGlite } from "@electric-sql/pglite";
import { live, type PGliteWithLive } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PgDialect } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";

import { getMigrations } from "./migrations";
import * as schema from "./schema";
import PgWorker from "./worker.ts?worker";

const DB_DATA_DIR = "idb://residex-pglite";
const DB_WORKER_ID = "residex-pglite-worker";

export type { PGliteWithLive };
export type DbInstance = ReturnType<typeof drizzle<typeof schema>>;
export type PgClient = PGliteWorker & PGliteWithLive;
export type DbClient = { pg: PgClient; db: DbInstance };

let clientPromise: Promise<DbClient> | null = null;

export function createClient(): Promise<DbClient> {
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    const pg = (await PGliteWorker.create(new PgWorker({ name: "residex-pglite" }), {
      id: DB_WORKER_ID,
      dataDir: DB_DATA_DIR,
      extensions: { live },
    })) as PgClient;

    const db = drizzle(pg as unknown as PGlite, { schema });

    // drizzle-orm/pglite migrator uses Node fs — call dialect.migrate directly with Vite-bundled SQL
    const migrations = await getMigrations();
    const dialect = (db as unknown as { dialect: PgDialect }).dialect;
    await dialect.migrate(
      migrations,
      db._.session as unknown as Parameters<PgDialect["migrate"]>[1],
      {
        migrationsFolder: "",
        migrationsTable: "__drizzle_migrations",
        migrationsSchema: "drizzle",
      },
    );

    return { pg, db };
  })().catch((error) => {
    clientPromise = null;
    throw error;
  });

  return clientPromise;
}

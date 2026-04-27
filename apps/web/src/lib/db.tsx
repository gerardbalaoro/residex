import { PGliteProvider } from "@electric-sql/pglite-react";
import type { DbClient } from "@residex/db-client/client";
import { createClient } from "@residex/db-client/client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { AppSplash } from "~/components/app-splash";

if (typeof window !== "undefined") {
  void createClient();
}

const DatabaseContext = createContext<DbClient | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<DbClient | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .then((c) => {
        if (!cancelled) setClient(c);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) throw error;
  if (!client) return <AppSplash />;

  return (
    <DatabaseContext.Provider value={client}>
      <PGliteProvider db={client.pg}>{children}</PGliteProvider>
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DbClient | null {
  return useContext(DatabaseContext);
}

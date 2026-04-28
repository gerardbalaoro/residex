import { ProceduresTable } from "@residex/db-client/schema";
import type { ProcedureInput } from "@residex/db-schema/entities/procedures";
import { eq } from "drizzle-orm";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type SaveProcedureInput = {
  procedureId?: string;
  values: ProcedureInput;
};

export function useProcedureSave({ onSuccess }: { onSuccess?: () => void } = {}) {
  const db = useDatabase()!.db;
  const [isPending, setIsPending] = useState(false);

  const saveProcedure = useCallback(
    async ({ procedureId, values }: SaveProcedureInput) => {
      const name = values.name.trim();
      const description = values.description.trim() || null;
      const minAgeYears = values.minAgeYears ?? null;
      const maxAgeYears = values.maxAgeYears ?? null;
      const sex = values.sex ?? null;

      setIsPending(true);

      try {
        if (procedureId) {
          await db
            .update(ProceduresTable)
            .set({ name, description, minAgeYears, maxAgeYears, sex, updatedAt: new Date() })
            .where(eq(ProceduresTable.id, procedureId));

          toast.success("Procedure updated.");
        } else {
          await db
            .insert(ProceduresTable)
            .values({ name, description, minAgeYears, maxAgeYears, sex });

          toast.success("Procedure created.");
        }

        onSuccess?.();
        return true;
      } catch (error) {
        console.error(error);
        toast.error(procedureId ? "Unable to update procedure." : "Unable to create procedure.");
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [db, onSuccess],
  );

  return { isPending, saveProcedure };
}

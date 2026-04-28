import { ProceduresTable } from "@residex/db-client/schema";
import { inArray } from "drizzle-orm";
import { useCallback } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type DeleteProcedureInput = {
  id: string | string[];
};

export function useProcedureDelete() {
  const db = useDatabase()!.db;

  const deleteProcedure = useCallback(
    async ({ id: procedureId }: DeleteProcedureInput) => {
      const ids = Array.isArray(procedureId) ? procedureId : [procedureId];
      const isBulk = ids.length > 1;

      try {
        const now = new Date();

        await db
          .update(ProceduresTable)
          .set({ deletedAt: now, updatedAt: now })
          .where(inArray(ProceduresTable.id, ids));

        toast.success(isBulk ? `${ids.length} procedures deleted.` : "Procedure deleted.");
        return true;
      } catch (error) {
        console.error(error);
        toast.error(isBulk ? "Unable to delete procedures." : "Unable to delete procedure.");
        return false;
      }
    },
    [db],
  );

  return { deleteProcedure };
}

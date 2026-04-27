import { CasesTable, InstitutionsTable } from "@residex/db-client/schema";
import { inArray } from "drizzle-orm";
import { useCallback } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type DeleteInstitutionInput = {
  id: string | string[];
};

export function useInstitutionDelete() {
  const db = useDatabase()!.db;

  const deleteInstitution = useCallback(
    async ({ id: institutionId }: DeleteInstitutionInput) => {
      const ids = Array.isArray(institutionId) ? institutionId : [institutionId];
      const isBulk = ids.length > 1;

      try {
        const now = new Date();

        await db.transaction(async (tx) => {
          await tx
            .update(CasesTable)
            .set({ institutionId: null, updatedAt: now })
            .where(inArray(CasesTable.institutionId, ids));

          await tx
            .update(InstitutionsTable)
            .set({ deletedAt: now, updatedAt: now })
            .where(inArray(InstitutionsTable.id, ids));
        });

        toast.success(isBulk ? `${ids.length} institutions deleted.` : "Institution deleted.");
        return true;
      } catch (error) {
        console.error(error);
        toast.error(isBulk ? "Unable to delete institutions." : "Unable to delete institution.");
        return false;
      }
    },
    [db],
  );

  return { deleteInstitution };
}

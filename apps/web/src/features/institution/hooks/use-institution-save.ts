import { InstitutionsTable } from "@residex/db-client/schema";
import type { InstitutionInput } from "@residex/db-schema/entities/institutions";
import { eq } from "drizzle-orm";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type SaveInstitutionInput = {
  institutionId?: string;
  values: InstitutionInput;
};

export function useInstitutionSave({ onSuccess }: { onSuccess?: () => void } = {}) {
  const db = useDatabase()!.db;
  const [isPending, setIsPending] = useState(false);

  const saveInstitution = useCallback(
    async ({ institutionId, values }: SaveInstitutionInput) => {
      const name = values.name.trim();
      const location = values.location.trim() || null;

      setIsPending(true);

      try {
        if (institutionId) {
          await db
            .update(InstitutionsTable)
            .set({ location, name, updatedAt: new Date() })
            .where(eq(InstitutionsTable.id, institutionId));

          toast.success("Institution updated.");
        } else {
          await db.insert(InstitutionsTable).values({ location, name });

          toast.success("Institution created.");
        }

        onSuccess?.();
        return true;
      } catch (error) {
        console.error(error);
        toast.error(
          institutionId ? "Unable to update institution." : "Unable to create institution.",
        );
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [db, onSuccess],
  );

  return { isPending, saveInstitution };
}

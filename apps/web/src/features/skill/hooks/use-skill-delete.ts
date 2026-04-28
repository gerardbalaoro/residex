import { SkillsTable } from "@residex/db-client/schema";
import { inArray } from "drizzle-orm";
import { useCallback } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type DeleteSkillInput = {
  id: string | string[];
};

export function useSkillDelete() {
  const db = useDatabase()!.db;

  const deleteSkill = useCallback(
    async ({ id: skillId }: DeleteSkillInput) => {
      const ids = Array.isArray(skillId) ? skillId : [skillId];
      const isBulk = ids.length > 1;

      try {
        const now = new Date();

        await db
          .update(SkillsTable)
          .set({ deletedAt: now, updatedAt: now })
          .where(inArray(SkillsTable.id, ids));

        toast.success(isBulk ? `${ids.length} skills deleted.` : "Skill deleted.");
        return true;
      } catch (error) {
        console.error(error);
        toast.error(isBulk ? "Unable to delete skills." : "Unable to delete skill.");
        return false;
      }
    },
    [db],
  );

  return { deleteSkill };
}

import { SkillsTable } from "@residex/db-client/schema";
import type { SkillInput } from "@residex/db-schema/entities/skills";
import { eq } from "drizzle-orm";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useDatabase } from "~/lib/db";

type SaveSkillInput = {
  skillId?: string;
  values: SkillInput;
};

export function useSkillSave({ onSuccess }: { onSuccess?: () => void } = {}) {
  const db = useDatabase()!.db;
  const [isPending, setIsPending] = useState(false);

  const saveSkill = useCallback(
    async ({ skillId, values }: SaveSkillInput) => {
      const name = values.name.trim();
      const description = values.description.trim() || null;
      const type = values.type;

      setIsPending(true);

      try {
        if (skillId) {
          await db
            .update(SkillsTable)
            .set({ name, type, description, updatedAt: new Date() })
            .where(eq(SkillsTable.id, skillId));

          toast.success("Skill updated.");
        } else {
          await db.insert(SkillsTable).values({ name, type, description });

          toast.success("Skill created.");
        }

        onSuccess?.();
        return true;
      } catch (error) {
        console.error(error);
        toast.error(skillId ? "Unable to update skill." : "Unable to create skill.");
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [db, onSuccess],
  );

  return { isPending, saveSkill };
}

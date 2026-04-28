import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@residex/ui/components/alert-dialog";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useSkillDelete } from "../hooks/use-skill-delete";
import type { SkillItem } from "../hooks/use-skills";

export type SkillDeleteDialogTarget = Pick<SkillItem, "id" | "name">;

export type SkillDeleteDialogControls = {
  isOpen: boolean;
  skill: SkillDeleteDialogTarget | null;
  open: (skill: SkillDeleteDialogTarget) => void;
  close: () => void;
};

export function useSkillDeleteDialog(): SkillDeleteDialogControls {
  const [skill, setSkill] = useState<SkillDeleteDialogTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: SkillDeleteDialogTarget) => {
    setSkill(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return useMemo(() => ({ close, skill, isOpen, open }), [close, skill, isOpen, open]);
}

type Props = SkillDeleteDialogControls & {
  onDeleted?: (skill: SkillDeleteDialogTarget) => void;
};

export function SkillDeleteDialog({ isOpen, skill, close, onDeleted }: Props) {
  const { deleteSkill } = useSkillDelete();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!skill) return;
    setIsPending(true);
    try {
      const didDelete = await deleteSkill({ id: skill.id });
      if (didDelete) {
        onDeleted?.(skill);
        close();
      }
    } finally {
      setIsPending(false);
    }
  }, [close, deleteSkill, skill, onDeleted]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) close();
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {skill?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the skill from your active list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() => void handleDelete()}
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

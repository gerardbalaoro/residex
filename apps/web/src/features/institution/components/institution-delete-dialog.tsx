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

import { useInstitutionDelete } from "../hooks/use-institution-delete";
import type { InstitutionItem } from "../hooks/use-institutions";

export type InstitutionDeleteDialogTarget = Pick<InstitutionItem, "id" | "name">;

export type InstitutionDeleteDialogControls = {
  isOpen: boolean;
  institution: InstitutionDeleteDialogTarget | null;
  open: (institution: InstitutionDeleteDialogTarget) => void;
  close: () => void;
};

export function useInstitutionDeleteDialog(): InstitutionDeleteDialogControls {
  const [institution, setInstitution] = useState<InstitutionDeleteDialogTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: InstitutionDeleteDialogTarget) => {
    setInstitution(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return useMemo(() => ({ close, institution, isOpen, open }), [close, institution, isOpen, open]);
}

type Props = InstitutionDeleteDialogControls & {
  onDeleted?: (institution: InstitutionDeleteDialogTarget) => void;
};

export function InstitutionDeleteDialog({ isOpen, institution, close, onDeleted }: Props) {
  const { deleteInstitution } = useInstitutionDelete();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!institution) return;
    setIsPending(true);
    try {
      const didDelete = await deleteInstitution({ id: institution.id });
      if (didDelete) {
        onDeleted?.(institution);
        close();
      }
    } finally {
      setIsPending(false);
    }
  }, [close, deleteInstitution, institution, onDeleted]);

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
          <AlertDialogTitle>Delete {institution?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the institution from your active list. Linked cases will be unassigned but
            kept.
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

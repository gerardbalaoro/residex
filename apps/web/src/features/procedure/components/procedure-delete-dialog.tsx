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

import { useProcedureDelete } from "../hooks/use-procedure-delete";
import type { ProcedureItem } from "../hooks/use-procedures";

export type ProcedureDeleteDialogTarget = Pick<ProcedureItem, "id" | "name">;

export type ProcedureDeleteDialogControls = {
  isOpen: boolean;
  procedure: ProcedureDeleteDialogTarget | null;
  open: (procedure: ProcedureDeleteDialogTarget) => void;
  close: () => void;
};

export function useProcedureDeleteDialog(): ProcedureDeleteDialogControls {
  const [procedure, setProcedure] = useState<ProcedureDeleteDialogTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: ProcedureDeleteDialogTarget) => {
    setProcedure(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return useMemo(() => ({ close, procedure, isOpen, open }), [close, procedure, isOpen, open]);
}

type Props = ProcedureDeleteDialogControls & {
  onDeleted?: (procedure: ProcedureDeleteDialogTarget) => void;
};

export function ProcedureDeleteDialog({ isOpen, procedure, close, onDeleted }: Props) {
  const { deleteProcedure } = useProcedureDelete();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!procedure) return;
    setIsPending(true);
    try {
      const didDelete = await deleteProcedure({ id: procedure.id });
      if (didDelete) {
        onDeleted?.(procedure);
        close();
      }
    } finally {
      setIsPending(false);
    }
  }, [close, deleteProcedure, procedure, onDeleted]);

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
          <AlertDialogTitle>Delete {procedure?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the procedure from your active list.
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

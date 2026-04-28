import { Sex } from "@residex/db-schema/entities/patient";
import { Button } from "@residex/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@residex/ui/components/dialog";
import { Drawer, DrawerDescription, DrawerPopup, DrawerTitle } from "@residex/ui/components/drawer";
import { useIsMobile } from "@residex/ui/hooks/use-mobile";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { useProcedureSave } from "../hooks/use-procedure-save";
import { type ProcedureItem } from "../hooks/use-procedures";
import { ProcedureForm, useProcedureForm } from "./procedure-form";

export type ProcedureFormDialogControls = {
  isOpen: boolean;
  procedure: ProcedureItem | null;
  open: (procedure?: ProcedureItem | null) => void;
  close: () => void;
};

export function useProcedureFormDialog(): ProcedureFormDialogControls {
  const [procedure, setProcedure] = useState<ProcedureItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((nextProcedure?: ProcedureItem | null) => {
    setProcedure(nextProcedure ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setProcedure(null);
  }, []);

  return useMemo(() => ({ close, procedure, isOpen, open }), [close, procedure, isOpen, open]);
}

export function ProcedureFormDialog({ isOpen, procedure, close }: ProcedureFormDialogControls) {
  const isMobile = useIsMobile();
  const formId = useId();
  const isEditMode = procedure != null;
  const { isPending, saveProcedure } = useProcedureSave({ onSuccess: close });

  const form = useProcedureForm({
    procedure,
    onSubmit: useCallback(
      async (values) => {
        await saveProcedure({ procedureId: procedure?.id, values });
      },
      [procedure?.id, saveProcedure],
    ),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: procedure?.name ?? "",
        description: procedure?.description ?? "",
        minAgeYears: procedure?.minAgeYears ?? null,
        maxAgeYears: procedure?.maxAgeYears ?? null,
        sex: (procedure?.sex as Sex | null) ?? null,
      });
    }
  }, [isOpen, procedure, form]);

  const title = isEditMode ? "Edit Procedure" : "Add Procedure";
  const description = isEditMode
    ? "Update the details for this procedure."
    : "Save the clinical procedures you want to track across your encounters.";

  const body = <ProcedureForm id={formId} form={form} />;
  const footer = (
    <>
      <Button type="button" variant="outline" disabled={isPending} onClick={close}>
        Cancel
      </Button>
      <Button type="submit" form={formId} disabled={isPending}>
        {isPending ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" /> : null}
        {isEditMode ? "Save" : "Create"}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
        <DrawerPopup>
          <div className="flex flex-col gap-1.5 pb-4">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </div>
          {body}
          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        </DrawerPopup>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

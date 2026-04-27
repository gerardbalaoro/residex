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

import { useInstitutionSave } from "../hooks/use-institution-save";
import { type InstitutionItem } from "../hooks/use-institutions";
import { InstitutionForm, useInstitutionForm } from "./institution-form";

export type InstitutionFormDialogControls = {
  isOpen: boolean;
  institution: InstitutionItem | null;
  open: (institution?: InstitutionItem | null) => void;
  close: () => void;
};

export function useInstitutionFormDialog(): InstitutionFormDialogControls {
  const [institution, setInstitution] = useState<InstitutionItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((nextInstitution?: InstitutionItem | null) => {
    setInstitution(nextInstitution ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInstitution(null);
  }, []);

  return useMemo(() => ({ close, institution, isOpen, open }), [close, institution, isOpen, open]);
}

export function InstitutionFormDialog({
  isOpen,
  institution,
  close,
}: InstitutionFormDialogControls) {
  const isMobile = useIsMobile();
  const formId = useId();
  const isEditMode = institution != null;
  const { isPending, saveInstitution } = useInstitutionSave({ onSuccess: close });

  const form = useInstitutionForm({
    institution,
    onSubmit: useCallback(
      async (values) => {
        await saveInstitution({ institutionId: institution?.id, values });
      },
      [institution?.id, saveInstitution],
    ),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: institution?.name ?? "",
        location: institution?.location ?? "",
      });
    }
  }, [isOpen, institution, form]);

  const title = isEditMode ? "Edit Institution" : "Add Institution";
  const description = isEditMode
    ? "Update the details for this institution."
    : "Save the hospitals, clinics, and training sites where you log encounters.";

  const body = <InstitutionForm id={formId} form={form} />;
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

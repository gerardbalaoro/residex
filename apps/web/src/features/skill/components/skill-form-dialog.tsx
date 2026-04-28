import { SkillType } from "@residex/db-schema/entities/skills";
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

import { useSkillSave } from "../hooks/use-skill-save";
import { type SkillItem } from "../hooks/use-skills";
import { SkillForm, useSkillForm } from "./skill-form";

export type SkillFormDialogControls = {
  isOpen: boolean;
  skill: SkillItem | null;
  open: (skill?: SkillItem | null) => void;
  close: () => void;
};

export function useSkillFormDialog(): SkillFormDialogControls {
  const [skill, setSkill] = useState<SkillItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((nextSkill?: SkillItem | null) => {
    setSkill(nextSkill ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSkill(null);
  }, []);

  return useMemo(() => ({ close, skill, isOpen, open }), [close, skill, isOpen, open]);
}

export function SkillFormDialog({ isOpen, skill, close }: SkillFormDialogControls) {
  const isMobile = useIsMobile();
  const formId = useId();
  const isEditMode = skill != null;
  const { isPending, saveSkill } = useSkillSave({ onSuccess: close });

  const form = useSkillForm({
    skill,
    onSubmit: useCallback(
      async (values) => {
        await saveSkill({ skillId: skill?.id, values });
      },
      [skill?.id, saveSkill],
    ),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: skill?.name ?? "",
        type: (skill?.type as SkillType) ?? SkillType.Surgical,
        description: skill?.description ?? "",
      });
    }
  }, [isOpen, skill, form]);

  const title = isEditMode ? "Edit Skill" : "Add Skill";
  const description = isEditMode
    ? "Update the details for this skill."
    : "Save the clinical skills you want to track across your encounters.";

  const body = <SkillForm id={formId} form={form} />;
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

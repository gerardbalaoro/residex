import { SkillInputSchema, SkillType, type SkillInput } from "@residex/db-schema/entities/skills";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@residex/ui/components/field";
import { Input } from "@residex/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@residex/ui/components/select";
import { cn } from "@residex/ui/lib/utils";
import { useForm } from "@tanstack/react-form-start";
import { ComponentProps, useId } from "react";

import { getFieldErrorMessage } from "~/lib/form";

import { type SkillItem } from "../hooks/use-skills";

const TYPE_OPTIONS: { value: SkillType; label: string }[] = [
  { value: SkillType.Surgical, label: "Surgical" },
  { value: SkillType.Communication, label: "Communication" },
];

export function useSkillForm({
  skill,
  onSubmit,
}: {
  skill?: SkillItem | null;
  onSubmit: (values: SkillInput) => Promise<void> | void;
}) {
  return useForm({
    defaultValues: {
      name: skill?.name ?? "",
      type: (skill?.type as SkillType) ?? SkillType.Surgical,
      description: skill?.description ?? "",
    },
    validators: { onSubmit: SkillInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

type Props = Omit<ComponentProps<"form">, "onSubmit"> & {
  form: ReturnType<typeof useSkillForm>;
};

export function SkillForm({ form, className, ...props }: Props) {
  const nameId = useId();
  const typeId = useId();
  const descriptionId = useId();

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
            const isInvalid = field.state.meta.isTouched && errorMessage != null;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={nameId}>Name</FieldLabel>
                <Input
                  id={nameId}
                  placeholder="e.g. Endotracheal Intubation"
                  value={field.state.value}
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid ? <FieldError>{errorMessage}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="type">
          {(field) => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
            const isInvalid = field.state.meta.isTouched && errorMessage != null;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={typeId}>Type</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as SkillType)}
                >
                  <SelectTrigger id={typeId} className="w-full" aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid ? <FieldError>{errorMessage}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
            const isInvalid = field.state.meta.isTouched && errorMessage != null;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
                <Input
                  id={descriptionId}
                  placeholder="Optional notes about when this skill applies."
                  value={field.state.value}
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid ? (
                  <FieldError>{errorMessage}</FieldError>
                ) : (
                  <FieldDescription>
                    A short note helps you remember the context for this skill.
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  [SkillType.Surgical]: "Surgical",
  [SkillType.Communication]: "Communication",
};

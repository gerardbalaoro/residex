import {
  InstitutionInputSchema,
  type InstitutionInput,
} from "@residex/db-schema/entities/institutions";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@residex/ui/components/field";
import { Input } from "@residex/ui/components/input";
import { cn } from "@residex/ui/lib/utils";
import { useForm } from "@tanstack/react-form-start";
import { ComponentProps, useId } from "react";

import { getFieldErrorMessage } from "~/lib/form";

import { type InstitutionItem } from "../hooks/use-institutions";

export function useInstitutionForm({
  institution,
  onSubmit,
}: {
  institution?: InstitutionItem | null;
  onSubmit: (values: InstitutionInput) => Promise<void> | void;
}) {
  return useForm({
    defaultValues: {
      name: institution?.name ?? "",
      location: institution?.location ?? "",
    },
    validators: { onSubmit: InstitutionInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

type Props = Omit<ComponentProps<"form">, "onSubmit"> & {
  form: ReturnType<typeof useInstitutionForm>;
};

export function InstitutionForm({ form, className, ...props }: Props) {
  const nameId = useId();
  const locationId = useId();

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
                  placeholder="e.g. St. Catherine Medical Center"
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

        <form.Field name="location">
          {(field) => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
            const isInvalid = field.state.meta.isTouched && errorMessage != null;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={locationId}>Location</FieldLabel>
                <Input
                  id={locationId}
                  placeholder="e.g. Quezon City, Metro Manila"
                  value={field.state.value}
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid ? (
                  <FieldError>{errorMessage}</FieldError>
                ) : (
                  <FieldDescription>
                    Helpful when you have rotations across multiple facilities.
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

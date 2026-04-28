import { Sex } from "@residex/db-schema/entities/patient";
import { ProcedureInputSchema, type ProcedureInput } from "@residex/db-schema/entities/procedures";
import { Button } from "@residex/ui/components/button";
import { ButtonGroup } from "@residex/ui/components/button-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@residex/ui/components/field";
import { Input } from "@residex/ui/components/input";
import { Textarea } from "@residex/ui/components/textarea";
import { cn } from "@residex/ui/lib/utils";
import { useForm } from "@tanstack/react-form-start";
import { ComponentProps, useId } from "react";

import { getFieldErrorMessage } from "~/lib/form";
import { PatientSexAnyOption, PatientSexAnyValue, PatientSexOptions } from "~/lib/patient-sex";

import { type ProcedureItem } from "../hooks/use-procedures";

type ProcedureSexOption = {
  value: Sex | typeof PatientSexAnyValue;
  label: string;
  icon: (typeof PatientSexOptions)[Sex]["icon"];
};

const SEX_OPTIONS: ProcedureSexOption[] = [
  { value: PatientSexAnyValue, ...PatientSexAnyOption },
  ...[Sex.Female, Sex.Male, Sex.Other].map((sex) => ({
    value: sex,
    ...PatientSexOptions[sex],
  })),
];

function parseAge(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function useProcedureForm({
  procedure,
  onSubmit,
}: {
  procedure?: ProcedureItem | null;
  onSubmit: (values: ProcedureInput) => Promise<void> | void;
}) {
  return useForm({
    defaultValues: {
      name: procedure?.name ?? "",
      description: procedure?.description ?? "",
      minAgeYears: procedure?.minAgeYears ?? null,
      maxAgeYears: procedure?.maxAgeYears ?? null,
      sex: (procedure?.sex as Sex | null) ?? null,
    } as ProcedureInput,
    validators: { onSubmit: ProcedureInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

type Props = Omit<ComponentProps<"form">, "onSubmit"> & {
  form: ReturnType<typeof useProcedureForm>;
};

export function ProcedureForm({ form, className, ...props }: Props) {
  const nameId = useId();
  const descriptionId = useId();
  const minAgeId = useId();
  const maxAgeId = useId();
  const sexId = useId();

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
                <FieldLabel htmlFor={nameId}>Procedure name</FieldLabel>
                <Input
                  id={nameId}
                  autoComplete="off"
                  placeholder="Lumbar puncture, intubation, central line..."
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

        <form.Field name="description">
          {(field) => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
            const isInvalid = field.state.meta.isTouched && errorMessage != null;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
                <Textarea
                  id={descriptionId}
                  placeholder="Optional notes about indications or technique."
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

        <FieldSet>
          <FieldLegend variant="legend">Applies to</FieldLegend>
          <FieldDescription>
            Limit when this procedure appears for patients by age and sex.
          </FieldDescription>

          <form.Field name="sex">
            {(field) => {
              const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
              const isInvalid = field.state.meta.isTouched && errorMessage != null;
              const value = field.state.value ?? PatientSexAnyValue;
              const renderSexOption = (option: ProcedureSexOption) => {
                const isSelected = value === option.value;
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    aria-checked={isSelected}
                    role="radio"
                    onClick={() =>
                      field.handleChange(option.value === PatientSexAnyValue ? null : option.value)
                    }
                  >
                    <Icon data-icon="inline-start" aria-hidden />
                    {option.label}
                  </Button>
                );
              };

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel id={sexId}>Sex</FieldLabel>
                  <ButtonGroup
                    orientation="vertical"
                    className="w-full sm:hidden"
                    role="radiogroup"
                    aria-labelledby={sexId}
                    aria-invalid={isInvalid}
                  >
                    {SEX_OPTIONS.map(renderSexOption)}
                  </ButtonGroup>
                  <ButtonGroup
                    className="hidden w-full grid-cols-4 sm:grid"
                    role="radiogroup"
                    aria-labelledby={sexId}
                    aria-invalid={isInvalid}
                  >
                    {SEX_OPTIONS.map(renderSexOption)}
                  </ButtonGroup>
                  {isInvalid ? <FieldError>{errorMessage}</FieldError> : null}
                </Field>
              );
            }}
          </form.Field>

          <Field>
            <FieldLabel>Age range</FieldLabel>
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
              <form.Field name="minAgeYears">
                {(field) => {
                  const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
                  const isInvalid = field.state.meta.isTouched && errorMessage != null;
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        id={minAgeId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={150}
                        placeholder="Any"
                        value={field.state.value ?? ""}
                        aria-label="Minimum age in years"
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(parseAge(e.target.value))}
                      />
                      {isInvalid ? <FieldError>{errorMessage}</FieldError> : null}
                    </Field>
                  );
                }}
              </form.Field>
              <span className="pt-2 text-sm text-muted-foreground">to</span>
              <form.Field name="maxAgeYears">
                {(field) => {
                  const errorMessage = getFieldErrorMessage(field.state.meta.errors[0]);
                  const isInvalid = field.state.meta.isTouched && errorMessage != null;
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        id={maxAgeId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={150}
                        placeholder="Any"
                        value={field.state.value ?? ""}
                        aria-label="Maximum age in years"
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(parseAge(e.target.value))}
                      />
                      {isInvalid ? <FieldError>{errorMessage}</FieldError> : null}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
            <FieldDescription>
              Leave both blank when the procedure applies to any age.
            </FieldDescription>
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

export function describeApplicability(
  minAgeYears: number | null,
  maxAgeYears: number | null,
  sex: Sex | string | null,
): string | null {
  const parts: string[] = [];

  if (minAgeYears != null && maxAgeYears != null) {
    parts.push(`${minAgeYears}–${maxAgeYears} yrs`);
  } else if (minAgeYears != null) {
    parts.push(`≥ ${minAgeYears} yrs`);
  } else if (maxAgeYears != null) {
    parts.push(`≤ ${maxAgeYears} yrs`);
  }

  if (sex) {
    parts.push(PatientSexOptions[sex as Sex]?.label ?? String(sex));
  }

  return parts.length ? parts.join(" · ") : null;
}

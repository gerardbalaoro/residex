import { Sex } from "@residex/db-schema/entities/patient";
import { CircleIcon, LucideIcon, MarsIcon, VenusAndMarsIcon, VenusIcon } from "lucide-react";

export const PatientSexOptions: Record<Sex, { label: string; icon: LucideIcon }> = {
  [Sex.Male]: {
    label: "Male",
    icon: MarsIcon,
  },
  [Sex.Female]: {
    label: "Female",
    icon: VenusIcon,
  },
  [Sex.Other]: {
    label: "Other",
    icon: VenusAndMarsIcon,
  },
};

export const PatientSexAnyValue = "*";
export const PatientSexAnyOption: (typeof PatientSexOptions)[Sex] = {
  label: "Any",
  icon: CircleIcon,
};

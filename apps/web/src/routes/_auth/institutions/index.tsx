import { createFileRoute } from "@tanstack/react-router";
import { BuildingIcon, PlusIcon } from "lucide-react";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/institutions/")({
  component: InstitutionsPage,
  staticData: { title: "Institutions" },
  head: () => ({ meta: [...meta.page("Institutions")] }),
});

function InstitutionsPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Institutions"
        description="Hospitals, clinics, and facilities where you record encounters."
        actions={<AppPage.Action icon={PlusIcon} label="Add Institution" />}
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BuildingIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No institutions yet</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Add the facilities where you perform clinical rotations.
        </p>
      </div>
    </AppPage>
  );
}

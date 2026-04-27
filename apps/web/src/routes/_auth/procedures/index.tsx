import { createFileRoute } from "@tanstack/react-router";
import { SyringeIcon } from "lucide-react";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/procedures/")({
  component: ProceduresPage,
  staticData: { title: "Procedures" },
  head: () => ({ meta: [...meta.page("Procedures")] }),
});

function ProceduresPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Procedures"
        description="Track clinical procedures performed across your encounters."
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <SyringeIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No procedures yet</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Procedures are extracted from your case notes automatically.
        </p>
      </div>
    </AppPage>
  );
}

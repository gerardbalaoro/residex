import { createFileRoute } from "@tanstack/react-router";
import { ClipboardPlusIcon, FolderOpenIcon } from "lucide-react";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/cases/")({
  component: CasesPage,
  staticData: { title: "Cases" },
  head: () => ({ meta: [...meta.page("Cases")] }),
});

function CasesPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Cases"
        description="Record and manage your patient encounters."
        actions={<AppPage.Action icon={ClipboardPlusIcon} label="New Case" />}
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FolderOpenIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No cases yet</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Create your first case to start tracking encounters.
        </p>
      </div>
    </AppPage>
  );
}

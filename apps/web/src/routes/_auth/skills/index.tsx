import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheckIcon } from "lucide-react";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/skills/")({
  component: SkillsPage,
  staticData: { title: "Skills" },
  head: () => ({ meta: [...meta.page("Skills")] }),
});

function SkillsPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Skills"
        description="Review clinical skills demonstrated across your encounters."
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BadgeCheckIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No skills yet</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Skills are extracted from your case notes automatically.
        </p>
      </div>
    </AppPage>
  );
}

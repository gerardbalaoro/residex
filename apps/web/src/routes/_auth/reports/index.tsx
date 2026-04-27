import { createFileRoute } from "@tanstack/react-router";
import { ChartColumnIcon } from "lucide-react";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/reports/")({
  component: ReportsPage,
  staticData: { title: "Reports" },
  head: () => ({ meta: [...meta.page("Reports")] }),
});

function ReportsPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Reports"
        description="Generate clinical case, procedure, and skill reports."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="Clinical Case Reports"
          description="Case counts by ICD-10 categories across residency years."
        />
        <ReportCard
          title="Procedure Reports"
          description="Procedures performed, categorized by patient demographics."
        />
        <ReportCard
          title="Skill Reports"
          description="Skills demonstrated, grouped by type and training year."
        />
      </div>
    </AppPage>
  );
}

function ReportCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
        <ChartColumnIcon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <h3 className="mt-3 text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

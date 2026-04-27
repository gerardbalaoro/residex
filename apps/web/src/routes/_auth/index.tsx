import { Button } from "@residex/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChartColumnIcon,
  ClipboardListIcon,
  ClipboardPlusIcon,
  FolderOpenIcon,
} from "lucide-react";

import { AppPage } from "~/components/app-page";

export const Route = createFileRoute("/_auth/")({
  component: DashboardPage,
  staticData: { title: "Dashboard" },
});

function DashboardPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Dashboard"
        description="Overview of your clinical encounters and activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Cases" value="--" />
        <StatCard label="This Month" value="--" />
        <StatCard label="Pending Review" value="--" />
        <StatCard label="Reports Generated" value="--" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button nativeButton={false} render={<Link to="/cases" />}>
          <ClipboardPlusIcon data-icon="inline-start" />
          New Case
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link to="/reports" />}>
          <ChartColumnIcon data-icon="inline-start" />
          View Reports
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FolderOpenIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No recent cases</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Start recording patient encounters to see them here.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          nativeButton={false}
          render={<Link to="/cases" />}
        >
          <ClipboardListIcon data-icon="inline-start" />
          Go to Cases
        </Button>
      </div>
    </AppPage>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { AppPage } from "~/components/app-page";
import { meta } from "~/lib/meta";

export const Route = createFileRoute("/_auth/settings/")({
  component: SettingsPage,
  staticData: { title: "Settings" },
  head: () => ({ meta: [...meta.page("Settings")] }),
});

function SettingsPage() {
  return (
    <AppPage>
      <AppPage.Header
        title="Settings"
        description="Manage your account, preferences, and residency configuration."
      />

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Settings will be available here.</p>
      </div>
    </AppPage>
  );
}

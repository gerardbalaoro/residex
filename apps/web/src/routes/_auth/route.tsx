import { SidebarInset, SidebarProvider } from "@residex/ui/components/sidebar";
import { TooltipProvider } from "@residex/ui/components/tooltip";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppDock } from "~/components/app-dock";
import { AppHeader } from "~/components/app-header";
import { AppSidebar } from "~/components/app-sidebar";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col pb-16 md:pb-0">
            <Outlet />
          </div>
        </SidebarInset>
        <AppDock />
      </SidebarProvider>
    </TooltipProvider>
  );
}

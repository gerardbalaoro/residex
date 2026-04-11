import { Button } from "@residex/ui/components/button";
import { DropdownMenuTrigger } from "@residex/ui/components/dropdown-menu";
import { Separator } from "@residex/ui/components/separator";
import { SidebarTrigger } from "@residex/ui/components/sidebar";
import { Link } from "@tanstack/react-router";

import { AppBreadcrumbs } from "~/components/app-breadcrumbs";
import { AppIcon } from "~/components/app-icon";
import { ProfileAvatar, ProfileMenuRoot } from "~/components/profile-menu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      {/* Mobile: sidebar trigger + app name + profile */}
      <div className="flex h-full flex-1 items-center gap-2 md:hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />
        <Link to="/" aria-label="Go to dashboard">
          <AppIcon className="h-4 text-primary" />
        </Link>
        <div className="ml-auto">
          <ProfileMenuRoot
            trigger={
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" className="rounded-full" />}
              >
                <ProfileAvatar />
              </DropdownMenuTrigger>
            }
            contentProps={{ side: "bottom", align: "end" }}
          />
        </div>
      </div>
      {/* Desktop: sidebar trigger + breadcrumbs */}
      <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
      <Separator orientation="vertical" className="mr-2 hidden h-full md:block" />
      <div className="hidden md:block">
        <AppBreadcrumbs />
      </div>
    </header>
  );
}

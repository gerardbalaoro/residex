import { DropdownMenuTrigger } from "@residex/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@residex/ui/components/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BadgeCheckIcon,
  BuildingIcon,
  ChartColumnIcon,
  ChevronsUpDownIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  SyringeIcon,
} from "lucide-react";
import React from "react";

import { ProfileAvatar, ProfileMenuRoot } from "~/components/profile-menu";
import { meta } from "~/lib/meta";

import { AppIcon } from "./app-icon";

const pages = [
  { label: "Cases", href: "/cases", icon: ClipboardListIcon },
  { label: "Institutions", href: "/institutions", icon: BuildingIcon },
  { label: "Procedures", href: "/procedures", icon: SyringeIcon },
  { label: "Skills", href: "/skills", icon: BadgeCheckIcon },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  React.useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [location.pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center text-primary">
                <AppIcon className="size-6!" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading text-lg font-bold">{meta.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/"}
                  tooltip="Dashboard"
                  render={<Link to="/" />}
                >
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Census */}
        <SidebarGroup>
          <SidebarGroupLabel>Residency</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith(item.href)}
                    tooltip={item.label}
                    render={<Link to={item.href} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports */}
        <SidebarGroup>
          <SidebarGroupLabel render={<Link to="/reports" />}>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.startsWith("/reports")}
                  tooltip="Reports"
                  render={<Link to="/reports" />}
                >
                  <ChartColumnIcon />
                  <span>All Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileMenuRoot
              trigger={
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <ProfileAvatar />
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">Dr. Resident</span>
                    <span className="truncate text-xs text-muted-foreground">
                      resident@hospital.org
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
                </DropdownMenuTrigger>
              }
              contentProps={{
                side: "top",
                align: "start",
                className: "w-(--anchor-width) min-w-56",
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

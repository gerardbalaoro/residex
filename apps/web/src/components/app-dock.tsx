import { cn } from "@residex/ui/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ChartColumnIcon, ClipboardListIcon, LayoutDashboardIcon } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { label: "Cases", href: "/cases", icon: ClipboardListIcon },
  { label: "Reports", href: "/reports", icon: ChartColumnIcon },
];

export function AppDock() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-sidebar md:hidden">
      <div className="flex h-16 items-stretch justify-around">
        {items.map((item) => {
          const isActive =
            item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                isActive && "text-primary",
              )}
            >
              <item.icon className="size-5" />
              <span className="text-xs leading-none font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

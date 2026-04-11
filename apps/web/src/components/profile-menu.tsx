import { Avatar, AvatarFallback } from "@residex/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@residex/ui/components/dropdown-menu";
import { useTheme } from "@residex/ui/lib/theme-provider";
import { Link } from "@tanstack/react-router";
import { LogOutIcon, MonitorIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";

function ThemeItems() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => setTheme("light")}
        className={theme === "light" ? "font-medium" : ""}
      >
        <SunIcon />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "font-medium" : ""}
      >
        <MoonIcon />
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setTheme("system")}
        className={theme === "system" ? "font-medium" : ""}
      >
        <MonitorIcon />
        System
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

export function ProfileMenu(
  props: Omit<React.ComponentProps<typeof DropdownMenuContent>, "children">,
) {
  return (
    <DropdownMenuContent {...props}>
      <ThemeItems />
      <DropdownMenuSeparator />
      <DropdownMenuItem render={<Link to="/settings" />}>
        <SettingsIcon />
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LogOutIcon />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function ProfileAvatar({ className }: { className?: string }) {
  return (
    <Avatar size="sm" className={className}>
      <AvatarFallback>DR</AvatarFallback>
    </Avatar>
  );
}

export function ProfileMenuRoot({
  trigger,
  contentProps,
}: {
  trigger: React.ReactNode;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
}) {
  return (
    <DropdownMenu>
      {trigger}
      <ProfileMenu {...contentProps} />
    </DropdownMenu>
  );
}

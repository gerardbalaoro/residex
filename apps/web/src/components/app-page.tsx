import { Button } from "@residex/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@residex/ui/components/tooltip";
import { useIsMobile } from "@residex/ui/hooks/use-mobile";
import { type LucideIcon } from "lucide-react";
import React from "react";

export function AppPage({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      style={{ "--page-padding": "calc(var(--spacing) * 6)" } as React.CSSProperties}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-(--page-padding)"
    >
      {children}
    </div>
  );
}

AppPage.Header = function ({
  title,
  description,
  actions,
}: {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
};

AppPage.Action = function ({
  children,
  label,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon: LucideIcon;
  label: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button {...props} size="icon-lg">
              <Icon className="size-5!" />
            </Button>
          }
        />
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button {...props}>
      <Icon />
      {children ? children : label}
    </Button>
  );
};

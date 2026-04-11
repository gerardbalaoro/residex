import type React from "react";

export function AppPage({ children }: { readonly children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">{children}</div>;
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

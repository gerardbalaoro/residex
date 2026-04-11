import { meta } from "~/lib/meta";

import { AppIcon } from "./app-icon";

export function AppSplash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
      <div className="size-16 text-primary">
        <AppIcon className="size-full" />
      </div>

      <p className="text-xl font-semibold tracking-tight">{meta.title}</p>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

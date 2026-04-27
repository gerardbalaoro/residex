import { createFileRoute } from "@tanstack/react-router";

import { ThemeToggle } from "~/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/30 text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">residex</p>
          </div>
          <ThemeToggle />
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Welcome to residex.
              </h1>
              <p className="max-w-2xl text-base/7 text-muted-foreground sm:text-lg">
                A clean web foundation built with TanStack Start, shared UI components, and a
                lightweight design system ready for your product experience.
              </p>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Routing
                </h2>
                <p className="mt-3 text-sm/6 text-muted-foreground">
                  TanStack Router and Query are wired up and ready for app flows.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  UI
                </h2>
                <p className="mt-3 text-sm/6 text-muted-foreground">
                  Shared primitives, theming, and utility styles live in `@residex/ui`.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Next
                </h2>
                <p className="mt-3 text-sm/6 text-muted-foreground">
                  Start building routes, layouts, and product features from a clean slate.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

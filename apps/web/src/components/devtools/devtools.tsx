import { a11yDevtoolsPlugin } from "@tanstack/devtools-a11y/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { AppStorage } from "./app-storage";

function AppDevtoolsPanel() {
  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <AppStorage />
    </div>
  );
}

export function DeveloperTools() {
  return (
    <TanStackDevtools
      plugins={[
        {
          name: "Application",
          render: <AppDevtoolsPanel />,
        },
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
        formDevtoolsPlugin(),
        a11yDevtoolsPlugin(),
      ]}
    />
  );
}

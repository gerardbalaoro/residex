import { a11yDevtoolsPlugin } from "@tanstack/devtools-a11y/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { AppStorage } from "./app-storage";

function AppDevtoolsPanel() {
  return (
    <div
      style={{ padding: "16px", fontFamily: "system-ui, sans-serif", containerType: "inline-size" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 8,
        }}
      >
        <AppStorage />
      </div>
    </div>
  );
}

export function DeveloperTools() {
  return (
    <TanStackDevtools
      config={{
        hideUntilHover: true,
        requireUrlFlag: true,
        urlFlag: "devtools",
      }}
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

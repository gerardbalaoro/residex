import { useState } from "react";

function useStorage() {
  const [status, setStatus] = useState<"idle" | "clearing" | "cleared" | "error">("idle");
  const [error, setError] = useState<string>();
  const clear = async () => {
    setStatus("clearing");
    setError(undefined);

    try {
      localStorage.clear();
      sessionStorage.clear();

      const dbs = await indexedDB.databases();
      await Promise.all(
        dbs.map(
          ({ name }) =>
            new Promise<void>((resolve, reject) => {
              if (!name) return resolve();
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = () => resolve();
              req.onerror = () => reject(req.error);
              req.onblocked = () => resolve();
            }),
        ),
      );

      if ("storage" in navigator) {
        const root = await navigator.storage.getDirectory();
        for await (const [name] of root.entries()) {
          await root.removeEntry(name, { recursive: true });
        }
      }

      setStatus("cleared");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  };

  return { status, error, clear };
}

export function AppStorage() {
  const { status, error, clear } = useStorage();

  return (
    <div
      style={{
        border: "1px solid rgba(128,128,128,0.2)",
        borderRadius: 8,
        padding: "14px 16px",
        maxWidth: 360,
      }}
    >
      <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600 }}>Clear Browser Storage</p>
      <p style={{ margin: "0 0 12px", fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}>
        Clears Local Storage, Session Storage, IndexedDB, and OPFS for this origin.
      </p>
      <button
        onClick={clear}
        disabled={status === "clearing"}
        style={{
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 6,
          border: "none",
          background: status === "cleared" ? "#22c55e" : status === "error" ? "#ef4444" : "#ef4444",
          color: "#fff",
          cursor: status === "clearing" ? "not-allowed" : "pointer",
          opacity: status === "clearing" ? 0.6 : 1,
        }}
      >
        {status === "clearing"
          ? "Clearing…"
          : status === "cleared"
            ? "Cleared"
            : status === "error"
              ? (error ?? "Error")
              : "Clear All"}
      </button>
    </div>
  );
}

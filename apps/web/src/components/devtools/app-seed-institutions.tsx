import { faker } from "@faker-js/faker";
import { createClient } from "@residex/db-client/client";
import { InstitutionsTable } from "@residex/db-client/schema";
import { useState } from "react";

function generateInstitutions(count: number) {
  return Array.from({ length: count }, () => ({
    name: `${faker.location.city()} ${faker.helpers.arrayElement(["General Hospital", "Medical Center", "Regional Hospital", "University Hospital", "Health System"])}`,
    location: `${faker.location.city()}, ${faker.location.state()}`,
  }));
}

export function AppSeedInstitutions() {
  const [count, setCount] = useState(5);
  const [status, setStatus] = useState<"idle" | "seeding" | "done" | "error">("idle");
  const [error, setError] = useState<string>();

  const seed = async () => {
    setStatus("seeding");
    setError(undefined);

    try {
      const { db } = await createClient();
      await db.insert(InstitutionsTable).values(generateInstitutions(count));
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(128,128,128,0.2)",
        borderRadius: 8,
        padding: "14px 16px",
      }}
    >
      <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600 }}>Seed Institutions</p>
      <p style={{ margin: "0 0 12px", fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}>
        Insert fake institution records using Faker.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          min={1}
          max={500}
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
          style={{
            width: 64,
            padding: "4px 8px",
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid rgba(128,128,128,0.3)",
            background: "transparent",
            color: "inherit",
          }}
        />
        <button
          onClick={seed}
          disabled={status === "seeding"}
          style={{
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: "none",
            background: status === "done" ? "#22c55e" : status === "error" ? "#ef4444" : "#3b82f6",
            color: "#fff",
            cursor: status === "seeding" ? "not-allowed" : "pointer",
            opacity: status === "seeding" ? 0.6 : 1,
          }}
        >
          {status === "seeding"
            ? "Seeding…"
            : status === "done"
              ? "Seeded"
              : status === "error"
                ? (error ?? "Error")
                : "Seed"}
        </button>
      </div>
    </div>
  );
}

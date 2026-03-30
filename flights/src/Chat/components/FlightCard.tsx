import React from "react";
import { Plane } from "lucide-react";
import type { StructuredCard } from "../types";

interface FlightCardProps {
  data: StructuredCard;
  visible: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({ data, visible }) => (
  <div
    className={`mt-4 w-full sm:w-80 rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-700 hover:-translate-y-1 hover:shadow-xl ${
      visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
    }`}
    style={{
      background:   "var(--card-bg)",
      borderColor:  "var(--border)",
      boxShadow:    visible ? "var(--card-shadow)" : "none",
    }}
  >
    {/* Header row */}
    <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div
        className="flex items-center gap-2.5 font-bold text-lg font-sans tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
          <Plane size={16} />
        </div>
        {data.flight}
      </div>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border bg-amber-500/10 text-amber-500 border-amber-500/20">
        {data.status}
      </span>
    </div>

    {/* Data grid */}
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Aircraft",       value: data.aircraft                         },
        { label: "Assigned Stand", value: data.stand                            },
        { label: "Revised ETA",    value: data.eta                              },
        { label: "Conflict",       value: data.conflict, isGreen: true          },
      ].map(({ label, value, isGreen }) => (
        <div key={label} className="flex flex-col gap-1">
          <span
            className="text-[0.65rem] uppercase tracking-wider font-semibold opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <span
            className="text-sm font-mono font-bold"
            style={{ color: isGreen ? "#10b981" : "var(--text-primary)" }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);
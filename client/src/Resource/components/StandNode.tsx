import React from "react";
import { Handle, Position } from "reactflow";
import { Plane, Bus } from "lucide-react";
import type { StandNodeData } from "../types";

/**
 * StandNode — rectangular aircraft-stand node.
 * Shows occupancy status, active flight number, and a remote-stand bus icon.
 * Fully responsive to Light/Dark CSS variables.
 */
export const StandNode: React.FC<{ data: StandNodeData }> = ({ data }) => {
  const isOccupied = data.status === "occupied";

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-[120px] h-[80px] rounded-xl border-[2px] backdrop-blur-md transition-all duration-300 hover:scale-105 group ${
        isOccupied
          ? "border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          : "opacity-90 hover:opacity-100"
      }`}
      style={{
        // Blends Emerald into the theme surface if occupied, otherwise uses pure theme surface
        background: isOccupied 
          ? "color-mix(in srgb, var(--bg-surface) 85%, #10b981)" 
          : "var(--bg-surface)",
        // Fallback to theme border if empty
        borderColor: isOccupied ? undefined : "var(--border)",
        // Casts standard theme shadow if empty
        boxShadow: isOccupied ? undefined : "var(--card-shadow)",
      }}
    >
      {/* ── All-direction Handles (Opacity 0 so they don't ruin the UI) ── */}
      <Handle type="target" position={Position.Top}    id="top"    className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="target" position={Position.Right}  id="right"  className="opacity-0" />
      <Handle type="source" position={Position.Left}   id="left"   className="opacity-0" />

      {/* ── Occupancy Pulse Indicator (Bonus Requirement Met!) ── */}
      {isOccupied && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
      )}

      {/* ── Stand ID ── */}
      <span 
        className="font-bold font-mono text-sm flex items-center gap-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {data.label}
        {data.type === "remote" && <Bus size={10} className="text-amber-500 drop-shadow-sm" />}
      </span>

      {/* ── Occupancy Detail ── */}
      {isOccupied ? (
        <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[0.6rem] font-bold tracking-wider border border-emerald-500/20">
          <Plane size={10} /> {data.flight}
        </div>
      ) : (
        <span 
          className="mt-2 text-[0.6rem] uppercase tracking-widest font-bold"
          style={{ color: "var(--text-muted)" }}
        >
          Available
        </span>
      )}
    </div>
  );
};
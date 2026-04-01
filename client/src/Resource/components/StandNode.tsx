import React from "react";
import { Handle, Position } from "reactflow";
import { Plane, Bus } from "lucide-react";
import type { StandNodeData } from "../types";

/**
 * StandNode — rectangular aircraft-stand node.
 * Shows occupancy status, active flight number, and a remote-stand bus icon.
 * All 4 handles exposed for adjacency-constraint routing.
 */
export const StandNode: React.FC<{ data: StandNodeData }> = ({ data }) => {
  const isOccupied = data.status === "occupied";

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-[120px] h-[80px] rounded-xl border-[2px] shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${
        isOccupied
          ? "bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
          : "bg-white/5 border-white/10 opacity-70"
      }`}
    >
      {/* All-direction handles */}
      <Handle type="target" position={Position.Top}    id="top"    className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="target" position={Position.Right}  id="right"  className="opacity-0" />
      <Handle type="source" position={Position.Left}   id="left"   className="opacity-0" />

      {/* Occupancy pulse indicator */}
      {isOccupied && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
      )}

      {/* Stand ID */}
      <span className="font-bold font-mono text-sm text-white flex items-center gap-1.5">
        {data.label}
        {data.type === "remote" && <Bus size={10} className="text-amber-400" />}
      </span>

      {/* Occupancy detail */}
      {isOccupied ? (
        <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[0.6rem] font-bold tracking-wider border border-emerald-500/30">
          <Plane size={10} /> {data.flight}
        </div>
      ) : (
        <span className="mt-2 text-[0.6rem] uppercase tracking-widest text-gray-500 font-bold">
          Empty
        </span>
      )}
    </div>
  );
};
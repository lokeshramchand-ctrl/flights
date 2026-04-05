import React from "react";
import { Handle, Position } from "reactflow"; // Assuming React Flow for the graph

interface GateNodeProps {
  data: {
    label: string;
    terminal: "T1" | "T2";
  };
}

export const GateNode: React.FC<GateNodeProps> = ({ data }) => {
  // Determine Terminal color (Matching your Gantt chart logic: Blue for T1, Violet for T2)
  const isT1 = data.terminal === "T1";
  const terminalColor = isT1 ? "#3b82f6" : "#8b5cf6"; // Blue 500 or Violet 500

  return (
    <div
      className="group relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg"
      style={{
        background: "var(--bg-surface)",
        borderColor: terminalColor,
        color: "var(--text-primary)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* ── React Flow Connection Points ── */}
      {/* We make them opacity-0 so they work functionally but don't ruin your sleek UI */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      {/* ── Node Content ── */}
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[0.75rem] font-bold font-sans tracking-tight">
          {data.label}
        </span>
      </div>

      {/* ── Hover Glow Effect ── */}
      {/* Adds a subtle ambient glow matching the terminal color when hovered */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"
        style={{ background: terminalColor }}
      />
    </div>
  );
};

export default GateNode;
import React from "react";
import { getDecimalHours } from "../utils";
import type { Flight } from "../types";

interface FlightBlockProps {
  flight:          Flight;
  hourWidth:       number;
  animIndex:       number;
  onDragStart:     (id: string) => void;
  onTooltipEnter:  (e: React.MouseEvent, f: Flight) => void;
  onTooltipLeave:  () => void;
  onTooltipMove:   (e: React.MouseEvent) => void;
}

/**
 * Generates theme-aware styles. 
 * By relying on var(--bg-surface), the blocks automatically switch 
 * from white (Light Mode) to dark gray (Dark Mode).
 */
const getBlockStyle = (f: Flight): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    background: "var(--bg-surface)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  if (f.conflict) {
    return {
      ...baseStyle,
      borderLeft: "4px solid #ef4444", // Red-500 edge
      // A subtle hazard stripe that overlays beautifully on both light and dark backgrounds
      backgroundImage: "repeating-linear-gradient(-45deg, rgba(239,68,68,0.08), rgba(239,68,68,0.08) 8px, transparent 8px, transparent 16px)",
    };
  }

  if (f.terminal === "T1") {
    return {
      ...baseStyle,
      borderLeft: "4px solid #3b82f6", // Blue-500 edge
    };
  }

  // Default / Terminal 2
  return {
    ...baseStyle,
    borderLeft: "4px solid #8b5cf6", // Violet-500 edge
  };
};

export const FlightBlock: React.FC<FlightBlockProps> = ({
  flight: f,
  hourWidth,
  animIndex,
  onDragStart,
  onTooltipEnter,
  onTooltipLeave,
  onTooltipMove,
}) => {
  const startDec = getDecimalHours(f.block_time_start);
  const endDec   = getDecimalHours(f.block_time_end);

  return (
    <div
      draggable
      className={`anim-pop-in absolute top-[10px] flex cursor-grab select-none items-center overflow-hidden rounded-lg px-2.5 py-1.5 shadow-sm border active:cursor-grabbing hover:z-20 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-md ${
        f.conflict ? "anim-pulse-border" : ""
      }`}
      style={{
        left:           `${startDec * hourWidth}px`,
        width:          `${(endDec - startDec) * hourWidth}px`,
        height:         "calc(100% - 20px)",
        animationDelay: `${0.8 + animIndex * 0.05}s`,
        ...getBlockStyle(f),
      }}
      onDragStart={(e) => {
        onDragStart(f.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity   = "0.6";
        e.currentTarget.style.transform = "scale(0.98)";
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity   = "1";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseEnter={(e) => onTooltipEnter(e, f)}
      onMouseLeave={onTooltipLeave}
      onMouseMove={onTooltipMove}
    >
      <div className="flex flex-col leading-tight pointer-events-none w-full min-w-0">
        <span className="text-[13px] font-semibold font-sans tracking-tight truncate">
          {f.flight_number}
        </span>
        <span 
          className="text-[10px] font-medium font-sans uppercase tracking-widest mt-0.5 truncate" 
          style={{ color: "var(--text-secondary)" }}
        >
          {f.aircraft_type}
        </span>
      </div>
    </div>
  );
};
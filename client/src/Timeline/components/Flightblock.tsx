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

/** Inline styles applied only to conflict blocks so the stripe pattern can't be expressed in Tailwind */
const CONFLICT_STYLE: React.CSSProperties = {
  background:  "repeating-linear-gradient(-45deg, rgba(239,68,68,0.15), rgba(239,68,68,0.15) 10px, rgba(239,68,68,0.25) 10px, rgba(239,68,68,0.25) 20px)",
  borderColor: "rgba(239,68,68,0.6)",
  color:       "#fecaca",
};

/**
 * A single draggable flight block rendered on the Gantt timeline.
 * Position and width are calculated from block times × hourWidth.
 */
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

  const baseClass = f.conflict
    ? "border shadow-[0_0_15px_rgba(239,68,68,0.3)] anim-pulse-border"
    : f.terminal === "T1"
      ? "border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/50"
      : "border border-violet-400/20 bg-gradient-to-r from-violet-500/20 to-violet-500/5 text-violet-100 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-400/50";

  return (
    <div
      draggable
      className={`anim-pop-in absolute top-[10px] flex cursor-grab select-none items-center overflow-hidden rounded-lg px-3 py-1.5 backdrop-blur-md active:cursor-grabbing hover:z-20 transition-all duration-300 hover:-translate-y-1 ${baseClass}`}
      style={{
        left:           `${startDec * hourWidth}px`,
        width:          `${(endDec - startDec) * hourWidth}px`,
        height:         "calc(100% - 20px)",
        animationDelay: `${0.8 + animIndex * 0.05}s`,
        ...(f.conflict ? CONFLICT_STYLE : {}),
      }}
      onDragStart={(e) => {
        onDragStart(f.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity   = "0.4";
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity   = "1";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseEnter={(e) => onTooltipEnter(e, f)}
      onMouseLeave={onTooltipLeave}
      onMouseMove={onTooltipMove}
    >
      <div className="flex flex-col leading-tight pointer-events-none w-full">
        <span className="text-sm font-bold font-sans tracking-tight">{f.flight_number}</span>
        <span className="text-[0.6rem] font-medium opacity-60 font-sans uppercase tracking-widest mt-0.5 truncate">
          {f.aircraft_type}
        </span>
      </div>

      {/* Decorative top-edge inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/[0.05] pointer-events-none rounded-lg" />
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { STATUS_BADGE_CLASSES } from "../data";
import { formatTime } from "../utils";
import type { TooltipState } from "../types";

interface FlightTooltipProps {
  state: TooltipState;
}

/**
 * A floating tooltip that follows the mouse over a FlightBlock.
 * Automatically flips position when it would overflow the viewport.
 * pointer-events: none so it never interferes with drag events.
 */
export const FlightTooltip: React.FC<FlightTooltipProps> = ({ state }) => {
  const f = state.flight;
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Flip left/up when near viewport edges
  let left = state.x + 20;
  let top  = state.y + 20;
  if (left + 260 > windowSize.width)  left = state.x - 280;
  if (top  + 180 > windowSize.height) top  = state.y - 200;

  return (
    <div
      className="pointer-events-none fixed z-[999] min-w-[260px] rounded-2xl border border-white/[0.1] bg-[#0A0A0B]/80 p-5 text-sm text-white shadow-xl backdrop-blur-xl transition-[opacity,transform] duration-200 font-sans ease-out"
      style={{
        left,
        top,
        opacity:   state.visible ? 1 : 0,
transform: state.visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(6px)"      }}
    >
      {f && (
        <>
          {/* Header */}
          <div className="mb-3 pb-3 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold font-sans tracking-tight text-white">
                {f.flight_number}
              </span>
              <span className="text-xs font-medium text-white/50">{f.airline}</span>
            </div>
            <span className={`rounded-lg border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest ${STATUS_BADGE_CLASSES[f.status]}`}>
              {f.status.replace("_", " ")}
            </span>
          </div>

          {/* Detail rows */}
          <div className="flex flex-col gap-2 text-[0.8rem]">
            {[
              { label: "Aircraft",   value: f.aircraft_type },
              { label: "Block Time", value: `${formatTime(f.block_time_start)} – ${formatTime(f.block_time_end)}` },
              { label: "Passengers", value: String(f.pax_count) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-white/40 font-medium tracking-wide uppercase text-[0.65rem]">
                  {label}
                </span>
                <b className="font-sans text-white/80 font-medium">{value}</b>
              </div>
            ))}
          </div>

          {/* Conflict warning */}
          {f.conflict && (
            <div className="mt-4 rounded-lg bg-red-500/8 p-2.5 text-center text-[0.7rem] font-bold text-red-400 border border-red-500/30 uppercase tracking-widest anim-pulse">
              Stand Overlap Detected
            </div>
          )}
        </>
      )}
    </div>
  );
};
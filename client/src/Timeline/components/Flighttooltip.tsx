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
  let top = state.y + 20;
  if (left + 260 > windowSize.width) left = state.x - 280;
  if (top + 180 > windowSize.height) top = state.y - 200;

  return (
    <div
      className="pointer-events-none fixed z-[999] min-w-[260px] rounded-2xl border p-5 backdrop-blur-xl transition-[opacity,transform] duration-200 font-sans ease-out"
      style={{
        left,
        top,
        opacity: state.visible ? 1 : 0,
        transform: state.visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(6px)",
        // ── Theme Variables Applied Here ──
        background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {f && (
        <>
          {/* ── Header ── */}
          <div 
            className="mb-3 pb-3 flex items-center justify-between border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight">
                {f.flight_number}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {f.airline}
              </span>
            </div>
            <span className={`rounded-lg border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest ${STATUS_BADGE_CLASSES[f.status]}`}>
              {f.status.replace("_", " ")}
            </span>
          </div>

          {/* ── Detail Rows ── */}
          <div className="flex flex-col gap-2 text-[0.8rem]">
            {[
              { label: "Aircraft", value: f.aircraft_type },
              { label: "Block Time", value: `${formatTime(f.block_time_start)} – ${formatTime(f.block_time_end)}` },
              { label: "Passengers", value: String(f.pax_count) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span 
                  className="font-medium tracking-wide uppercase text-[0.65rem]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </span>
                <b className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {value}
                </b>
              </div>
            ))}
          </div>

          {/* ── Conflict Warning ── */}
          {f.conflict && (
            <div className="mt-4 rounded-xl bg-red-500/10 p-2.5 text-center text-[0.7rem] font-bold text-red-500 border border-red-500/20 uppercase tracking-widest anim-pulse">
              Stand Overlap Detected
            </div>
          )}
        </>
      )}
    </div>
  );
};
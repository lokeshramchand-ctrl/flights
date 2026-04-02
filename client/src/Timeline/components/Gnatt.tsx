import React from "react";
import { FlightBlock } from "./Flightblock";
import { MOCK_NOW_DECIMAL } from "../data";
import type { Flight, Stand } from "../types";

interface GanttTimelineProps {
  hourWidth:          number;
  stands:             Stand[];                      // ← from API via useFlights
  flightsByStand:     Record<string, Flight[]>;
  animIndexByFlight:  Record<string, number>;
  dragOverStand:      string | null;
  timelineWrapperRef: React.RefObject<HTMLDivElement>;
  onDragStart:        (id: string) => void;
  onDragOver:         (standId: string) => void;
  onDragLeave:        () => void;
  onDrop:             (standId: string) => void;
  onTooltipEnter:     (e: React.MouseEvent, f: Flight) => void;
  onTooltipLeave:     () => void;
  onTooltipMove:      (e: React.MouseEvent) => void;
}

const HOUR_COUNT = 24;

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  hourWidth,
  stands,
  flightsByStand,
  animIndexByFlight,
  dragOverStand,
  timelineWrapperRef,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onTooltipEnter,
  onTooltipLeave,
  onTooltipMove,
}) => {
  const mockNowLeft = MOCK_NOW_DECIMAL * hourWidth;

  return (
    <main
      className="anim-fade-up relative flex flex-1 mx-4 mb-4 md:mx-8 md:mb-8 overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300"
      style={{ 
        animationDelay: "0.2s",
        background: "var(--bg-surface)",
        borderColor: "var(--border)"
      }}
    >
      <div className="flex h-full w-full overflow-y-auto overflow-x-hidden relative scrollbar-hide">

        {/* ── Stand Sidebar (sticky left) ── */}
        <div 
          className="sticky left-0 z-30 w-16 md:w-28 shrink-0 border-r backdrop-blur-xl transition-colors duration-300"
          style={{ 
            background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
            borderColor: "var(--border)" 
          }}
        >
          {/* Header */}
          <div 
            className="sticky top-0 z-40 flex h-12 md:h-14 items-center justify-center border-b transition-colors duration-300"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <span 
              className="text-[0.65rem] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted, var(--text-secondary))" }}
            >
              Stands
            </span>
          </div>

          {/* Stand List */}
          {stands.map((stand, i) => (
            <div
              key={stand.id}
              className="anim-slide-in-left flex h-16 md:h-20 flex-col items-center justify-center border-b transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ 
                animationDelay: `${0.2 + i * 0.05}s`,
                borderColor: "var(--border)" 
              }}
            >
              <span className="text-sm md:text-base font-bold font-sans tracking-tight" style={{ color: "var(--text-primary)" }}>
                {stand.id}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {stand.type}
              </span>
            </div>
          ))}
        </div>

        {/* ── Scrollable Time Grid ── */}
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
          ref={timelineWrapperRef}
        >
          <div className="relative h-full" style={{ minWidth: `${HOUR_COUNT * hourWidth}px` }}>

            {/* Time header */}
            <div 
              className="sticky top-0 z-20 flex h-12 md:h-14 border-b backdrop-blur-xl transition-colors duration-300"
              style={{ 
                background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
                borderColor: "var(--border)" 
              }}
            >
              {Array.from({ length: HOUR_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center pl-3 border-l"
                  style={{ width: `${hourWidth}px`, borderColor: "var(--border)" }}
                >
                  <span className="text-[0.65rem] md:text-[0.7rem] font-bold font-sans tracking-widest" style={{ color: "var(--text-secondary)" }}>
                    {i.toString().padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical grid lines */}
            <div className="absolute top-[56px] bottom-0 left-0 right-0 flex pointer-events-none z-0 opacity-40 dark:opacity-20">
              {Array.from({ length: HOUR_COUNT }, (_, i) => (
                <div 
                  key={i} 
                  className="shrink-0 border-l" 
                  style={{ width: `${hourWidth}px`, borderColor: "var(--border)" }} 
                />
              ))}
            </div>

            {/* Stand rows / drop targets */}
            <div className="relative z-10">
              {stands.map((stand) => (
                <div
                  key={stand.id}
                  className={`relative h-16 md:h-20 border-b transition-all duration-200 ${
                    dragOverStand === stand.id
                      ? "bg-blue-500/10 border-dashed" // Drop target highlight
                      : "hover:bg-black/5 dark:hover:bg-white/5 border-solid"
                  }`}
                  style={{ 
                    borderColor: dragOverStand === stand.id ? "#3b82f6" : "var(--border)",
                  }}
                  onDragOver={(e) => { e.preventDefault(); onDragOver(stand.id); }}
                  onDragLeave={onDragLeave}
                  onDrop={() => onDrop(stand.id)}
                >
                  {(flightsByStand[stand.id] ?? []).map((f) => (
                    <FlightBlock
                      key={f.id}
                      flight={f}
                      hourWidth={hourWidth}
                      animIndex={animIndexByFlight[f.id] ?? 0}
                      onDragStart={onDragStart}
                      onTooltipEnter={onTooltipEnter}
                      onTooltipLeave={onTooltipLeave}
                      onTooltipMove={onTooltipMove}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* "Now" marker */}
            <div
              className="anim-fade-up absolute bottom-0 top-0 z-20 w-[2px] bg-emerald-500 pointer-events-none"
              style={{ left: mockNowLeft, animationDelay: "0.8s" }}
            >
              <div className="absolute top-0 -translate-x-1/2 rounded-b-md bg-emerald-500 px-2.5 py-1 shadow-sm">
                <span className="text-[0.6rem] font-bold text-white uppercase tracking-widest">Now</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};
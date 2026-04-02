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
      className="anim-fade-up relative flex flex-1 mx-5 mb-5 md:mx-8 md:mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0A0C] shadow-xl"
      style={{ animationDelay: "0.5s" }}
    >
      <div className="flex h-full w-full overflow-y-auto overflow-x-hidden relative">

        {/* ── Stand Sidebar (sticky left) ── */}
        <div className="sticky left-0 z-30 w-16 md:w-28 shrink-0 border-r border-white/[0.06] bg-[#0A0A0C]/80 backdrop-blur-xl">
          <div className="sticky top-0 z-40 flex h-12 md:h-14 items-center justify-center border-b border-white/[0.06] bg-[#0A0A0C]">
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-500">Stands</span>
          </div>

          {stands.map((stand, i) => (
            <div
              key={stand.id}
              className="anim-slide-in-left flex h-16 md:h-20 flex-col items-center justify-center border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
            >
              <span className="text-sm md:text-base font-bold font-sans text-white/80">{stand.id}</span>
              <span className="text-[0.55rem] font-bold uppercase tracking-widest text-white/40 mt-0.5">
                {stand.type}
              </span>
            </div>
          ))}
        </div>

        {/* ── Scrollable Time Grid ── */}
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth"
          ref={timelineWrapperRef}
        >
          <div className="relative h-full" style={{ minWidth: `${HOUR_COUNT * hourWidth}px` }}>

            {/* Time header */}
            <div className="sticky top-0 z-20 flex h-12 md:h-14 border-b border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-2xl">
              {Array.from({ length: HOUR_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center pl-4 border-l border-white/[0.03]"
                  style={{ width: `${hourWidth}px` }}
                >
                  <span className="text-[0.65rem] md:text-xs font-bold text-white/60 font-sans tracking-wider">
                    {i.toString().padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical grid lines */}
            <div className="absolute top-[56px] bottom-0 left-0 right-0 flex pointer-events-none z-0">
              {Array.from({ length: HOUR_COUNT }, (_, i) => (
                <div key={i} className="shrink-0 border-l border-white/[0.04]" style={{ width: `${hourWidth}px` }} />
              ))}
            </div>

            {/* Stand rows / drop targets */}
            <div className="relative z-10">
              {stands.map((stand) => (
                <div
                  key={stand.id}
                  className={`relative h-16 md:h-20 border-b border-white/[0.03] transition-colors duration-200 ${
                    dragOverStand === stand.id
                      ? "bg-white/[0.06] border-dashed border-white/[0.25]"
                      : "hover:bg-white/[0.02]"
                  }`}
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
              className="anim-fade-up absolute bottom-0 top-0 z-10 w-[2px] bg-emerald-400 pointer-events-none shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ left: mockNowLeft, animationDelay: "1.2s" }}
            >
              <div className="absolute top-0 -translate-x-1/2 rounded-b-md bg-emerald-400 px-2 py-1 shadow-lg">
                <span className="text-[0.55rem] font-bold text-black uppercase tracking-widest">Now</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};
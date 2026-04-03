import React from "react";
import { AppHeader }        from "./components/Appheader";
import { GanttTimeline }    from "./components/Gnatt";
import { FlightTooltip }    from "./components/Flighttooltip";
import { useTimeline }      from "./hooks/useTimeline";
import { useFlights }       from "./hooks/useFlights";
import { useTooltip }       from "./hooks/useTooltip";
import { GLOBAL_STYLES }    from "./styles/globalStyles";

export default function OpsControl() {
  const { hourWidth, setHourWidth, timelineWrapperRef } = useTimeline();
  const {
    stands,
    flightsByStand,
    animIndexByFlight,
    dragOverStand,
    setDraggedId,
    setDragOverStand,
    handleDrop,
    isLoading,
    error,
  } = useFlights();
  const { tooltip, show: showTooltip, hide: hideTooltip, move: moveTooltip } = useTooltip();

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      
      {/* ── Main Layout Wrapper ── */}
      <div 
        className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden font-sans transition-colors duration-300 selection:bg-blue-500/30"
        style={{ 
          background: "var(--bg-panel)", 
          color: "var(--text-primary)" 
        }}
      >
        {/* ── Ambient Background Glows ── */}
        {/* Updated to use var(--tool-color) so they match the theme in both light and dark mode */}
        <div 
          className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-30 dark:opacity-10 transition-colors duration-500" 
          style={{ background: "var(--tool-color)" }}
        />
        <div 
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-30 dark:opacity-10 transition-colors duration-500" 
          style={{ background: "var(--tool-color)" }}
        />

        {/* ── Header ── */}
        {/* Notice how clean this is now! No theme props needed. */}
        <AppHeader 
          hourWidth={hourWidth} 
          onZoomChange={setHourWidth} 
        />

        {/* ── Loading state ── */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center gap-3 transition-colors duration-300">
            {/* Spinner using tool-color for the spinning head, and border for the track */}
            <div 
              className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" 
              style={{ 
                borderColor: "var(--border)", 
                borderTopColor: "var(--tool-color)" 
              }} 
            />
            <span 
              className="text-sm font-medium tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Loading schedule…
            </span>
          </div>
        )}

        {/* ── Error state ── */}
        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center z-10">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-center backdrop-blur-md shadow-sm">
              <p className="text-sm font-bold text-red-500 uppercase tracking-wide">Failed to load flight data</p>
              <p className="mt-1 text-xs text-red-500/80 font-medium">{error}</p>
              <p 
                className="mt-3 text-[0.65rem] uppercase tracking-widest font-bold"
                style={{ color: "var(--text-muted)" }}
              >
                Make sure the API is running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {/* ── Gantt (only when data is ready) ── */}
        {!isLoading && !error && (
          <GanttTimeline
            hourWidth={hourWidth}
            stands={stands}
            flightsByStand={flightsByStand}
            animIndexByFlight={animIndexByFlight}
            dragOverStand={dragOverStand}
            timelineWrapperRef={timelineWrapperRef}
            onDragStart={setDraggedId}
            onDragOver={setDragOverStand}
            onDragLeave={() => setDragOverStand(null)}
            onDrop={handleDrop}
            onTooltipEnter={showTooltip}
            onTooltipLeave={hideTooltip}
            onTooltipMove={moveTooltip}
          />
        )}

        {/* ── Floating Tooltip ── */}
        <FlightTooltip state={tooltip} />
      </div>
    </>
  );
}
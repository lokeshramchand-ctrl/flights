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
      <div className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <AppHeader hourWidth={hourWidth} onZoomChange={setHourWidth} isLight={false} onToggleTheme={function (): void {
          throw new Error("Function not implemented.");
        } } />
        {/* <DashboardMetrics /> */}

        {/* ── Loading state ── */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center gap-3 text-gray-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
            <span className="text-sm font-medium tracking-wide">Loading schedule…</span>
          </div>
        )}

        {/* ── Error state ── */}
        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-center">
              <p className="text-sm font-semibold text-red-400">Failed to load flight data</p>
              <p className="mt-1 text-xs text-red-400/70">{error}</p>
              <p className="mt-1 text-xs text-gray-500">Make sure the API is running on http://localhost:8000</p>
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

        <FlightTooltip state={tooltip} />
      </div>
    </>
  );
}
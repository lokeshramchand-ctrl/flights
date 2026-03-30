import { AppHeader }        from "./components/Appheader";
import { DashboardMetrics } from "./components/Dashboardmetrics";
import { GanttTimeline }    from "./components/Gnatt";
import { FlightTooltip }    from "./components/Flighttooltip";
import { useTimeline }      from "./hooks/useTimeline";
import { useFlights }       from "./hooks/useFlights";
import { useTooltip }       from "./hooks/useTooltip";
import { GLOBAL_STYLES }    from "./styles/globalStyles";

/**
 * OpsControl — root component.
 *
 * Responsibilities (only):
 *  1. Inject global styles once
 *  2. Instantiate the three domain hooks
 *  3. Wire hook outputs → component props
 *  4. Lay out the fixed full-screen shell
 *
 * All business logic lives in hooks; all UI lives in components.
 */
export default function OpsControl() {
  const { hourWidth, setHourWidth, timelineWrapperRef } = useTimeline();
  const { flightsByStand, animIndexByFlight, dragOverStand, setDraggedId, setDragOverStand, handleDrop } = useFlights();
  const { tooltip, show: showTooltip, hide: hideTooltip, move: moveTooltip } = useTooltip();

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">

        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <AppHeader
          hourWidth={hourWidth}
          onZoomChange={setHourWidth}
        />

        <DashboardMetrics />

        <GanttTimeline
          hourWidth={hourWidth}
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

        <FlightTooltip state={tooltip} />
      </div>
    </>
  );
}
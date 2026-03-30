import { useState, useCallback } from "react";
import type { TooltipState, Flight } from "../types";

const INITIAL: TooltipState = { visible: false, x: 0, y: 0, flight: null };

/**
 * Manages flight-block tooltip visibility and position.
 * Handlers are stable (memoised) so FlightBlock re-renders are minimal.
 */
export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(INITIAL);

  const show = useCallback((e: React.MouseEvent, flight: Flight) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, flight });
  }, []);

  const hide = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const move = useCallback((e: React.MouseEvent) => {
    setTooltip((t) => ({ ...t, x: e.clientX, y: e.clientY }));
  }, []);

  return { tooltip, show, hide, move };
}
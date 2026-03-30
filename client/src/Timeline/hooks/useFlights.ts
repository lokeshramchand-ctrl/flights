import { useState, useCallback } from "react";
import { INITIAL_FLIGHTS, STANDS_DATA } from "../data";
import { detectConflicts } from "../utils";
import type { Flight, Stand } from "../types";

export interface FlightsState {
  flights:         Flight[];
  draggedId:       string | null;
  dragOverStand:   string | null;
  /** flights keyed by stand id, ready for the Gantt rows */
  flightsByStand:  Record<string, Flight[]>;
  /** stable animation index per flight id */
  animIndexByFlight: Record<string, number>;
  setDraggedId:    (id: string | null) => void;
  setDragOverStand:(id: string | null) => void;
  handleDrop:      (standId: string) => void;
}

/**
 * Manages all flight-related state:
 * - initial flights with conflict detection applied
 * - drag-and-drop reassignment (updates conflict flags after every move)
 * - derived `flightsByStand` map consumed by Gantt rows
 * - stable per-flight animation index (used for staggered entry delays)
 */
export function useFlights(stands: Stand[] = STANDS_DATA): FlightsState {
  const [flights,       setFlights]       = useState<Flight[]>(() => detectConflicts(INITIAL_FLIGHTS));
  const [draggedId,     setDraggedId]     = useState<string | null>(null);
  const [dragOverStand, setDragOverStand] = useState<string | null>(null);

  const handleDrop = useCallback((standId: string) => {
    setDragOverStand(null);
    if (!draggedId) return;
    setFlights((prev) => {
      const updated = prev.map((f) =>
        f.id === draggedId ? { ...f, assigned_stand: standId } : f
      );
      return detectConflicts(updated);
    });
    setDraggedId(null);
  }, [draggedId]);

  // Group flights by stand id
  const flightsByStand: Record<string, Flight[]> = stands.reduce<Record<string, Flight[]>>(
    (acc, s) => {
      acc[s.id] = flights.filter((f) => f.assigned_stand === s.id);
      return acc;
    },
    {},
  );

  // Build a stable index map for staggered pop-in animation delays
  const animIndexByFlight: Record<string, number> = {};
  flights.forEach((f, i) => { animIndexByFlight[f.id] = i; });

  return {
    flights,
    draggedId,
    dragOverStand,
    flightsByStand,
    animIndexByFlight,
    setDraggedId,
    setDragOverStand,
    handleDrop,
  };
}
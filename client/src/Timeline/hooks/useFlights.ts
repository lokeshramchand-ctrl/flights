import { useState, useEffect, useCallback } from "react";
import { detectConflicts } from "../utils";
import type { Flight, Stand } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; // Fetch from .env or fallback

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchAllFlights(): Promise<Flight[]> {
  const res = await fetch(`${BASE_URL}/flights?per_page=100`);
  const data = await res.json();
  return data.data as Flight[];
}
async function fetchAllStands(): Promise<Stand[]> {
  const res = await fetch(`${BASE_URL}/stands`);
  const data = await res.json();
  return data.data as Stand[];   
}

async function apiReassign(flightId: string, standId: string): Promise<Flight> {
  const res = await fetch(`${BASE_URL}/flights/${flightId}/reassign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_stand_id: standId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `Reassign failed (${res.status})`);
  return data as Flight;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlightsState {
  flights: Flight[];
  stands: Stand[];
  isLoading: boolean;
  error: string | null;
  draggedId: string | null;
  dragOverStand: string | null;
  flightsByStand: Record<string, Flight[]>;
  animIndexByFlight: Record<string, number>;
  setDraggedId: (id: string | null) => void;
  setDragOverStand: (id: string | null) => void;
  handleDrop: (standId: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFlights(): FlightsState {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [stands, setStands] = useState<Stand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStand, setDragOverStand] = useState<string | null>(null);

  // ── Load from API on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [rawFlights, rawStands] = await Promise.all([
          fetchAllFlights(),
          fetchAllStands(),
        ]);
        if (cancelled) return;
        setFlights(detectConflicts(rawFlights));
        setStands(rawStands);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message ?? "Failed to load data from API.");
        console.error("[useFlights] load error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // ── Drag-and-drop drop handler ──────────────────────────────────────────────
  const handleDrop = useCallback((standId: string) => {
    setDragOverStand(null);
    if (!draggedId) return;

    const flightId = draggedId;
    setDraggedId(null);

    // Optimistic update — move the block immediately in the UI
    setFlights((prev) => {
      const updated = prev.map((f) =>
        f.id === flightId ? { ...f, assigned_stand: standId } : f
      );
      return detectConflicts(updated);
    });

    // Persist to backend — roll back on failure
    apiReassign(flightId, standId)
      .then((updatedFlight) => {
        // Replace the flight with the server's canonical version
        setFlights((prev) => {
          const updated = prev.map((f) => (f.id === flightId ? updatedFlight : f));
          return detectConflicts(updated);
        });
      })
      .catch((err: Error) => {
        console.error("[useFlights] reassign failed:", err.message);

        // ── Show a brief toast so the user knows why it snapped back ──
        const toast = document.createElement("div");
        toast.textContent = `Error :  ${err.message}`;
        toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #18181b; color: #f87171; border: 1px solid rgba(248,113,113,0.2);
    padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;
    z-index: 9999; pointer-events: none; white-space: nowrap;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);

        // Roll back
        fetchAllFlights()
          .then((fresh) => setFlights(detectConflicts(fresh)))
          .catch(() => { });
      });
  }, [draggedId]);

  // ── Derived maps (same logic as before) ────────────────────────────────────
  const flightsByStand: Record<string, Flight[]> = stands.reduce<Record<string, Flight[]>>(
    (acc, s) => {
      acc[s.id] = flights.filter((f) => f.assigned_stand === s.id);
      return acc;
    },
    {},
  );

  const animIndexByFlight: Record<string, number> = {};
  flights.forEach((f, i) => { animIndexByFlight[f.id] = i; });

  return {
    flights,
    stands,
    isLoading,
    error,
    draggedId,
    dragOverStand,
    flightsByStand,
    animIndexByFlight,
    setDraggedId,
    setDragOverStand,
    handleDrop,
  };
}
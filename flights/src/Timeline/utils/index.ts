import type { Flight } from "../types";

// ─── Time Helpers ─────────────────────────────────────────────────────────────

/**
 * Convert an ISO-8601 string to decimal hours in UTC.
 * e.g. "2025-01-15T06:30:00Z" → 6.5
 */
export const getDecimalHours = (isoStr: string): number => {
  const d = new Date(isoStr);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
};

/**
 * Format an ISO-8601 string to HH:MM (UTC).
 * e.g. "2025-01-15T06:30:00Z" → "06:30"
 */
export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

// ─── Conflict Detection ───────────────────────────────────────────────────────

/**
 * Returns a new flights array with the `conflict` flag set on any two flights
 * that share the same assigned stand and have overlapping block times.
 *
 * Uses an O(n²) check per stand group, which is fine for ≤ ~100 flights.
 */
export const detectConflicts = (flights: Flight[]): Flight[] => {
  // Deep-clone conflict flags
  const result = flights.map((f) => ({ ...f, conflict: false }));

  // Group by stand
  const byStand: Record<string, Flight[]> = {};
  result.forEach((f) => {
    (byStand[f.assigned_stand] ??= []).push(f);
  });

  // Pairwise overlap test within each stand group
  Object.values(byStand).forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const s1 = getDecimalHours(group[i].block_time_start);
        const e1 = getDecimalHours(group[i].block_time_end);
        const s2 = getDecimalHours(group[j].block_time_start);
        const e2 = getDecimalHours(group[j].block_time_end);
        if (s1 < e2 && e1 > s2) {
          group[i].conflict = true;
          group[j].conflict = true;
        }
      }
    }
  });

  return result;
};

// ─── Animation / Easing ──────────────────────────────────────────────────────

/** Cubic ease-out: fast start, decelerates to rest. */
export const cubicEaseOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Quartic ease-out: even faster start, smoother deceleration. */
export const quarticEaseOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Animate a numeric property from `startVal` to `endVal` over `duration` ms,
 * calling `onTick` on every animation frame and `onDone` when finished.
 *
 * Returns a cancel function.
 */
export const animateTo = (
  startVal: number,
  endVal: number,
  duration: number,
  easeFn: (t: number) => number,
  onTick: (val: number) => void,
  onDone?: () => void,
): (() => void) => {
  const startTime = performance.now();
  let rafId: number;

  const tick = (now: number) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeFn(progress);
    onTick(startVal + (endVal - startVal) * eased);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
};
import { useState, useEffect, useRef } from "react";
import { DEFAULT_HOUR_WIDTH, MOBILE_HOUR_WIDTH, MOCK_NOW_DECIMAL } from "../data";
import { quarticEaseOut } from "../utils";

/**
 * Manages the Gantt timeline's zoom level (hourWidth) and performs a
 * one-time animated scroll to centre the "current time" marker on mount.
 *
 * Returns:
 *  - `hourWidth`          — pixels per hour
 *  - `setHourWidth`       — setter wired to the zoom slider
 *  - `timelineWrapperRef` — attach to the horizontally-scrollable container
 */
export function useTimeline() {
  const [hourWidth, setHourWidth] = useState(DEFAULT_HOUR_WIDTH);
  const timelineWrapperRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const hasScrolled = useRef(false);

  // Shrink hourWidth on narrow screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setHourWidth(MOBILE_HOUR_WIDTH);
    }
  }, []);

  // One-time animated scroll to "now"
  useEffect(() => {
    if (hasScrolled.current) return;
    hasScrolled.current = true;

    const wrapper = timelineWrapperRef.current;
    if (!wrapper) return;

    const targetX  = MOCK_NOW_DECIMAL * hourWidth - (window.innerWidth / 2 - 100);
    const startX   = wrapper.scrollLeft;
    const duration = 2000;

    let rafId: number;

    const delayId = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        wrapper.scrollLeft = startX + (targetX - startX) * quarticEaseOut(progress);
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(delayId);
      cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  return { hourWidth, setHourWidth, timelineWrapperRef };
}
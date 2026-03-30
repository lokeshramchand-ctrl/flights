import { useState, useEffect } from "react";
import { cubicEaseOut } from "../utils";

/**
 * Animates an integer counter from 0 → `target` over `duration` ms,
 * starting after an optional `delay` ms.
 *
 * Uses a cubic ease-out curve for a natural deceleration feel.
 */
export function useCounterAnimation(
  target: number,
  duration = 2000,
  delay = 300,
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setValue(Math.round(cubicEaseOut(progress) * target));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}
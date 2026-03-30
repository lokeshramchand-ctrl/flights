import { useState } from "react";
import type { LayerVisibility } from "../types";

/**
 * Manages the two topology-layer toggle flags:
 *  - `showConstraints` — adjacency/wingtip constraint edges (red dashed)
 *  - `showRoutes`      — walking & bus edges (grey/amber dashed)
 */
export function useLayerVisibility(): LayerVisibility & {
  toggleConstraints: () => void;
  toggleRoutes:      () => void;
  setShowConstraints:(v: boolean) => void;
  setShowRoutes:     (v: boolean) => void;
} {
  const [showConstraints, setShowConstraints] = useState(true);
  const [showRoutes,      setShowRoutes]      = useState(true);

  return {
    showConstraints,
    showRoutes,
    toggleConstraints: () => setShowConstraints((v) => !v),
    toggleRoutes:      () => setShowRoutes((v) => !v),
    setShowConstraints,
    setShowRoutes,
  };
}
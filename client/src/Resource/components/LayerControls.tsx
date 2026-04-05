import React from "react";
import { Layers, ShieldAlert, Footprints } from "lucide-react";

interface LayerControlsProps {
  showConstraints:    boolean;
  showRoutes:         boolean;
  onToggleConstraints:(v: boolean) => void;
  onToggleRoutes:     (v: boolean) => void;
}

/** Reusable theme-aware toggle switch */
const Toggle: React.FC<{
  checked:   boolean;
  onChange:  (v: boolean) => void;
  activeColor: string; // e.g. "bg-red-500"
  label:     React.ReactNode;
}> = ({ checked, onChange, activeColor, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`w-9 h-5 rounded-full transition-colors duration-300 relative ${
        checked ? activeColor : "bg-black/20 dark:bg-white/10"
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
    <span 
      className="text-sm font-medium transition-colors flex items-center gap-2 group-hover:opacity-80"
      style={{ color: "var(--text-primary)" }}
    >
      {label}
    </span>
  </label>
);

/**
 * LayerControls — bottom-right panel for toggling topology edge categories.
 * Fully responsive to Light/Dark CSS variables.
 */
export const LayerControls: React.FC<LayerControlsProps> = ({
  showConstraints,
  showRoutes,
  onToggleConstraints,
  onToggleRoutes,
}) => (
  <div 
    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex flex-col gap-3 backdrop-blur-xl border p-5 rounded-2xl transition-colors duration-300"
    style={{
      background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
      borderColor: "var(--border)",
      boxShadow: "var(--card-shadow)"
    }}
  >
    <div 
      className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest"
      style={{ color: "var(--text-muted)" }}
    >
      <Layers size={14} /> Topology Layers
    </div>

    <Toggle
      checked={showConstraints}
      onChange={onToggleConstraints}
      activeColor="bg-red-500"
      label={
        <>
          <ShieldAlert size={14} className="text-red-500" />
          Adjacency Constraints
        </>
      }
    />

    <Toggle
      checked={showRoutes}
      onChange={onToggleRoutes}
      activeColor="bg-amber-500"
      label={
        <>
          <Footprints size={14} className="text-amber-500" />
          Ground Routing
        </>
      }
    />
  </div>
);
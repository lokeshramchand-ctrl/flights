import React from "react";
import { Layers, ShieldAlert, Footprints } from "lucide-react";

interface LayerControlsProps {
  showConstraints:    boolean;
  showRoutes:         boolean;
  onToggleConstraints:(v: boolean) => void;
  onToggleRoutes:     (v: boolean) => void;
}

/** Reusable toggle switch sub-component */
const Toggle: React.FC<{
  checked:   boolean;
  onChange:  (v: boolean) => void;
  activeColor: string; // e.g. "bg-red-500"
  label:     React.ReactNode;
}> = ({ checked, onChange, activeColor, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`w-9 h-5 rounded-full transition-colors relative ${checked ? activeColor : "bg-gray-700"}`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
      {label}
    </span>
  </label>
);

/**
 * LayerControls — bottom-left panel for toggling topology edge categories.
 * Fully controlled: all state lives in the parent (useLayerVisibility hook).
 */
export const LayerControls: React.FC<LayerControlsProps> = ({
  showConstraints,
  showRoutes,
  onToggleConstraints,
  onToggleRoutes,
}) => (
  <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-3 bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
    <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
      <Layers size={14} /> Topology Layers
    </div>

    <Toggle
      checked={showConstraints}
      onChange={onToggleConstraints}
      activeColor="bg-red-500"
      label={
        <>
          <ShieldAlert size={14} className="text-red-400" />
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
          <Footprints size={14} className="text-amber-400" />
          Ground Routing
        </>
      }
    />
  </div>
);
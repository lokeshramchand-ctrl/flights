import React from "react";
import { X, Plane, Info } from "lucide-react";
import type { Node } from "reactflow";
import type { StandNodeData } from "../types";

interface NodeDetailPanelProps {
  selectedNode: Node | null;
  onClose:      () => void;
}

/**
 * NodeDetailPanel — slides in from the right when a node is selected.
 *
 * Uses CSS transform rather than conditional rendering so the slide-out
 * animation plays before the element is hidden.
 *
 * Renders different content for `gate` vs `stand` node types.
 */
export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  selectedNode,
  onClose,
}) => {
  const isOpen = Boolean(selectedNode);

  return (
    <aside
      className={`w-80 bg-[#0A0A0C] border-l border-white/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full absolute right-0 h-full z-20"
      }`}
    >
      {selectedNode && (
        <>
          {/* ── Header ── */}
          <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/[0.02]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                {selectedNode.type === "gate" ? "Terminal Gate" : "Aircraft Stand"}
              </div>
              <h2 className="text-3xl font-bold font-mono text-white">
                {selectedNode.data.label}
              </h2>
              <span
                className={`inline-block mt-2 px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-widest border ${
                  selectedNode.data.terminal === "T1"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                }`}
              >
                {selectedNode.data.terminal}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-6 flex flex-col gap-6">
            {selectedNode.type === "stand" && (
              <StandDetail data={selectedNode.data as StandNodeData} />
            )}
            {selectedNode.type === "gate" && (
              <GateDetail />
            )}
          </div>
        </>
      )}
    </aside>
  );
};

// ─── Stand Detail ─────────────────────────────────────────────────────────────

const StandDetail: React.FC<{ data: StandNodeData }> = ({ data }) => (
  <>
    {/* Occupancy status */}
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
        Current Status
      </span>

      {data.status === "occupied" ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-emerald-500/20">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Plane size={20} />
            </div>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {data.flight}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Aircraft</span>
            <span className="font-mono font-bold text-gray-200">{data.aircraft}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium text-gray-400">
          Stand is currently empty and available for allocation.
        </div>
      )}
    </div>

    {/* Properties grid */}
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
        Properties
      </span>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Max Size Code", value: data.maxSize || "N/A" },
          { label: "Boarding Type", value: data.type },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="text-[0.65rem] uppercase text-gray-500 mb-1">{label}</div>
            <div className="font-mono text-sm text-white capitalize">{value}</div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// ─── Gate Detail ──────────────────────────────────────────────────────────────

const GateDetail: React.FC = () => (
  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm leading-relaxed text-gray-300">
    <Info size={16} className="inline mb-1 mr-2 text-blue-400" />
    This gate acts as a passenger holding node. Check the edges connecting
    this gate to verify PLB, bus, or walking statuses to individual stands.
  </div>
);
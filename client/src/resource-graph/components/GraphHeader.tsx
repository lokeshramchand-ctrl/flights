import React from "react";

/**
 * GraphHeader — absolute-positioned title overlay in the top-left of the canvas.
 * pointer-events: none so it never blocks graph interactions.
 */
export const GraphHeader: React.FC = () => (
  <div className="absolute top-6 left-6 z-10 pointer-events-none">
    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
      Resource Network
      <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[0.65rem] uppercase tracking-widest text-blue-400 font-bold">
        Live
      </span>
    </h1>
    <p className="text-sm text-gray-400 mt-1">
      LHR Topology mapped to active JSON schema
    </p>
  </div>
);
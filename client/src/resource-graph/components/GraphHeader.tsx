import React from "react";

/**
 * GraphHeader — absolute-positioned title overlay in the top-left of the canvas.
 * pointer-events: none so it never blocks graph interactions.
 */
export const GraphHeader: React.FC = () => (
  <div className="absolute top-6 left-6 z-10 pointer-events-none">
    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
      Resource Network

    </h1>

  </div>
);
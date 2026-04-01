import React from "react";

/**
 * GraphHeader — absolute-positioned title overlay in the top-left of the canvas.
 * pointer-events: none so it never blocks graph interactions.
 */
export const GraphHeader: React.FC = () => (
  <div className="absolute top-6 left-6 z-10">
    <div className="pointer-events-none">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
        Resource Network
      </h1>
    </div>

    {/* Navbar buttons */}
    <div className="pointer-events-auto">
      <nav className="flex gap-3">
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/timeline"}
        >
          Gnatt
        </button>
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/chat"}
        >
          Chat
        </button>
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/resource-graph"}
        >
          Resource Graph
        </button>
      </nav>
    </div>
  </div>
);
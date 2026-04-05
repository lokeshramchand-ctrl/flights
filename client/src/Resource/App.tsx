import { useMemo, useState } from "react";
import { useNodesState, useEdgesState, type Node } from "reactflow";

import { GraphCanvas }      from "./components/GraphCanvas";
import { GraphHeader }      from "./components/GraphHeader";
import { LayerControls }    from "./components/LayerControls";
import { NodeDetailPanel }  from "./components/NodeDetailPanel";

import { useGraphHighlight } from "./hooks/useGraphHighlight";
import { useLayerVisibility} from "./hooks/useLayerVisibility";
import { useDisplayGraph }   from "./hooks/useDisplayGraph";

import { generateGraphData } from "./utils/graphTransformer";
import { GLOBAL_STYLES }     from "./styles/globalStyles";

/**
 * ResourceGraph — root component.
 *
 * Responsibilities (only):
 * 1. Inject global styles once
 * 2. Initialise ReactFlow state (useNodesState / useEdgesState)
 * 3. Wire domain hooks → derived display data
 * 4. Pass props down to pure presentational components
 *
 * Zero business logic lives here — all logic is in hooks or utilities.
 */
export default function ResourceGraph() {
  // ── Stable initial data ────────────────────────────────────────────────────
  const initialData = useMemo(() => generateGraphData(), []);

  // ── ReactFlow core state ───────────────────────────────────────────────────
  const [nodes, , onNodesChange] = useNodesState(initialData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(initialData.edges);

  // ── Interaction state ──────────────────────────────────────────────────────
  const [hoveredNodeId,  setHoveredNodeId]  = useState<string | null>(null);
  const [selectedNode,   setSelectedNode]   = useState<Node | null>(null);

  // ── Domain hooks ───────────────────────────────────────────────────────────
  const { highlightedNodes, highlightedEdges } = useGraphHighlight(hoveredNodeId, edges);
  const layerVisibility = useLayerVisibility();

  const { displayNodes, displayEdges } = useDisplayGraph({
    nodes,
    edges,
    highlightedNodes,
    highlightedEdges,
    hoveredNodeId,
    layerVisibility,
  });

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Main Layout Wrapper ── */}
      <div 
        className="fixed inset-0 w-screen h-screen font-sans overflow-hidden flex transition-colors duration-300 selection:bg-blue-500/30"
        style={{
          background: "var(--bg-panel)",
          color: "var(--text-primary)"
        }}
      >
        {/* ── Ambient Background Glows ── */}
        {/* Ties the aesthetic together with your Gantt Timeline view */}
        <div 
          className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-30 dark:opacity-10 transition-colors duration-500 z-0" 
          style={{ background: "var(--tool-color)" }}
        />
        <div 
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-30 dark:opacity-10 transition-colors duration-500 z-0" 
          style={{ background: "var(--tool-color)" }}
        />

        {/* ── Canvas area ── */}
        <div className="flex-1 relative z-10">
          <GraphCanvas
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeHover={setHoveredNodeId}
            onNodeSelect={setSelectedNode}
          />

          <GraphHeader />

          <LayerControls
            showConstraints={layerVisibility.showConstraints}
            showRoutes={layerVisibility.showRoutes}
            onToggleConstraints={layerVisibility.setShowConstraints}
            onToggleRoutes={layerVisibility.setShowRoutes}
          />
        </div>

        {/* ── Right info panel ── */}
        <NodeDetailPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />

      </div>
    </>
  );
}
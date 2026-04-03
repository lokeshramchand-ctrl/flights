import React from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodeTypes";

interface GraphCanvasProps {
  nodes:           Node[];
  edges:           Edge[];
  onNodesChange:   OnNodesChange;
  onEdgesChange:   OnEdgesChange;
  onNodeHover:     (id: string | null) => void;
  onNodeSelect:    (node: Node | null) => void;
}

/**
 * GraphCanvas — thin, presentational wrapper around ReactFlow.
 * Fully responsive to global Light/Dark CSS variables.
 */
export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeHover,
  onNodeSelect,
}) => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onNodeMouseEnter={(_, node) => onNodeHover(node.id)}
    onNodeMouseLeave={() => onNodeHover(null)}
    onNodeClick={(_, node) => onNodeSelect(node)}
    onPaneClick={() => onNodeSelect(null)}
    fitView
    fitViewOptions={{ padding: 0.3 }}
    minZoom={0.5}
    maxZoom={2}
  >
    {/* ── Theme-Aware Canvas Background ── */}
    {/* Uses your global border variable so the grid dots perfectly match the theme */}
    <Background color="var(--border)" gap={24} size={2} />
    
    {/* ── Theme-Aware Controls (Zoom/Pan) ── */}
    <Controls 
      className="shadow-sm border rounded-lg overflow-hidden m-4 sm:m-6 transition-colors duration-300"
      style={{
        borderColor: "var(--border)",
      }}
    />
  </ReactFlow>
);
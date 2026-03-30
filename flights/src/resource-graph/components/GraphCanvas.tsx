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
 *
 * All interaction events are surfaced as props so the parent can
 * update hover/selection state without this component holding any state.
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
    <Background color="#27272a" gap={24} size={2} />
    <Controls className="shadow-2xl border border-white/10 rounded-lg overflow-hidden m-6" />
  </ReactFlow>
);
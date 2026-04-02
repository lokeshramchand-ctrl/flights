import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import type { LayerVisibility } from "../types";

interface UseDisplayGraphParams {
  nodes:             Node[];
  edges:             Edge[];
  highlightedNodes:  Set<string>;
  highlightedEdges:  Set<string>;
  hoveredNodeId:     string | null;
  layerVisibility:   LayerVisibility;
}

/**
 * Derives the final display-ready nodes and edges for the ReactFlow canvas.
 *
 * Concerns handled here:
 *  1. Dimming non-highlighted nodes/edges when a node is hovered
 *  2. Hiding edge categories based on layer-visibility toggles
 *
 * Kept as a separate hook so the derivation is easy to test and
 * the root component stays free of inline transform logic.
 */
export function useDisplayGraph({
  nodes,
  edges,
  highlightedNodes,
  highlightedEdges,
  hoveredNodeId,
  layerVisibility,
}: UseDisplayGraphParams) {
  const { showConstraints, showRoutes } = layerVisibility;

  const displayNodes: Node[] = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        style: {
          opacity:    hoveredNodeId && !highlightedNodes.has(n.id) ? 0.2 : 1,
          transition: "opacity 0.3s ease",
        },
      })),
    [nodes, hoveredNodeId, highlightedNodes],
  );

  const displayEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => {
        const isConstraint = e.data?.type === "constraint";
        const isRoute      = e.data?.type === "bus" || e.data?.type === "walking";
        const hidden       = (isConstraint && !showConstraints) || (isRoute && !showRoutes);

        return {
          ...e,
          hidden,
          style: {
            ...e.style,
            opacity:
              hoveredNodeId && !highlightedEdges.has(e.id)
                ? 0.05
                : hidden
                ? 0
                : 1,
            transition: "opacity 0.3s ease",
          },
        };
      }),
    [edges, hoveredNodeId, highlightedEdges, showConstraints, showRoutes],
  );

  return { displayNodes, displayEdges };
}
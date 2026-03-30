import { useMemo } from "react";
import type { Edge } from "reactflow";

interface HighlightResult {
  highlightedNodes: Set<string>;
  highlightedEdges: Set<string>;
}

/**
 * Given the currently-hovered node id and the full edge list,
 * returns the set of nodes and edges that should be highlighted
 * (i.e., the hovered node + its direct neighbours + connecting edges).
 *
 * Returns empty sets when nothing is hovered, which the caller
 * interprets as "no dimming applied".
 */
export function useGraphHighlight(
  hoveredNodeId: string | null,
  edges: Edge[],
): HighlightResult {
  return useMemo(() => {
    if (!hoveredNodeId) {
      return { highlightedNodes: new Set(), highlightedEdges: new Set() };
    }

    const highlightedEdges = new Set<string>();
    const highlightedNodes = new Set<string>([hoveredNodeId]);

    edges.forEach((e) => {
      if (e.source === hoveredNodeId || e.target === hoveredNodeId) {
        highlightedEdges.add(e.id);
        highlightedNodes.add(e.source);
        highlightedNodes.add(e.target);
      }
    });

    return { highlightedNodes, highlightedEdges };
  }, [hoveredNodeId, edges]);
}
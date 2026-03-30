import type { Node, Edge } from "reactflow";
import { MOCK_DATA } from "../data/mockData";
import type { GateNodeData, StandNodeData } from "../types";

// ─── Edge style factories ─────────────────────────────────────────────────────

const plbEdgeStyle = (): React.CSSProperties => ({
  stroke: "#3b82f6",
  strokeWidth: 3,
});

const walkEdgeStyle = (type: "walking" | "bus"): React.CSSProperties => ({
  stroke: type === "bus" ? "#f59e0b" : "#a8a29e",
  strokeWidth: 2,
  strokeDasharray: "6,6",
});

const constraintEdgeStyle = (): React.CSSProperties => ({
  stroke: "#ef4444",
  strokeWidth: 2,
  strokeDasharray: "4,4",
});

// ─── Main transformer ─────────────────────────────────────────────────────────

/**
 * generateGraphData
 *
 * Pure function — takes no arguments, reads only from the imported constant,
 * and returns plain ReactFlow `Node[]` + `Edge[]` objects.
 *
 * Swap `MOCK_DATA` for a parameter when migrating to a live data source.
 */
export const generateGraphData = (): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ── Gate nodes ──────────────────────────────────────────────────────────────
  MOCK_DATA.gates.forEach((g) => {
    nodes.push({
      id: g.id,
      type: "gate",
      position: g.position,
      data: {
        label:    g.id,
        terminal: g.terminal,
      } satisfies GateNodeData,
    });
  });

  // ── Stand nodes ─────────────────────────────────────────────────────────────
  MOCK_DATA.stands.forEach((s) => {
    // First matching flight = "current occupant" heuristic
    const activeFlight = MOCK_DATA.flights.find((f) => f.assigned_stand === s.id);

    nodes.push({
      id: s.id,
      type: "stand",
      position: s.position,
      data: {
        label:    s.id,
        terminal: s.terminal,
        type:     s.type,
        maxSize:  s.max_aircraft_size,
        status:   activeFlight ? "occupied" : "available",
        flight:   activeFlight?.flight_number,
        aircraft: activeFlight?.aircraft_type,
      } satisfies StandNodeData,
    });
  });

  // ── PLB edges ───────────────────────────────────────────────────────────────
  MOCK_DATA.graph_edges.plb_connections.forEach((e) => {
    edges.push({
      id:           `plb-${e.gate}-${e.stand}`,
      source:       e.gate,
      target:       e.stand,
      type:         "smoothstep",
      sourceHandle: "left",
      targetHandle: "right",
      data:         { type: "plb" },
      style:        plbEdgeStyle(),
    });
  });

  // ── Walking / bus edges ─────────────────────────────────────────────────────
  MOCK_DATA.graph_edges.walking_connections.forEach((e) => {
    edges.push({
      id:           `walk-${e.gate}-${e.stand}`,
      source:       e.gate,
      target:       e.stand,
      type:         "smoothstep",
      sourceHandle: "left",
      targetHandle: "right",
      animated:     true,
      data:         { type: e.type },
      style:        walkEdgeStyle(e.type),
    });
  });

  // ── Adjacency constraint edges ──────────────────────────────────────────────
  MOCK_DATA.graph_edges.adjacency_constraints.forEach((e) => {
    edges.push({
      id:           `adj-${e.stand_a}-${e.stand_b}`,
      source:       e.stand_a,
      target:       e.stand_b,
      type:         "straight",
      sourceHandle: "bottom",
      targetHandle: "top",
      data:         { type: "constraint" },
      style:        constraintEdgeStyle(),
    });
  });

  return { nodes, edges };
};
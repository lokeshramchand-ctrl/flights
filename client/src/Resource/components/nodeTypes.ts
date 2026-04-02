import  GateNode   from "./GateNode";
import { StandNode } from "./StandNode";

/**
 * nodeTypes — stable object reference passed to <ReactFlow nodeTypes={...} />.
 *
 * Defined outside any component to prevent ReactFlow from re-registering
 * node types on every render (which causes nodes to flicker / remount).
 */
export const nodeTypes = {
  gate:  GateNode,
  stand: StandNode,
} as const;
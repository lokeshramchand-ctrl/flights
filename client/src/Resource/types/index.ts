// ─── Domain Types ─────────────────────────────────────────────────────────────

export type Terminal    = "T1" | "T2";
export type FlightStatus = "on_time" | "early" | "delayed";
export type StandType   = "contact" | "remote";
export type GateType    = "contact" | "non_contact";
export type EdgeType    = "plb" | "walking" | "bus" | "wingtip" | "adjacency" | "constraint";

export interface Position2D {
  x: number;
  y: number;
}

export interface RawFlight {
  id: string;
  flight_number: string;
  aircraft_type: string;
  assigned_stand: string;
  status: FlightStatus;
  estimated_time: string; // ISO 8601
}

export interface RawStand {
  id: string;
  terminal: Terminal;
  type: StandType;
  max_aircraft_size: string;
  position: Position2D;
}

export interface RawGate {
  id: string;
  terminal: Terminal;
  type: GateType;
  position: Position2D;
}

export interface RawPlbConnection {
  stand: string;
  gate: string;
  type: "plb";
}

export interface RawWalkingConnection {
  stand: string;
  gate: string;
  type: "walking" | "bus";
}

export interface RawAdjacencyConstraint {
  stand_a: string;
  stand_b: string;
  type: "wingtip" | "adjacency";
}

export interface MockData {
  flights: RawFlight[];
  stands:  RawStand[];
  gates:   RawGate[];
  graph_edges: {
    plb_connections:       RawPlbConnection[];
    walking_connections:   RawWalkingConnection[];
    adjacency_constraints: RawAdjacencyConstraint[];
  };
}

// ─── ReactFlow Node Data Shapes ───────────────────────────────────────────────

export interface GateNodeData {
  label:    string;
  terminal: Terminal;
}

export interface StandNodeData {
  label:    string;
  terminal: Terminal;
  type:     StandType;
  maxSize:  string;
  status:   "occupied" | "available";
  flight?:  string;
  aircraft?: string;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export interface LayerVisibility {
  showConstraints: boolean;
  showRoutes:      boolean;
}
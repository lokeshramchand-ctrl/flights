// ─── Domain Types ─────────────────────────────────────────────────────────────

export type Terminal = "T1" | "T2";
export type StandType = "contact" | "remote";
export type FlightStatus = "on_time" | "early" | "delayed";

export interface Stand {
  id: string;
  terminal: Terminal;
  type: StandType;
}

export interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  aircraft_type: string;
  terminal: Terminal;
  assigned_stand: string;
  block_time_start: string; // ISO 8601
  block_time_end: string;   // ISO 8601
  status: FlightStatus;
  pax_count: number;
  conflict?: boolean;
}

// ─── Dashboard / Metric Types ─────────────────────────────────────────────────

export interface DashboardData {
  on_time_performance:  { current: number; previous: number; unit: string };
  stand_utilization:    { occupied: number; total: number; unit: string };
  upcoming_arrivals_2h: { total: number; on_time: number; delayed: number };
  plb_usage:            { current: number; target: number; unit: string };
}

// ─── UI / State Types ─────────────────────────────────────────────────────────

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  flight: Flight | null;
}
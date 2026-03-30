import type { DashboardData, Stand, Flight } from "../types";

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export const DASHBOARD_DATA: DashboardData = {
  on_time_performance:  { current: 78,  previous: 82, unit: "%" },
  stand_utilization:    { occupied: 7,  total: 10,    unit: "stands" },
  upcoming_arrivals_2h: { total: 4,     on_time: 3,   delayed: 1 },
  plb_usage:            { current: 71,  target: 85,   unit: "%" },
};

// ─── Stands ───────────────────────────────────────────────────────────────────

export const STANDS_DATA: Stand[] = [
  { id: "A1-01", terminal: "T1", type: "contact" },
  { id: "A1-02", terminal: "T1", type: "contact" },
  { id: "A1-03", terminal: "T1", type: "contact" },
  { id: "A1-04", terminal: "T1", type: "contact" },
  { id: "A1-05", terminal: "T1", type: "remote"  },
  { id: "B1-01", terminal: "T2", type: "contact" },
  { id: "B1-02", terminal: "T2", type: "contact" },
  { id: "B1-03", terminal: "T2", type: "contact" },
  { id: "B1-04", terminal: "T2", type: "remote"  },
  { id: "B1-05", terminal: "T2", type: "remote"  },
];

// ─── Flights ──────────────────────────────────────────────────────────────────

export const INITIAL_FLIGHTS: Flight[] = [
  { id: "FL001", flight_number: "EK203", airline: "Emirates",            aircraft_type: "A380",        terminal: "T1", assigned_stand: "A1-01", block_time_start: "2025-01-15T06:30:00Z", block_time_end: "2025-01-15T08:45:00Z", status: "on_time", pax_count: 489 },
  { id: "FL002", flight_number: "QR501", airline: "Qatar Airways",       aircraft_type: "B777-300ER",  terminal: "T1", assigned_stand: "A1-01", block_time_start: "2025-01-15T10:15:00Z", block_time_end: "2025-01-15T12:30:00Z", status: "delayed", pax_count: 356 },
  { id: "FL003", flight_number: "BA107", airline: "British Airways",     aircraft_type: "B787-9",      terminal: "T1", assigned_stand: "A1-02", block_time_start: "2025-01-15T07:00:00Z", block_time_end: "2025-01-15T09:15:00Z", status: "on_time", pax_count: 264 },
  { id: "FL004", flight_number: "LH752", airline: "Lufthansa",           aircraft_type: "A340-600",    terminal: "T1", assigned_stand: "A1-02", block_time_start: "2025-01-15T11:30:00Z", block_time_end: "2025-01-15T14:00:00Z", status: "on_time", pax_count: 291 },
  { id: "FL005", flight_number: "SQ321", airline: "Singapore Airlines",  aircraft_type: "A350-900",    terminal: "T1", assigned_stand: "A1-03", block_time_start: "2025-01-15T08:45:00Z", block_time_end: "2025-01-15T11:00:00Z", status: "on_time", pax_count: 303 },
  { id: "FL006", flight_number: "EK512", airline: "Emirates",            aircraft_type: "B777-300ER",  terminal: "T1", assigned_stand: "A1-03", block_time_start: "2025-01-15T11:30:00Z", block_time_end: "2025-01-15T13:00:00Z", status: "on_time", pax_count: 396 },
  { id: "FL007", flight_number: "QF001", airline: "Qantas",              aircraft_type: "A380",        terminal: "T2", assigned_stand: "B1-01", block_time_start: "2025-01-15T05:30:00Z", block_time_end: "2025-01-15T08:00:00Z", status: "early",   pax_count: 450 },
  { id: "FL008", flight_number: "CX888", airline: "Cathay Pacific",      aircraft_type: "A350-1000",   terminal: "T2", assigned_stand: "B1-01", block_time_start: "2025-01-15T10:00:00Z", block_time_end: "2025-01-15T12:30:00Z", status: "early",   pax_count: 334 },
  { id: "FL009", flight_number: "JL043", airline: "Japan Airlines",      aircraft_type: "B787-9",      terminal: "T2", assigned_stand: "B1-02", block_time_start: "2025-01-15T14:30:00Z", block_time_end: "2025-01-15T16:45:00Z", status: "on_time", pax_count: 186 },
  { id: "FL010", flight_number: "AF218", airline: "Air France",          aircraft_type: "A330-200",    terminal: "T2", assigned_stand: "B1-03", block_time_start: "2025-01-15T16:00:00Z", block_time_end: "2025-01-15T18:30:00Z", status: "delayed", pax_count: 224 },
];

// ─── UI Lookups ───────────────────────────────────────────────────────────────

/** Tailwind classes for each flight-status badge */
export const STATUS_BADGE_CLASSES: Record<string, string> = {
  on_time: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  early:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  delayed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

/** Default hourWidth (pixels per hour) */
export const DEFAULT_HOUR_WIDTH = 160;
export const MOBILE_HOUR_WIDTH  = 120;

/** The "current time" mock (decimal hours, e.g. 12.0 = noon) */
export const MOCK_NOW_DECIMAL = 12.0;
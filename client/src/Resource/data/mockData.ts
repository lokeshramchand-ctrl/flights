import type { MockData } from "../types";

/**
 * MOCK_DATA — static seed data representing the airport resource schema.
 * Swap this out for an API fetch (e.g. `useSWR('/api/resource-graph')`)
 * without touching any component or hook.
 */
export const MOCK_DATA: MockData = {
  flights: [
    { id: "FL001", flight_number: "EK203",  aircraft_type: "A380",        assigned_stand: "A1-01", status: "on_time", estimated_time: "2025-01-15T06:25:00Z" },
    { id: "FL002", flight_number: "QR501",  aircraft_type: "B777-300ER",  assigned_stand: "A1-01", status: "delayed", estimated_time: "2025-01-15T10:40:00Z" },
    { id: "FL003", flight_number: "BA107",  aircraft_type: "B787-9",      assigned_stand: "A1-02", status: "on_time", estimated_time: "2025-01-15T07:00:00Z" },
    { id: "FL004", flight_number: "LH752",  aircraft_type: "A340-600",    assigned_stand: "A1-02", status: "on_time", estimated_time: "2025-01-15T11:30:00Z" },
    { id: "FL005", flight_number: "SQ321",  aircraft_type: "A350-900",    assigned_stand: "A1-03", status: "on_time", estimated_time: "2025-01-15T08:50:00Z" },
    { id: "FL006", flight_number: "EK512",  aircraft_type: "B777-300ER",  assigned_stand: "A1-03", status: "on_time", estimated_time: "2025-01-15T13:00:00Z" },
    { id: "FL007", flight_number: "QF001",  aircraft_type: "A380",        assigned_stand: "B1-01", status: "early",   estimated_time: "2025-01-15T05:20:00Z" },
    { id: "FL008", flight_number: "CX888",  aircraft_type: "A350-1000",   assigned_stand: "B1-01", status: "early",   estimated_time: "2025-01-15T09:50:00Z" },
    { id: "FL009", flight_number: "JL043",  aircraft_type: "B787-9",      assigned_stand: "B1-02", status: "on_time", estimated_time: "2025-01-15T14:30:00Z" },
    { id: "FL010", flight_number: "AF218",  aircraft_type: "A330-200",    assigned_stand: "B1-03", status: "delayed", estimated_time: "2025-01-15T16:15:00Z" },
  ],
  stands: [
    { id: "A1-01", terminal: "T1", type: "contact", max_aircraft_size: "F", position: { x: 100, y: 50  } },
    { id: "A1-02", terminal: "T1", type: "contact", max_aircraft_size: "E", position: { x: 100, y: 150 } },
    { id: "A1-03", terminal: "T1", type: "contact", max_aircraft_size: "E", position: { x: 100, y: 250 } },
    { id: "A1-04", terminal: "T1", type: "contact", max_aircraft_size: "D", position: { x: 100, y: 350 } },
    { id: "A1-05", terminal: "T1", type: "remote",  max_aircraft_size: "E", position: { x: 100, y: 450 } },
    { id: "B1-01", terminal: "T2", type: "contact", max_aircraft_size: "F", position: { x: 600, y: 50  } },
    { id: "B1-02", terminal: "T2", type: "contact", max_aircraft_size: "E", position: { x: 600, y: 150 } },
    { id: "B1-03", terminal: "T2", type: "contact", max_aircraft_size: "D", position: { x: 600, y: 250 } },
    { id: "B1-04", terminal: "T2", type: "remote",  max_aircraft_size: "F", position: { x: 600, y: 350 } },
    { id: "B1-05", terminal: "T2", type: "remote",  max_aircraft_size: "D", position: { x: 600, y: 450 } },
  ],
  gates: [
    { id: "G01", terminal: "T1", type: "contact",     position: { x: 300, y: 50  } },
    { id: "G02", terminal: "T1", type: "contact",     position: { x: 300, y: 150 } },
    { id: "G03", terminal: "T1", type: "contact",     position: { x: 300, y: 300 } },
    { id: "G04", terminal: "T1", type: "contact",     position: { x: 300, y: 450 } },
    { id: "G05", terminal: "T2", type: "contact",     position: { x: 800, y: 50  } },
    { id: "G06", terminal: "T2", type: "contact",     position: { x: 800, y: 150 } },
    { id: "G07", terminal: "T2", type: "non_contact", position: { x: 800, y: 350 } },
  ],
  graph_edges: {
    plb_connections: [
      { stand: "A1-01", gate: "G01", type: "plb" },
      { stand: "A1-02", gate: "G02", type: "plb" },
      { stand: "A1-03", gate: "G03", type: "plb" },
      { stand: "A1-04", gate: "G04", type: "plb" },
      { stand: "B1-01", gate: "G05", type: "plb" },
      { stand: "B1-02", gate: "G06", type: "plb" },
    ],
    walking_connections: [
      { stand: "A1-04", gate: "G03", type: "walking" },
      { stand: "B1-03", gate: "G07", type: "walking" },
      { stand: "B1-04", gate: "G07", type: "bus"     },
      { stand: "B1-05", gate: "G07", type: "bus"     },
    ],
    adjacency_constraints: [
      { stand_a: "A1-01", stand_b: "A1-02", type: "wingtip"   },
      { stand_a: "A1-03", stand_b: "A1-04", type: "wingtip"   },
      { stand_a: "B1-01", stand_b: "B1-02", type: "adjacency" },
    ],
  },
};
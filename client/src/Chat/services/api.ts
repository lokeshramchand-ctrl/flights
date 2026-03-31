const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; // Fetch from .env or fallback

export const api = {
  // GET /flights
  getFlights: async (params?: {
    terminal?: string;
    status?: string;
    from?: string;
    to?: string;
    sort?: string;
    order?: string;
    page?: number;
    per_page?: number;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${BASE_URL}/flights?${query}`);
    return res.json();
  },

  // GET /flights/:id
  getFlight: async (id: string) => {
    const res = await fetch(`${BASE_URL}/flights/${id}`);
    return res.json();
  },

  // POST /flights/:id/reassign
  reassignFlight: async (flightId: string, targetStandId: string) => {
    const res = await fetch(`${BASE_URL}/flights/${flightId}/reassign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_stand_id: targetStandId }),
    });
    return res.json();
  },

  // GET /stands
  getStands: async (params?: { terminal?: string; type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${BASE_URL}/stands?${query}`);
    return res.json();
  },

  // GET /stands/:id/schedule
  getStandSchedule: async (standId: string) => {
    const res = await fetch(`${BASE_URL}/stands/${standId}/schedule`);
    return res.json();
  },
};
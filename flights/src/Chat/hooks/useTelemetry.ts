import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useTelemetry() {
  const [stats, setStats] = useState([
    { label: "T1 Util.",    value: "—",   accent: "text-amber-500"   },
    { label: "Conflicts",   value: "—",   accent: "text-emerald-500" },
    { label: "Arrivals/2h", value: "—",   accent: "text-blue-500"    },
    { label: "PLB Usage",   value: "71%", accent: "text-purple-500"  },
  ]);

  useEffect(() => {
    async function load() {
      // T1 utilisation from stands
      const stands = await api.getStands({ terminal: "T1" });
      const occupied = stands.filter((s: any) => s.is_occupied).length;
      const util = Math.round((occupied / stands.length) * 100);

      // Arrivals in next 2 hours
      const now = new Date();
      const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const flights = await api.getFlights({
        from: now.toISOString(),
        to: in2h.toISOString(),
      });

      setStats([
        { label: "T1 Util.",    value: `${util}%`,                    accent: util > 85 ? "text-red-500" : "text-amber-500" },
        { label: "Conflicts",   value: "0",                            accent: "text-emerald-500" },
        { label: "Arrivals/2h", value: String(flights.pagination.total), accent: "text-blue-500" },
        { label: "PLB Usage",   value: "71%",                          accent: "text-purple-500" },
      ]);
    }

    load();
    const interval = setInterval(load, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return stats;
}
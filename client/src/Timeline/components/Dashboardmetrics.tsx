import React from "react";
import { MetricCard } from "./metricCard";
import { DASHBOARD_DATA as d } from "../data";

/**
 * Renders the four top-level KPI metric cards.
 * All data is sourced from DASHBOARD_DATA (static mock).
 * No props needed — swap `DASHBOARD_DATA` for a live API call when ready.
 */
export const DashboardMetrics: React.FC = () => {
  const otpDiff = d.on_time_performance.current - d.on_time_performance.previous;

  return (
    <section className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4 md:px-8 md:py-6 z-10 shrink-0">

      <MetricCard
        title="On-Time Performance"
        value={d.on_time_performance.current}
        unit="%"
        animDelay={0.1}
        sub={
          <span className={`flex items-center gap-1.5 font-bold ${otpDiff < 0 ? "text-red-400" : "text-emerald-400"}`}>
            {otpDiff < 0 ? "↓" : "↑"} {Math.abs(otpDiff)}%{" "}
            <span className="text-gray-500 font-medium">vs yesterday</span>
          </span>
        }
      />

      <MetricCard
        title="Stand Utilization"
        value={d.stand_utilization.occupied}
        unit={`/ ${d.stand_utilization.total}`}
        animDelay={0.2}
        sub={<span className="text-gray-500">Active stands occupied</span>}
      />

      <MetricCard
        title="Arrivals (Next 2H)"
        value={d.upcoming_arrivals_2h.total}
        animDelay={0.3}
        sub={
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              {d.upcoming_arrivals_2h.on_time} On Time
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              {d.upcoming_arrivals_2h.delayed} Delayed
            </span>
          </div>
        }
      />

      <MetricCard
        title="PLB Connection Rate"
        value={d.plb_usage.current}
        unit="%"
        animDelay={0.4}
        sub={
          <span className="text-gray-500">
            Target goal:{" "}
            <span className="text-white font-bold">{d.plb_usage.target}%</span>
          </span>
        }
      />

    </section>
  );
};
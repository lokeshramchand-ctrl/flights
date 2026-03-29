import React, { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stand {
  id: string;
  terminal: "T1" | "T2";
  type: "contact" | "remote";
}

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  aircraft_type: string;
  terminal: "T1" | "T2";
  assigned_stand: string;
  block_time_start: string;
  block_time_end: string;
  status: "on_time" | "early" | "delayed";
  pax_count: number;
  conflict?: boolean;
}

interface DashboardData {
  on_time_performance: { current: number; previous: number; unit: string };
  stand_utilization: { occupied: number; total: number; unit: string };
  upcoming_arrivals_2h: { total: number; on_time: number; delayed: number };
  plb_usage: { current: number; target: number; unit: string };
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const dashboardData: DashboardData = {
  on_time_performance: { current: 78, previous: 82, unit: "%" },
  stand_utilization: { occupied: 7, total: 10, unit: "stands" },
  upcoming_arrivals_2h: { total: 4, on_time: 3, delayed: 1 },
  plb_usage: { current: 71, target: 85, unit: "%" },
};

const standsData: Stand[] = [
  { id: "A1-01", terminal: "T1", type: "contact" },
  { id: "A1-02", terminal: "T1", type: "contact" },
  { id: "A1-03", terminal: "T1", type: "contact" },
  { id: "A1-04", terminal: "T1", type: "contact" },
  { id: "A1-05", terminal: "T1", type: "remote" },
  { id: "B1-01", terminal: "T2", type: "contact" },
  { id: "B1-02", terminal: "T2", type: "contact" },
  { id: "B1-03", terminal: "T2", type: "contact" },
  { id: "B1-04", terminal: "T2", type: "remote" },
  { id: "B1-05", terminal: "T2", type: "remote" },
];

const initialFlights: Flight[] = [
  { id: "FL001", flight_number: "EK203", airline: "Emirates", aircraft_type: "A380", terminal: "T1", assigned_stand: "A1-01", block_time_start: "2025-01-15T06:30:00Z", block_time_end: "2025-01-15T08:45:00Z", status: "on_time", pax_count: 489 },
  { id: "FL002", flight_number: "QR501", airline: "Qatar Airways", aircraft_type: "B777-300ER", terminal: "T1", assigned_stand: "A1-01", block_time_start: "2025-01-15T10:15:00Z", block_time_end: "2025-01-15T12:30:00Z", status: "delayed", pax_count: 356 },
  { id: "FL003", flight_number: "BA107", airline: "British Airways", aircraft_type: "B787-9", terminal: "T1", assigned_stand: "A1-02", block_time_start: "2025-01-15T07:00:00Z", block_time_end: "2025-01-15T09:15:00Z", status: "on_time", pax_count: 264 },
  { id: "FL004", flight_number: "LH752", airline: "Lufthansa", aircraft_type: "A340-600", terminal: "T1", assigned_stand: "A1-02", block_time_start: "2025-01-15T11:30:00Z", block_time_end: "2025-01-15T14:00:00Z", status: "on_time", pax_count: 291 },
  { id: "FL005", flight_number: "SQ321", airline: "Singapore Airlines", aircraft_type: "A350-900", terminal: "T1", assigned_stand: "A1-03", block_time_start: "2025-01-15T08:45:00Z", block_time_end: "2025-01-15T11:00:00Z", status: "on_time", pax_count: 303 },
  { id: "FL006", flight_number: "EK512", airline: "Emirates", aircraft_type: "B777-300ER", terminal: "T1", assigned_stand: "A1-03", block_time_start: "2025-01-15T11:30:00Z", block_time_end: "2025-01-15T13:00:00Z", status: "on_time", pax_count: 396 },
  { id: "FL007", flight_number: "QF001", airline: "Qantas", aircraft_type: "A380", terminal: "T2", assigned_stand: "B1-01", block_time_start: "2025-01-15T05:30:00Z", block_time_end: "2025-01-15T08:00:00Z", status: "early", pax_count: 450 },
  { id: "FL008", flight_number: "CX888", airline: "Cathay Pacific", aircraft_type: "A350-1000", terminal: "T2", assigned_stand: "B1-01", block_time_start: "2025-01-15T10:00:00Z", block_time_end: "2025-01-15T12:30:00Z", status: "early", pax_count: 334 },
  { id: "FL009", flight_number: "JL043", airline: "Japan Airlines", aircraft_type: "B787-9", terminal: "T2", assigned_stand: "B1-02", block_time_start: "2025-01-15T14:30:00Z", block_time_end: "2025-01-15T16:45:00Z", status: "on_time", pax_count: 186 },
  { id: "FL010", flight_number: "AF218", airline: "Air France", aircraft_type: "A330-200", terminal: "T2", assigned_stand: "B1-03", block_time_start: "2025-01-15T16:00:00Z", block_time_end: "2025-01-15T18:30:00Z", status: "delayed", pax_count: 224 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDecimalHours = (isoStr: string): number => {
  const d = new Date(isoStr);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
};

const detectConflicts = (flights: Flight[]): Flight[] => {
  const result = flights.map((f) => ({ ...f, conflict: false }));
  const byStand: Record<string, Flight[]> = {};
  result.forEach((f) => {
    if (!byStand[f.assigned_stand]) byStand[f.assigned_stand] = [];
    byStand[f.assigned_stand].push(f);
  });
  Object.values(byStand).forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const s1 = getDecimalHours(group[i].block_time_start);
        const e1 = getDecimalHours(group[i].block_time_end);
        const s2 = getDecimalHours(group[j].block_time_start);
        const e2 = getDecimalHours(group[j].block_time_end);
        if (s1 < e2 && e1 > s2) {
          group[i].conflict = true;
          group[j].conflict = true;
        }
      }
    }
  });
  return result;
};

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

// ─── Counter Hook ─────────────────────────────────────────────────────────────

function useCounterAnimation(target: number, duration = 2000, delay = 300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  sub: React.ReactNode;
  animDelay: number;
}

const MetricCard = ({ title, value, unit, sub, animDelay }: MetricCardProps) => {
  const animated = useCounterAnimation(value, 2000, animDelay * 1000 + 300);

  return (
    <div
      className="anim-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
      style={{ animationDelay: `${animDelay}s` }}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20"></div>
      
      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 font-sans z-10">{title}</p>
      <div className="flex items-baseline gap-2 z-10">
        <span className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-sans">{animated}</span>
        {unit && <span className="text-sm font-medium text-gray-400 font-sans">{unit}</span>}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-400 font-sans z-10">{sub}</div>
    </div>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  flight: Flight | null;
}

const STATUS_CLASSES: Record<string, string> = {
  on_time: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  early:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  delayed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const Tooltip = ({ state }: { state: TooltipState }) => {
  const f = state.flight;
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let left = state.x + 20;
  let top = state.y + 20;
  if (left + 260 > windowSize.width) left = state.x - 280;
  if (top + 180 > windowSize.height) top = state.y - 200;

  return (
    <div
      className="pointer-events-none fixed z-[999] min-w-[260px] rounded-2xl border border-white/[0.1] bg-[#0A0A0B]/90 p-5 text-sm text-white shadow-[0_30px_60px_rgba(0,0,0,0.9)] backdrop-blur-3xl transition-[opacity,transform] duration-200 font-sans ease-out"
      style={{
        left,
        top,
        opacity: state.visible ? 1 : 0,
        transform: state.visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
      }}
    >
      {f && (
        <>
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex flex-col">
              <span className="text-lg font-bold font-sans tracking-tight text-white">{f.flight_number}</span>
              <span className="text-xs font-medium text-gray-400">{f.airline}</span>
            </div>
            <span className={`rounded-lg border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${STATUS_CLASSES[f.status]}`}>
              {f.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 text-[0.8rem]">
            <div className="flex justify-between items-center"><span className="text-gray-500 font-medium tracking-wide uppercase text-[0.65rem]">Aircraft</span><b className="font-sans text-gray-200">{f.aircraft_type}</b></div>
            <div className="flex justify-between items-center"><span className="text-gray-500 font-medium tracking-wide uppercase text-[0.65rem]">Block Time</span><b className="font-sans text-gray-200">{formatTime(f.block_time_start)} – {formatTime(f.block_time_end)}</b></div>
            <div className="flex justify-between items-center"><span className="text-gray-500 font-medium tracking-wide uppercase text-[0.65rem]">Passengers</span><b className="font-sans text-gray-200">{f.pax_count}</b></div>
          </div>
          {f.conflict && (
            <div className="mt-4 rounded-lg bg-red-500/10 p-2.5 text-center text-[0.7rem] font-bold text-red-400 border border-red-500/20 uppercase tracking-widest anim-pulse">
              Stand Overlap Detected
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── FlightBlock ──────────────────────────────────────────────────────────────

interface FlightBlockProps {
  flight: Flight;
  hourWidth: number;
  onDragStart: (id: string) => void;
  onTooltipEnter: (e: React.MouseEvent, f: Flight) => void;
  onTooltipLeave: () => void;
  onTooltipMove: (e: React.MouseEvent) => void;
  animIndex: number;
}

const FlightBlock = ({
  flight: f,
  hourWidth,
  onDragStart,
  onTooltipEnter,
  onTooltipLeave,
  onTooltipMove,
  animIndex,
}: FlightBlockProps) => {
  const startDec = getDecimalHours(f.block_time_start);
  const endDec   = getDecimalHours(f.block_time_end);

  const conflictStyle: React.CSSProperties = f.conflict
    ? {
        background: "repeating-linear-gradient(-45deg, rgba(239,68,68,0.15), rgba(239,68,68,0.15) 10px, rgba(239,68,68,0.25) 10px, rgba(239,68,68,0.25) 20px)",
        borderColor: "rgba(239,68,68,0.6)",
        color: "#fecaca",
      }
    : {};

  const terminalClass = f.conflict
    ? "border shadow-[0_0_15px_rgba(239,68,68,0.3)] anim-pulse-border"
    : f.terminal === "T1"
    ? "border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/50"
    : "border border-violet-400/20 bg-gradient-to-r from-violet-500/20 to-violet-500/5 text-violet-100 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-400/50";

  return (
    <div
      draggable
      className={`anim-pop-in absolute top-[10px] flex cursor-grab select-none items-center overflow-hidden rounded-lg px-3 py-1.5 backdrop-blur-md active:cursor-grabbing hover:z-20 transition-all duration-300 hover:-translate-y-1 ${terminalClass}`}
      style={{
        left: `${startDec * hourWidth}px`,
        width: `${(endDec - startDec) * hourWidth}px`,
        height: "calc(100% - 20px)",
        animationDelay: `${0.8 + animIndex * 0.05}s`, // Wait for timeline to load
        ...conflictStyle,
      }}
      onDragStart={(e) => {
        onDragStart(f.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity = "0.4";
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onDragEnd={(e) => { 
        e.currentTarget.style.opacity = "1"; 
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseEnter={(e) => onTooltipEnter(e, f)}
      onMouseLeave={onTooltipLeave}
      onMouseMove={onTooltipMove}
    >
      <div className="flex flex-col leading-tight pointer-events-none w-full">
        <span className="text-sm font-bold font-sans tracking-tight">{f.flight_number}</span>
        <span className="text-[0.6rem] font-medium opacity-60 font-sans uppercase tracking-widest mt-0.5 truncate">{f.aircraft_type}</span>
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/[0.05] pointer-events-none rounded-lg"></div>
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────

export default function OpsControl() {
  const [hourWidth, setHourWidth] = useState(160);
  const [flights, setFlights] = useState<Flight[]>(() => detectConflicts(initialFlights));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStand, setDragOverStand] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, flight: null });
  const timelineWrapperRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setHourWidth(120);
    }
  }, []);

  useEffect(() => {
    if (hasScrolled.current) return;
    hasScrolled.current = true;
    const mockTimeDec = 12.0;
    const targetX = mockTimeDec * hourWidth - (window.innerWidth / 2 - 100);
    const wrapper = timelineWrapperRef.current;
    if (!wrapper) return;

    const duration = 2000;
    const start = performance.now();
    const startX = wrapper.scrollLeft;
    
    // Delay scroll slightly so animations play first
    const delay = setTimeout(() => {
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // Quartic ease out
        wrapper.scrollLeft = startX + (targetX - startX) * eased;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 600);
    return () => clearTimeout(delay);
  }, [hourWidth]);

  const handleDrop = useCallback((standId: string) => {
    setDragOverStand(null);
    if (!draggedId) return;
    setFlights((prev) => {
      const updated = prev.map((f) => (f.id === draggedId ? { ...f, assigned_stand: standId } : f));
      return detectConflicts(updated);
    });
    setDraggedId(null);
  }, [draggedId]);

  const mockNowLeft = 12.0 * hourWidth;
  const d = dashboardData;
  const otpDiff = d.on_time_performance.current - d.on_time_performance.previous;

  const flightsByStand = standsData.reduce<Record<string, Flight[]>>((acc, s) => {
    acc[s.id] = flights.filter((f) => f.assigned_stand === s.id);
    return acc;
  }, {});

  let flightIndex = 0;
  const flightIndexMap: Record<string, number> = {};
  flights.forEach((f) => { flightIndexMap[f.id] = flightIndex++; });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        /* Keyframe Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateX(-20px); }
          100% { opacity: 1; transform: scale(1) translateX(0); }
        }
        @keyframes pulseBorder {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); }
          50% { border-color: rgba(239, 68, 68, 0.9); }
        }
        
        /* Animation Classes */
        .anim-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .anim-fade-down { animation: fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .anim-slide-in-left { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .anim-pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
        .anim-pulse-border { animation: pulseBorder 2s infinite; }
      `}</style>

      {/* FIXED INSET-0 forces this to completely cover the screen regardless of parent layout padding */}
      <div className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>

        {/* ── Header ── */}
        <header className="anim-fade-down flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.04] bg-[#050505]/60 px-8 py-5 backdrop-blur-2xl z-20" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-5">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Ops Control</h1>
            <span className="hidden md:inline-flex items-center rounded-full bg-white/[0.03] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 border border-white/[0.05]">
              LHR • Terminals 1 & 2
            </span>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-4 rounded-full bg-white/[0.02] px-5 py-2.5 border border-white/[0.05] shadow-inner">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">Zoom</span>
            <input
              type="range"
              min={80}
              max={240}
              value={hourWidth}
              onChange={(e) => setHourWidth(parseInt(e.target.value))}
              className="h-1 w-full md:w-40 cursor-pointer appearance-none rounded-full bg-white/[0.1] accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>
        </header>

        {/* ── Dashboard Cards ── */}
        <section className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4 md:px-8 md:py-6 z-10 shrink-0">
          <MetricCard
            title="On-Time Performance"
            value={d.on_time_performance.current}
            unit="%"
            sub={<span className={`flex items-center gap-1.5 font-bold ${otpDiff < 0 ? "text-red-400" : "text-emerald-400"}`}>{otpDiff < 0 ? "↓" : "↑"} {Math.abs(otpDiff)}% <span className="text-gray-500 font-medium">vs yesterday</span></span>}
            animDelay={0.1}
          />
          <MetricCard
            title="Stand Utilization"
            value={d.stand_utilization.occupied}
            unit={`/ ${d.stand_utilization.total}`}
            sub={<span className="text-gray-500">Active stands occupied</span>}
            animDelay={0.2}
          />
          <MetricCard
            title="Arrivals (Next 2H)"
            value={d.upcoming_arrivals_2h.total}
            sub={
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold"><span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>{d.upcoming_arrivals_2h.on_time} On Time</span>
                <span className="flex items-center gap-1.5 text-amber-400 font-bold"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>{d.upcoming_arrivals_2h.delayed} Delayed</span>
              </div>
            }
            animDelay={0.3}
          />
          <MetricCard
            title="PLB Connection Rate"
            value={d.plb_usage.current}
            unit="%"
            sub={<span className="text-gray-500">Target goal: <span className="text-white font-bold">{d.plb_usage.target}%</span></span>}
            animDelay={0.4}
          />
        </section>

        {/* ── Gantt Timeline Container ── */}
        <main className="anim-fade-up relative flex flex-1 mx-5 mb-5 md:mx-8 md:mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0A0C] shadow-[0_0_50px_rgba(0,0,0,0.5)]" style={{ animationDelay: '0.5s' }}>
          <div className="flex h-full w-full overflow-y-auto overflow-x-hidden relative">
            
            {/* Sidebar (Stands) - Sticky to Left */}
            <div className="sticky left-0 z-30 w-16 md:w-28 shrink-0 border-r border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-2xl">
              <div className="sticky top-0 z-40 flex h-12 md:h-14 items-center justify-center border-b border-white/[0.06] bg-[#0A0A0C]">
                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-500">Stands</span>
              </div>
              {standsData.map((stand, i) => (
                <div 
                  key={stand.id} 
                  className="anim-slide-in-left flex h-16 md:h-20 flex-col items-center justify-center border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                  style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                >
                  <span className="text-sm md:text-base font-bold font-sans text-gray-200">{stand.id}</span>
                  <span className="text-[0.55rem] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{stand.type}</span>
                </div>
              ))}
            </div>

            {/* Timeline Area (Horizontally Scrollable) */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth" ref={timelineWrapperRef}>
              <div className="relative h-full" style={{ minWidth: `${24 * hourWidth}px` }}>
                
                {/* Time Header - Sticky to Top */}
                <div className="sticky top-0 z-20 flex h-12 md:h-14 border-b border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-2xl">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex shrink-0 items-center pl-4 border-l border-white/[0.03]" style={{ width: `${hourWidth}px` }}>
                      <span className="text-[0.65rem] md:text-xs font-bold text-gray-400 font-sans tracking-wider">
                        {i.toString().padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* Vertical Grid Lines */}
                <div className="absolute top-[56px] bottom-0 left-0 right-0 flex pointer-events-none z-0">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="shrink-0 border-l border-white/[0.02]" style={{ width: `${hourWidth}px` }} />
                  ))}
                </div>

                {/* Rows / Tracks */}
                <div className="relative z-10">
                  {standsData.map((stand) => (
                    <div
                      key={stand.id}
                      className={`relative h-16 md:h-20 border-b border-white/[0.03] transition-colors duration-200 ${
                        dragOverStand === stand.id ? "bg-white/[0.05] border-dashed border-white/[0.2]" : "hover:bg-white/[0.01]"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragOverStand(stand.id); }}
                      onDragLeave={() => setDragOverStand(null)}
                      onDrop={() => handleDrop(stand.id)}
                    >
                      {(flightsByStand[stand.id] || []).map((f) => (
                        <FlightBlock
                          key={f.id}
                          flight={f}
                          hourWidth={hourWidth}
                          onDragStart={setDraggedId}
                          onTooltipEnter={(e, fl) => setTooltip({ visible: true, x: e.clientX, y: e.clientY, flight: fl })}
                          onTooltipLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                          onTooltipMove={(e) => setTooltip((t) => ({ ...t, x: e.clientX, y: e.clientY }))}
                          animIndex={flightIndexMap[f.id] ?? 0}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* "Current Time" Marker Line */}
                <div className="anim-fade-up absolute bottom-0 top-0 z-10 w-[2px] bg-emerald-500/80 pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.6)]" style={{ left: mockNowLeft, animationDelay: '1.2s' }}>
                  <div className="absolute top-0 -translate-x-1/2 rounded-b-md bg-emerald-500 px-2 py-1 shadow-lg">
                    <span className="text-[0.55rem] font-bold text-black uppercase tracking-widest">Now</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        <Tooltip state={tooltip} />
      </div>
    </>
  );
}
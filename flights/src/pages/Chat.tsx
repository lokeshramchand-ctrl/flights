import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plane, Activity, ChevronRight, Moon, Sun, Send, CheckCircle2,
  Loader2, Terminal, Zap, Clock, AlertTriangle, Wifi, BarChart3,
  Sparkles, Bot, Radio, Menu, X
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "assistant" | "tool";

interface Message {
  id: string;
  role: Role;
  content: string;
  tool_name?: string;
  duration?: string;
  showCard?: boolean;
}

interface StructuredCard {
  flight: string;
  status: string;
  aircraft: string;
  stand: string;
  eta: string;
  conflict: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  { id: "msg-1", role: "user", content: "What's the current stand utilization for Terminal 1?" },
  { id: "msg-2", role: "tool", tool_name: "fetch_stand_status", duration: "0.3s", content: "T1: 4/5 stands occupied (80%). A1-05 available (remote)." },
  { id: "msg-3", role: "assistant", content: "Terminal 1 currently has 4 out of 5 stands occupied — that's 80% utilization. The only available stand is A1-05, which is a remote stand (no PLB). All contact stands with passenger loading bridges are currently in use.\n\nThe next stand to free up will be A1-01 at approximately 08:45 when EK203 completes turnaround." },
  { id: "msg-4", role: "user", content: "QR501 is showing delayed. Can it still go to A1-01?" },
  { id: "msg-5", role: "tool", tool_name: "check_assignment_feasibility", duration: "0.6s", content: "QR501 ETA revised to 10:40. A1-01 clear from 08:45. B777-300ER compatible with A1-01 (max size F). No conflict detected." },
  { id: "msg-6", role: "assistant", showCard: true, content: "Yes, QR501 can still use A1-01. Even with the 25-minute delay (revised ETA 10:40), there's a comfortable 2-hour buffer after EK203 clears the stand at 08:45.\n\nA1-01 supports up to Code F aircraft, so the B777-300ER has no size issues. No conflicts with adjacent stands either — A1-02 has BA107 departing at 09:15, well before QR501 arrives.\n\nWant me to confirm this assignment or check alternatives?" },
];

const CARD_DATA: StructuredCard = {
  flight: "QR501",
  status: "Delayed",
  aircraft: "B777-300ER",
  stand: "A1-01",
  eta: "10:40 Z",
  conflict: "Clear",
};

const SUGGESTED_PROMPTS = [
  { text: "Show me all delayed flights", icon: <AlertTriangle size={14} /> },
  { text: "What's the current stand utilization?", icon: <BarChart3 size={14} /> },
  { text: "Which flights arrive in the next hour?", icon: <Clock size={14} /> },
  { text: "Reassign EK512 to a PLB stand", icon: <Plane size={14} /> },
  { text: "Show T1 capacity forecast", icon: <Activity size={14} /> },
];

const SIMULATED_RESPONSE =
  "Based on the parameters, the request is feasible. I've updated the planner and notified the ground handlers. Let me know if you need to run a conflict check on the surrounding stands.";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Components ───────────────────────────────────────────────────────────────

const FlightCard = ({ data, visible }: { data: StructuredCard; visible: boolean }) => (
  <div
    className={`mt-4 w-full sm:w-80 rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-700 hover:-translate-y-1 hover:shadow-xl ${
      visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
    }`}
    style={{
      background: "var(--card-bg)",
      borderColor: "var(--border)",
      boxShadow: visible ? "var(--card-shadow)" : "none",
    }}
  >
    <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2.5 font-bold text-lg font-sans tracking-tight" style={{ color: "var(--text-primary)" }}>
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Plane size={16} /></div>
        {data.flight}
      </div>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border bg-amber-500/10 text-amber-500 border-amber-500/20">
        {data.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Aircraft", value: data.aircraft },
        { label: "Assigned Stand", value: data.stand },
        { label: "Revised ETA", value: data.eta },
        { label: "Conflict", value: data.conflict, isGreen: true },
      ].map(({ label, value, isGreen }) => (
        <div key={label} className="flex flex-col gap-1">
          <span className="text-[0.65rem] uppercase tracking-wider font-semibold opacity-70" style={{ color: "var(--text-muted)" }}>{label}</span>
          <span className="text-sm font-mono font-bold" style={{ color: isGreen ? "#10b981" : "var(--text-primary)" }}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const MessageBubble = ({ message, animDelay = 0, streaming = false, streamText }: { message: Message; animDelay?: number; streaming?: boolean; streamText?: string }) => {
  const [visible, setVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  useEffect(() => {
    if (visible && message.showCard) {
      const t = setTimeout(() => setCardVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [visible, message.showCard]);

  const popClass = visible ? "msg-enter" : "opacity-0";

  if (message.role === "user") {
    return (
      <div className={`flex justify-end w-full ${popClass}`}>
        <div
          className="max-w-[90%] md:max-w-[78%] px-5 py-3.5 rounded-[24px] rounded-br-[6px] text-[0.95rem] leading-relaxed shadow-sm font-medium"
          style={{ background: "var(--msg-user-bg)", color: "var(--msg-user-text)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "tool") {
    return (
      <div className={`flex w-full ${popClass}`}>
        <div
          className="ml-0 sm:ml-12 font-mono text-[0.75rem] px-4 py-3 rounded-xl flex flex-col gap-2 border w-fit max-w-[95%] sm:max-w-[85%] transition-all hover:border-purple-500/40"
          style={{ background: "var(--tool-bg)", borderColor: "var(--tool-border)", color: "var(--tool-color)" }}
        >
          <div className="flex items-center gap-2.5 font-bold tracking-tight">
            <CheckCircle2 size={14} className="text-purple-500" />
            <span>{message.tool_name}</span>
            <span className="opacity-50 text-[0.65rem] bg-purple-500/10 px-1.5 py-0.5 rounded">[{message.duration}]</span>
          </div>
          <div className="pl-6 text-[0.75rem] border-l-2 ml-1.5 font-medium leading-relaxed" style={{ borderColor: "var(--tool-border)", color: "var(--text-secondary)" }}>
            <span className="opacity-50 mr-2">&gt;</span>{message.content}
          </div>
        </div>
      </div>
    );
  }

  const displayText = streaming ? streamText ?? "" : message.content;
  return (
    <div className={`flex w-full ${popClass}`}>
      <div className="flex gap-3 sm:gap-4 max-w-full md:max-w-[88%]">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 shadow-md relative group overflow-hidden"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 4px 14px rgba(59,130,246,0.3)" }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Bot size={18} className="text-white relative z-10" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-[0.95rem] leading-[1.6] pt-1.5 font-medium" style={{ color: "var(--text-primary)" }}>
            {displayText.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < displayText.split("\n").length - 1 && <br />}
              </span>
            ))}
            {streaming && (
              <span className="inline-block w-[6px] h-[16px] bg-blue-500 align-middle ml-1.5 rounded-sm animate-pulse" />
            )}
          </div>
          {message.showCard && <FlightCard data={CARD_DATA} visible={cardVisible} />}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NexusOpsAssistant() {
  const [isLight, setIsLight] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [toolVisible, setToolVisible] = useState(false);
  const [toolDone, setToolDone] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const historyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = historyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setTimeout(() => setPanelVisible(true), 100);
    INITIAL_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }, 500 + i * 350);
    });
  }, [scrollToBottom]);

  useEffect(() => {
    setTimeout(scrollToBottom, 80);
  }, [messages, streamingText, scrollToBottom, toolVisible]);

  const handleSend = useCallback(async (text: string) => {
    text = text.trim();
    if (!text || isGenerating) return;

    if (window.innerWidth < 768) setSidebarOpen(false);
    setIsGenerating(true);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    await sleep(600);

    setToolVisible(true);
    setToolDone(false);
    scrollToBottom();
    await sleep(1500);
    setToolDone(true);
    await sleep(400);

    setIsStreaming(true);
    const streamMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: SIMULATED_RESPONSE };
    setMessages((p) => [...p, streamMsg]);

    let built = "";
    for (let i = 0; i < SIMULATED_RESPONSE.length; i++) {
      built += SIMULATED_RESPONSE[i];
      setStreamingText(built);
      if (i % 3 === 0) scrollToBottom();
      await sleep(12);
    }

    setIsStreaming(false);
    setStreamingText("");
    setToolVisible(false);
    setToolDone(false);
    setIsGenerating(false);
    textareaRef.current?.focus();
  }, [isGenerating, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const theme = isLight
    ? {
        "--bg-sidebar": "#f4f4f5",
        "--bg-panel": "#ffffff",
        "--bg-panel-hover": "#f8f8f8",
        "--bg-surface": "#ffffff",
        "--border": "#e4e4e7",
        "--text-primary": "#09090b",
        "--text-secondary": "#52525b",
        "--text-muted": "#a1a1aa",
        "--msg-user-bg": "#09090b",
        "--msg-user-text": "#ffffff",
        "--tool-color": "#7e22ce",
        "--tool-bg": "#faf5ff",
        "--tool-border": "#e9d5ff",
        "--card-bg": "#ffffff",
        "--card-shadow": "0 10px 30px -10px rgba(0,0,0,0.08)",
      }
    : {
        "--bg-sidebar": "#09090b",
        "--bg-panel": "#000000",
        "--bg-panel-hover": "#18181b",
        "--bg-surface": "rgba(255,255,255,0.03)",
        "--border": "rgba(255,255,255,0.08)",
        "--text-primary": "#f4f4f5",
        "--text-secondary": "#a1a1aa",
        "--text-muted": "#71717a",
        "--msg-user-bg": "#f4f4f5",
        "--msg-user-text": "#000000",
        "--tool-color": "#c084fc",
        "--tool-bg": "rgba(168,85,247,0.05)",
        "--tool-border": "rgba(168,85,247,0.15)",
        "--card-bg": "rgba(255,255,255,0.02)",
        "--card-shadow": "0 20px 40px -20px rgba(0,0,0,0.8)",
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        *, *::before, *::after { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
        
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        
        @keyframes message-pop { 0% { opacity: 0; transform: translateY(16px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .msg-enter { animation: message-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        @keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 transparent; } }
        @keyframes fade-scale-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        
        .prompt-enter { animation: fade-scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .transition-theme { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        
        /* Modern invisible scrollbar */
        .scrollbar-hide::-webkit-scrollbar { width: 0px; background: transparent; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* FIXED INSET-0 forces the container to span 100% width and height, ignoring parent padding */}
      <div
        className="fixed inset-0 flex overflow-hidden transition-theme bg-[var(--bg-panel)]"
        style={{ ...theme as React.CSSProperties, color: "var(--text-primary)" }}
      >
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Left Panel (Sidebar) ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] lg:w-[320px] transform flex flex-col gap-6 p-5 lg:p-6 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:relative md:z-0 md:translate-x-0 border-r ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ 
            background: "var(--bg-sidebar)",
            borderColor: "var(--border)"
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" style={{ animation: "pulse-dot 2s infinite" }} />
                <Radio size={18} className="text-emerald-500" />
                Ops Planner AI
              </div>
              <p className="text-xs font-medium opacity-70" style={{ color: "var(--text-secondary)" }}>
                Live stand allocation & telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLight((v) => !v)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 bg-surface text-primary"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              >
                {isLight ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              <button 
                onClick={() => setSidebarOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border md:hidden bg-surface"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Live stats strip */}
          <div className="rounded-2xl border p-4 lg:p-5 flex flex-col gap-4 transition-theme backdrop-blur-md" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              <Wifi size={13} className="animate-pulse text-emerald-500" /> Live Telemetry
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {[
                { label: "T1 Util.", value: "80%", accent: "text-amber-500" },
                { label: "Conflicts", value: "0", accent: "text-emerald-500" },
                { label: "Arrivals/2h", value: "4", accent: "text-blue-500" },
                { label: "PLB Usage", value: "71%", accent: "text-purple-500" },
              ].map(({ label, value, accent }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
                  <span className={`font-mono text-lg lg:text-xl font-bold ${accent}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested prompts */}
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto scrollbar-hide pb-4">
            <div className="text-[0.65rem] font-bold uppercase tracking-widest mb-1 pl-1" style={{ color: "var(--text-muted)" }}>
              Suggested Queries
            </div>
            {SUGGESTED_PROMPTS.map(({ text, icon }, i) => (
              <button
                key={text}
                onClick={() => handleSend(text)}
                className={`prompt-enter flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-[0.85rem] font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 group backdrop-blur-sm`}
                style={{
                  animationDelay: `${0.2 + i * 0.08}s`,
                  background: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">{icon}</span>
                  {text}
                </span>
                <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </aside>

        {/* ── Chat Panel ── */}
        <main
          className={`flex-1 flex flex-col relative transition-theme ${panelVisible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "var(--bg-panel)" }}
        >
          {/* Chat topbar */}
          <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b transition-theme shrink-0 backdrop-blur-xl z-10 sticky top-0" style={{ borderColor: "var(--border)", background: "var(--bg-panel)CC" }}>
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                <Menu size={20} />
              </button>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg relative" style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-[0.95rem] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Nexus Assistant</p>
                <p className="text-[0.7rem] font-medium" style={{ color: "var(--text-muted)" }}>Stand ops · LHR</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[0.7rem] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-surface)" }}>
              <Zap size={12} className="text-emerald-500" /> Online
            </div>
          </div>

          {/* Messages */}
          <div ref={historyRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-10 lg:px-20 py-6 md:py-8 flex flex-col gap-6 md:gap-8 scroll-smooth w-full max-w-5xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} streaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"} streamText={isStreaming && i === messages.length - 1 ? streamingText : undefined} />
            ))}

            {toolVisible && (
              <div className={`flex w-full msg-enter`}>
                <div className="ml-0 sm:ml-12 font-mono text-[0.75rem] px-4 py-3 rounded-xl flex items-center gap-3 border w-fit" style={{ background: "var(--tool-bg)", borderColor: "var(--tool-border)", color: "var(--tool-color)" }}>
                  {toolDone ? <CheckCircle2 size={14} className="text-purple-500" /> : <Loader2 size={14} className="animate-spin text-purple-500" />}
                  <span className="font-bold">{toolDone ? "fetch_complete" : "processing_request..."}</span>
                </div>
              </div>
            )}
            <div className="h-4"></div>
          </div>

          {/* Input dock */}
          <div className="px-4 md:px-10 lg:px-20 pb-4 md:pb-8 pt-2 shrink-0 bg-gradient-to-t from-[var(--bg-panel)] via-[var(--bg-panel)] to-transparent w-full max-w-5xl mx-auto">
            <div
              className={`flex items-end gap-3 rounded-[20px] border px-4 md:px-5 py-3 md:py-4 transition-all duration-300 shadow-sm focus-within:shadow-md ${isGenerating ? "opacity-60 pointer-events-none" : ""}`}
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <Terminal size={18} className="mb-1.5 md:mb-2 shrink-0 opacity-40" style={{ color: "var(--text-primary)" }} />
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about stands, delays, or flight feasibility..."
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none outline-none resize-none text-[0.95rem] font-medium leading-[1.5] py-1 md:py-1.5 transition-all scrollbar-hide placeholder-gray-400 dark:placeholder-gray-500"
                style={{ color: "var(--text-primary)", maxHeight: "150px" }}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={isGenerating || !input.trim()}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 mb-0.5"
                style={{ background: "var(--text-primary)", color: "var(--bg-panel)" }}
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
              </button>
            </div>
            <p className="hidden md:block text-center text-[0.65rem] font-bold uppercase tracking-widest mt-3 opacity-40" style={{ color: "var(--text-muted)" }}>
              Press <kbd className="font-mono mx-1">Enter</kbd> to send · <kbd className="font-mono mx-1">Shift+Enter</kbd> for new line
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
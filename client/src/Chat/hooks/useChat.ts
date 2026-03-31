import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "../types";
import { INITIAL_MESSAGES } from "../data";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── API base ─────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; // Fetch from .env or fallback

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `API error ${res.status}`);
  return data;
}

// ─── Intent router ────────────────────────────────────────────────────────────
// Maps a plain-text user message to an API call and returns a response string.
// Extend the if/else chain here to add new capabilities.
async function resolveIntent(text: string): Promise<string> {
  const lower = text.toLowerCase();

  // ── "show me all delayed flights" ─────────────────────────────────────────
  if (lower.includes("delayed")) {
    const result = await apiFetch("/flights?status=delayed");
    const flights: any[] = result.data;
    if (!flights.length) return "No delayed flights at the moment.";
    const list = flights
      .map((f) => `• ${f.flight_number} (${f.airline}) — ETA ${f.estimated_time}, stand ${f.assigned_stand}`)
      .join("\n");
    return `There are ${flights.length} delayed flight(s) right now:\n\n${list}`;
  }

  // ── "what's the current stand utilization?" ───────────────────────────────
  if (lower.includes("utilization") || lower.includes("utilisation") || lower.includes("stand util")) {
    const stands: any[] = await apiFetch("/stands");
    const occupied = stands.filter((s) => s.is_occupied).length;
    const pct = Math.round((occupied / stands.length) * 100);

    const t1 = stands.filter((s) => s.terminal === "T1");
    const t1Occ = t1.filter((s) => s.is_occupied).length;
    const t2 = stands.filter((s) => s.terminal === "T2");
    const t2Occ = t2.filter((s) => s.is_occupied).length;

    return (
      `Overall stand utilisation is ${pct}% — ${occupied} of ${stands.length} stands occupied.\n\n` +
      `T1: ${t1Occ}/${t1.length} stands occupied\n` +
      `T2: ${t2Occ}/${t2.length} stands occupied\n\n` +
      `Available stands: ${stands.filter((s) => !s.is_occupied).map((s) => s.id).join(", ") || "none"}`
    );
  }

  // ── "which flights arrive in the next hour?" ──────────────────────────────
  if (lower.includes("next hour") || lower.includes("arriving soon")) {
    const now = new Date();
    const in1h = new Date(now.getTime() + 60 * 60 * 1000);
    const result = await apiFetch(
      `/flights?from=${now.toISOString()}&to=${in1h.toISOString()}&sort=scheduled_time&order=asc`
    );
    const flights: any[] = result.data;
    if (!flights.length) return "No arrivals scheduled in the next hour.";
    const list = flights
      .map((f) => `• ${f.flight_number} (${f.airline}) — ${f.scheduled_time}, stand ${f.assigned_stand}`)
      .join("\n");
    return `${flights.length} arrival(s) in the next hour:\n\n${list}`;
  }

  // ── "reassign EK512 to A1-04" ─────────────────────────────────────────────
  const reassignMatch = text.match(/reassign\s+([A-Z0-9]+)\s+to\s+([\w-]+)/i);
  if (reassignMatch) {
    const [, flightNum, standId] = reassignMatch;

    // Find the flight id by flight_number
    const result = await apiFetch("/flights?per_page=100");
    const flight = result.data.find((f: any) =>
      f.flight_number.toUpperCase() === flightNum.toUpperCase()
    );
    if (!flight) return `Couldn't find flight ${flightNum.toUpperCase()}. Check the flight number and try again.`;

    const updated = await apiFetch(`/flights/${flight.id}/reassign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_stand_id: standId }),
    });

    return (
      `Done — ${updated.flight_number} has been reassigned to stand ${updated.assigned_stand} (${updated.terminal}).\n\n` +
      `Block time: ${updated.block_time_start} → ${updated.block_time_end}`
    );
  }

  // ── "show T1 capacity forecast" / terminal schedule ───────────────────────
  if (lower.includes("forecast") || lower.includes("capacity") || lower.includes("schedule")) {
    const terminal = lower.includes("t2") ? "T2" : "T1";
    const result = await apiFetch(`/flights?terminal=${terminal}&sort=scheduled_time&order=asc&per_page=100`);
    const flights: any[] = result.data;
    if (!flights.length) return `No flights scheduled for ${terminal} today.`;
    const list = flights
      .map((f) => `• ${f.flight_number} — ${f.operation} at ${f.scheduled_time} (${f.status})`)
      .join("\n");
    return `${terminal} has ${flights.length} flight(s) scheduled today:\n\n${list}`;
  }

  // ── "stand schedule for A1-01" ────────────────────────────────────────────
  const standScheduleMatch = text.match(/stand[s]?\s+([\w-]+)\s+schedule|schedule\s+for\s+([\w-]+)/i);
  if (standScheduleMatch) {
    const standId = standScheduleMatch[1] ?? standScheduleMatch[2];
    const result = await apiFetch(`/stands/${standId}/schedule`);
    if (!result.schedule.length) return `Stand ${standId} has no flights assigned today.`;
    const list = result.schedule
      .map((e: any) => `• ${e.flight_number} (${e.airline}) — ${e.block_time_start} → ${e.block_time_end}`)
      .join("\n");
    return `Stand ${standId} schedule:\n\n${list}`;
  }

  // ── fallback ──────────────────────────────────────────────────────────────
  return (
    "I can help with:\n\n" +
    "• **Delayed flights** — \"show me all delayed flights\"\n" +
    "• **Stand utilisation** — \"what's the current stand utilization?\"\n" +
    "• **Arrivals** — \"which flights arrive in the next hour?\"\n" +
    "• **Reassignment** — \"reassign EK512 to A1-05\"\n" +
    "• **Capacity forecast** — \"show T1 capacity forecast\""
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useChat() {
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState("");
  const [isGenerating, setIsGenerating]   = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming]     = useState(false);
  const [toolVisible, setToolVisible]     = useState(false);
  const [toolDone, setToolDone]           = useState(false);

  const historyRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  // Seed initial messages with staggered animation (unchanged)
  useEffect(() => {
    INITIAL_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }, 500 + i * 350);
    });
  }, [scrollToBottom]);

  // Auto-scroll whenever messages or streaming text change (unchanged)
  useEffect(() => {
    setTimeout(scrollToBottom, 80);
  }, [messages, streamingText, toolVisible, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    text = text.trim();
    if (!text || isGenerating) return;

    setIsGenerating(true);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Append user message
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((p) => [...p, userMsg]);

    // Show tool-call indicator while API request is in flight
    await sleep(400);
    setToolVisible(true);
    setToolDone(false);
    scrollToBottom();

    // ── Real API call (replaces the fake 1500ms sleep) ──────────────────────
    let responseText: string;
    try {
      responseText = await resolveIntent(text);
    } catch (err: any) {
      responseText = `Something went wrong: ${err.message ?? "unknown error"}. Make sure the API server is running on ${BASE_URL}.`;
    }

    // Mark tool call as done
    setToolDone(true);
    await sleep(400);

    // Stream the response character-by-character (unchanged animation)
    setIsStreaming(true);
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: responseText,
    };
    setMessages((p) => [...p, assistantMsg]);

    let built = "";
    for (let i = 0; i < responseText.length; i++) {
      built += responseText[i];
      setStreamingText(built);
      if (i % 3 === 0) scrollToBottom();
      await sleep(12);
    }

    // Teardown (unchanged)
    setIsStreaming(false);
    setStreamingText("");
    setToolVisible(false);
    setToolDone(false);
    setIsGenerating(false);
    textareaRef.current?.focus();
  }, [isGenerating, scrollToBottom]);

  return {
    messages,
    input,
    setInput,
    isGenerating,
    streamingText,
    isStreaming,
    toolVisible,
    toolDone,
    historyRef,
    textareaRef,
    sendMessage,
  };
}
import React, { useState, useEffect } from "react";
import { Bot, CheckCircle2 } from "lucide-react";
import { FlightCard } from "./FlightCard";
import { CARD_DATA } from "../data";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  animDelay?: number;
  streaming?: boolean;
  streamText?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  animDelay = 0,
  streaming = false,
  streamText,
}) => {
  const [visible,     setVisible]     = useState(false);
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

  // Smooth fade and slide up transition
  const popClass = visible 
    ? "opacity-100 translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
    : "opacity-0 translate-y-3";

  // ── User bubble ──────────────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <div className={`flex justify-end w-full ${popClass}`}>
        <div
          className="max-w-[90%] md:max-w-[78%] px-5 py-3 rounded-2xl rounded-br-sm text-[0.95rem] leading-relaxed shadow-sm font-medium border"
          style={{ 
            background: "var(--msg-user-bg)", 
            color: "var(--msg-user-text)",
            borderColor: "color-mix(in srgb, var(--msg-user-text) 10%, transparent)"
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // ── Tool call bubble ─────────────────────────────────────────────────────────
  if (message.role === "tool") {
    return (
      <div className={`flex w-full ${popClass}`}>
        <div
          className="ml-0 sm:ml-12 font-mono text-[0.75rem] px-3.5 py-3 rounded-xl flex flex-col gap-2.5 border shadow-sm w-fit max-w-[95%] sm:max-w-[85%] transition-colors duration-200"
          style={{
            background:   "var(--bg-surface)",
            borderColor:  "var(--border)",
            color:        "var(--text-secondary)",
          }}
        >
          <div className="flex items-center gap-2 font-medium tracking-tight" style={{ color: "var(--text-primary)" }}>
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>{message.tool_name}</span>
            <span 
              className="opacity-70 text-[0.65rem] px-1.5 py-0.5 rounded-md border"
              style={{ background: "var(--bg-sidebar)", borderColor: "var(--border)" }}
            >
              {message.duration}
            </span>
          </div>
          <div
            className="pl-6 text-[0.75rem] border-l-2 ml-1.5 font-medium leading-relaxed opacity-80"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="opacity-40 mr-2">&gt;</span>
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // ── Assistant bubble ─────────────────────────────────────────────────────────
  const displayText = streaming ? (streamText ?? "") : message.content;

  return (
    <div className={`flex w-full ${popClass}`}>
      <div className="flex gap-3 sm:gap-4 max-w-full md:max-w-[88%]">
        
        {/* Assistant Avatar */}
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm border bg-blue-500 text-white"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <Bot size={18} />
        </div>

        {/* Assistant Text + Optional Card */}
        <div className="flex flex-col min-w-0">
          <div
            className="text-[0.95rem] leading-[1.7] pt-1 font-medium tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {displayText.split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
            {/* The typing animation (pulsing cursor) has been permanently removed from here */}
          </div>
          
          {/* Card Wrapper with exact spacing */}
          {message.showCard && (
            <div className="mt-4">
              <FlightCard data={CARD_DATA} visible={cardVisible} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
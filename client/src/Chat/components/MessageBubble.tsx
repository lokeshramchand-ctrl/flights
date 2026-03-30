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

  const popClass = visible ? "msg-enter" : "opacity-0";

  // ── User bubble ──────────────────────────────────────────────────────────────
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

  // ── Tool call bubble ─────────────────────────────────────────────────────────
  if (message.role === "tool") {
    return (
      <div className={`flex w-full ${popClass}`}>
        <div
          className="ml-0 sm:ml-12 font-mono text-[0.75rem] px-4 py-3 rounded-xl flex flex-col gap-2 border w-fit max-w-[95%] sm:max-w-[85%] transition-all hover:border-purple-500/40"
          style={{
            background:   "var(--tool-bg)",
            borderColor:  "var(--tool-border)",
            color:        "var(--tool-color)",
          }}
        >
          <div className="flex items-center gap-2.5 font-bold tracking-tight">
            <CheckCircle2 size={14} className="text-purple-500" />
            <span>{message.tool_name}</span>
            <span className="opacity-50 text-[0.65rem] bg-purple-500/10 px-1.5 py-0.5 rounded">
              [{message.duration}]
            </span>
          </div>
          <div
            className="pl-6 text-[0.75rem] border-l-2 ml-1.5 font-medium leading-relaxed"
            style={{ borderColor: "var(--tool-border)", color: "var(--text-secondary)" }}
          >
            <span className="opacity-50 mr-2">&gt;</span>
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
        {/* Avatar */}
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 shadow-md relative group overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            boxShadow:  "0 4px 14px rgba(59,130,246,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bot size={18} className="text-white relative z-10" />
        </div>

        {/* Text + optional card */}
        <div className="flex flex-col min-w-0">
          <div
            className="text-[0.95rem] leading-[1.6] pt-1.5 font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {displayText.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
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
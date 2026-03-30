import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../types";

interface MessageListProps {
  messages:      Message[];
  isStreaming:   boolean;
  streamingText: string;
  toolVisible:   boolean;
  toolDone:      boolean;
  historyRef:    React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  streamingText,
  toolVisible,
  toolDone,
  historyRef,
}) => (
  <div
    ref={historyRef}
    className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-10 lg:px-20 py-6 md:py-8 flex flex-col gap-6 md:gap-8 scroll-smooth w-full max-w-5xl mx-auto"
  >
    {messages.map((msg, i) => (
      <MessageBubble
        key={msg.id}
        message={msg}
        streaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
        streamText={isStreaming && i === messages.length - 1 ? streamingText : undefined}
      />
    ))}

    {/* Live tool-call indicator */}
    {toolVisible && (
      <div className="flex w-full msg-enter">
        <div
          className="ml-0 sm:ml-12 font-mono text-[0.75rem] px-4 py-3 rounded-xl flex items-center gap-3 border w-fit"
          style={{
            background:  "var(--tool-bg)",
            borderColor: "var(--tool-border)",
            color:       "var(--tool-color)",
          }}
        >
          {toolDone
            ? <CheckCircle2 size={14} className="text-purple-500" />
            : <Loader2     size={14} className="animate-spin text-purple-500" />
          }
          <span className="font-bold">
            {toolDone ? "fetch_complete" : "processing_request..."}
          </span>
        </div>
      </div>
    )}

    <div className="h-4" />
  </div>
);
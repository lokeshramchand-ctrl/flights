import React from "react";
import { Terminal, Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  input:        string;
  isGenerating: boolean;
  textareaRef:  React.RefObject<HTMLTextAreaElement>;
  onChange:     (value: string) => void;
  onSend:       (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isGenerating,
  textareaRef,
  onChange,
  onSend,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 pb-3 md:pb-6 pt-2 shrink-0 bg-gradient-to-t from-[var(--bg-panel)] via-[var(--bg-panel)] to-transparent w-full max-w-4xl mx-auto">
      <div
        className={`flex items-center gap-3 rounded-full border px-4 py-2 transition-all duration-200 shadow-sm focus-within:shadow-md ${
          isGenerating ? "opacity-60 pointer-events-none" : ""
        }`}
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <Terminal
          size={16}
          className="shrink-0 opacity-40"
          style={{ color: "var(--text-primary)" }}
        />

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about stands, delays, or flight feasibility..."
          disabled={isGenerating}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-medium leading-[1.4] py-1 transition-all scrollbar-hide placeholder-gray-400 dark:placeholder-gray-500"
          style={{ color: "var(--text-primary)", maxHeight: "120px" }}
        />

        <button
          onClick={() => onSend(input)}
          disabled={isGenerating || !input.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          style={{ background: "var(--text-primary)", color: "var(--bg-panel)" }}
        >
          {isGenerating
            ? <Loader2 size={16} className="animate-spin" />
            : <Send    size={16} className="ml-0.5" />
          }
        </button>
      </div>

      <p
        className="hidden md:block text-center text-[0.6rem] font-bold uppercase tracking-widest mt-2 opacity-40"
        style={{ color: "var(--text-muted)" }}
      >
        Press <kbd className="font-mono mx-1">Enter</kbd> to send ·{" "}
        <kbd className="font-mono mx-1">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};
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
    <div className="px-4 md:px-10 lg:px-20 pb-4 md:pb-8 pt-2 shrink-0 bg-gradient-to-t from-[var(--bg-panel)] via-[var(--bg-panel)] to-transparent w-full max-w-5xl mx-auto">
      <div
        className={`flex items-end gap-3 rounded-[20px] border px-4 md:px-5 py-3 md:py-4 transition-all duration-300 shadow-sm focus-within:shadow-md ${
          isGenerating ? "opacity-60 pointer-events-none" : ""
        }`}
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <Terminal
          size={18}
          className="mb-1.5 md:mb-2 shrink-0 opacity-40"
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
          className="flex-1 bg-transparent border-none outline-none resize-none text-[0.95rem] font-medium leading-[1.5] py-1 md:py-1.5 transition-all scrollbar-hide placeholder-gray-400 dark:placeholder-gray-500"
          style={{ color: "var(--text-primary)", maxHeight: "150px" }}
        />

        <button
          onClick={() => onSend(input)}
          disabled={isGenerating || !input.trim()}
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 mb-0.5"
          style={{ background: "var(--text-primary)", color: "var(--bg-panel)" }}
        >
          {isGenerating
            ? <Loader2 size={18} className="animate-spin" />
            : <Send    size={18} className="ml-1" />
          }
        </button>
      </div>

      <p
        className="hidden md:block text-center text-[0.65rem] font-bold uppercase tracking-widest mt-3 opacity-40"
        style={{ color: "var(--text-muted)" }}
      >
        Press <kbd className="font-mono mx-1">Enter</kbd> to send ·{" "}
        <kbd className="font-mono mx-1">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};
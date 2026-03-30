import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "../types";
import { INITIAL_MESSAGES, SIMULATED_RESPONSE } from "../data";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function useChat() {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming]   = useState(false);
  const [toolVisible, setToolVisible]   = useState(false);
  const [toolDone, setToolDone]         = useState(false);

  const historyRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  // Seed initial messages with staggered animation
  useEffect(() => {
    INITIAL_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }, 500 + i * 350);
    });
  }, [scrollToBottom]);

  // Auto-scroll whenever messages or streaming text change
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

    // Show tool-call indicator
    await sleep(600);
    setToolVisible(true);
    setToolDone(false);
    scrollToBottom();

    // Simulate tool completion
    await sleep(1500);
    setToolDone(true);
    await sleep(400);

    // Stream assistant response
    setIsStreaming(true);
    const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: SIMULATED_RESPONSE };
    setMessages((p) => [...p, assistantMsg]);

    let built = "";
    for (let i = 0; i < SIMULATED_RESPONSE.length; i++) {
      built += SIMULATED_RESPONSE[i];
      setStreamingText(built);
      if (i % 3 === 0) scrollToBottom();
      await sleep(12);
    }

    // Teardown
    setIsStreaming(false);
    setStreamingText("");
    setToolVisible(false);
    setToolDone(false);
    setIsGenerating(false);
    textareaRef.current?.focus();
  }, [isGenerating, scrollToBottom]);

  return {
    // State
    messages,
    input,
    setInput,
    isGenerating,
    streamingText,
    isStreaming,
    toolVisible,
    toolDone,
    // Refs
    historyRef,
    textareaRef,
    // Actions
    sendMessage,
  };
}
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatTopbar } from "./components/ChatTopbar";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";
import { GLOBAL_STYLES } from "./styles/globalStyles";

export default function NexusOpsAssistant() {
  const [panelVisible, setPanelVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isLight, theme, toggleTheme } = useTheme();

  const {
    messages,
    input, setInput,
    isGenerating,
    streamingText, isStreaming,
    toolVisible, toolDone,
    historyRef, textareaRef,
    sendMessage,
  } = useChat();

  useEffect(() => {
    setTimeout(() => setPanelVisible(true), 100);
  }, []);

  const handleSendFromSidebar = (text: string) => {
    if (window.innerWidth < 768) setSidebarOpen(false);
    sendMessage(text);
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ── 1. Main Layout: flex-col forces Topbar to the top ── */}
      <div
        className="fixed inset-0 flex flex-col overflow-hidden transition-theme bg-[var(--bg-panel)]"
        style={{ ...(theme as React.CSSProperties), color: "var(--text-primary)" }}
      >
        {/* ── Topbar (Full Width) ── */}
        <div className={`transition-opacity duration-300 z-40 ${panelVisible ? "opacity-100" : "opacity-0"}`}>
          <ChatTopbar
            onOpenSidebar={() => setSidebarOpen(true)}
            isLight={isLight}
            onToggleTheme={toggleTheme}
          />
        </div>

        {/* ── 2. Lower Container: Sidebar + Chat Panel Side-by-Side ── */}
        <div className={`flex-1 flex overflow-hidden relative transition-opacity duration-300 ${panelVisible ? "opacity-100" : "opacity-0"}`}>

          {/* ── Left sidebar ── */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSendPrompt={handleSendFromSidebar}

          />

          {/* ── Chat panel ── */}
          <main
            className="flex-1 flex flex-col relative overflow-hidden"
            style={{ background: "var(--bg-panel)" }}
          >
            <MessageList
              messages={messages}
              isStreaming={isStreaming}
              streamingText={streamingText}
              toolVisible={toolVisible}
              toolDone={toolDone}
              historyRef={historyRef as React.RefObject<HTMLDivElement>}
            />

            <ChatInput
              input={input}
              isGenerating={isGenerating}
              textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
              onChange={setInput}
              onSend={sendMessage}
            />
          </main>

        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { Sidebar }      from "./components/Sidebar";
import { ChatTopbar }   from "./components/ChatTopbar";
import { MessageList }  from "./components/MessageList";
import { ChatInput }    from "./components/ChatInput";
import { useChat }      from "./hooks/useChat";
import { useTheme }     from "./hooks/useTheme";
import { GLOBAL_STYLES } from "./styles/globalStyles";

export default function NexusOpsAssistant() {
  const [panelVisible, setPanelVisible] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

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

      <div
        className="fixed inset-0 flex overflow-hidden transition-theme bg-[var(--bg-panel)]"
        style={{ ...(theme as React.CSSProperties), color: "var(--text-primary)" }}
      >
        {/* ── Left sidebar ── */}
        <Sidebar
          isOpen={sidebarOpen}
          isLight={isLight}
          onClose={() => setSidebarOpen(false)}
          onToggleTheme={toggleTheme}
          onSendPrompt={handleSendFromSidebar}
        />

        {/* ── Chat panel ── */}
        <main
          className={`flex-1 flex flex-col relative transition-theme ${panelVisible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "var(--bg-panel)" }}
        >
          <ChatTopbar onOpenSidebar={() => setSidebarOpen(true)} />

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
    </>
  );
}
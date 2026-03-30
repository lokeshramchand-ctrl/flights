/**
 * globalStyles.ts
 * Inject once at the app root via a <style> tag or a CSS-in-JS solution.
 */
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  *, *::before, *::after {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }
  body { margin: 0; overflow: hidden; }

  .font-mono { font-family: 'JetBrains Mono', monospace !important; }

  /* Message entrance animation */
  @keyframes message-pop {
    0%   { opacity: 0; transform: translateY(16px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .msg-enter { animation: message-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

  /* Status dot pulse */
  @keyframes pulse-dot {
    0%   { box-shadow: 0 0 0 0  rgba(16,185,129,0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0);   }
    100% { box-shadow: 0 0 0 0  transparent;           }
  }

  /* Suggested-prompt entrance */
  @keyframes fade-scale-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  .prompt-enter {
    animation: fade-scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
    opacity: 0;
  }

  /* Smooth theme transitions */
  .transition-theme { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }

  /* Hide scrollbars (modern, cross-browser) */
  .scrollbar-hide::-webkit-scrollbar { width: 0; background: transparent; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
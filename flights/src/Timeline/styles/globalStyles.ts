/**
 * GLOBAL_STYLES
 * Inject once via <style>{GLOBAL_STYLES}</style> at the root of the app.
 * Keeps all @keyframes, utility animation classes, and scrollbar overrides
 * in a single, auditable place.
 */
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  /* ── Font alias ── */
  .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Custom scrollbar ── */
  ::-webkit-scrollbar              { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track        { background: transparent; }
  ::-webkit-scrollbar-thumb        { background: rgba(255,255,255,0.1); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover  { background: rgba(255,255,255,0.2); }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.9) translateX(-20px); }
    100% { opacity: 1; transform: scale(1)   translateX(0);     }
  }
  @keyframes pulseBorder {
    0%, 100% { border-color: rgba(239, 68, 68, 0.4); }
    50%       { border-color: rgba(239, 68, 68, 0.9); }
  }

  /* ── Animation utility classes ── */
  .anim-fade-up       { animation: fadeUp       0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .anim-fade-down     { animation: fadeDown     0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .anim-slide-in-left { animation: slideInLeft  0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .anim-pop-in        { animation: popIn        0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
  .anim-pulse-border  { animation: pulseBorder 2s infinite; }
`;  
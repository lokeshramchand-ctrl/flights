/**
 * GLOBAL_STYLES
 * Injected once at the app root via <style>{GLOBAL_STYLES}</style>.
 * Contains font imports, font-family aliases, and ReactFlow overrides.
 */
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  .font-sans { font-family: 'Inter', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  /* ReactFlow canvas & control overrides */
  .react-flow__bg                       { background-color: #050505; }
  .react-flow__controls button          { background-color: #18181b; border-color: #27272a; fill: #a1a1aa; }
  .react-flow__controls button:hover    { background-color: #27272a; fill: #f4f4f5; }
`;
export type Role = "user" | "assistant" | "tool";

export interface Message {
  id: string;
  role: Role;
  content: string;
  tool_name?: string;
  duration?: string;
  showCard?: boolean;
}

export interface StructuredCard {
  flight: string;
  status: string;
  aircraft: string;
  stand: string;
  eta: string;
  conflict: string;
}

export interface SuggestedPrompt {
  text: string;
  icon: React.ReactNode;
}

export interface ThemeVars {
  "--bg-sidebar": string;
  "--bg-panel": string;
  "--bg-panel-hover": string;
  "--bg-surface": string;
  "--border": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--text-muted": string;
  "--msg-user-bg": string;
  "--msg-user-text": string;
  "--tool-color": string;
  "--tool-bg": string;
  "--tool-border": string;
  "--card-bg": string;
  "--card-shadow": string;
}
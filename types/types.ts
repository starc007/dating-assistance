export interface DatingPrompt {
  id: string;
  prompt: string;
  answer: string;
  platform: "hinge" | "bumble" | "tinder" | "other";
  timestamp: string;
}

export interface DatingMessage {
  id: string;
  content: string;
  sender: "user" | "match";
  timestamp: string;
  platform: "hinge" | "bumble" | "tinder" | "other";
}

export interface ConversationContext {
  matchName?: string;
  platform: "hinge" | "bumble" | "tinder" | "other";
  conversationHistory: DatingMessage[];
  profilePrompts?: DatingPrompt[];
}

export interface ResponseSuggestion {
  id: string;
  response: string;
  reasoning: string;
  tone: "playful" | "genuine" | "witty" | "curious" | "confident";
  confidence: number; // 0-1 scale
}

export interface PromptAnalysis {
  personalityTraits: string[];
  interests: string[];
  conversationStyle: string;
  responseStrategy: string;
  suggestedTopics: string[];
}

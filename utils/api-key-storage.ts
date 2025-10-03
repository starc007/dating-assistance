const API_KEY_STORAGE_KEY = "dating-assistant-gemini-api-key";

export interface ApiKeyStorage {
  getApiKey: () => string | null;
  setApiKey: (apiKey: string) => void;
  removeApiKey: () => void;
  hasApiKey: () => boolean;
}

class LocalApiKeyStorage implements ApiKeyStorage {
  getApiKey(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error reading API key from localStorage:", error);
      return null;
    }
  }

  setApiKey(apiKey: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(apiKey));
    } catch (error) {
      console.error("Error saving API key to localStorage:", error);
      throw new Error("Failed to save API key");
    }
  }

  removeApiKey(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing API key from localStorage:", error);
    }
  }

  hasApiKey(): boolean {
    return this.getApiKey() !== null;
  }
}

// Create singleton instance
export const apiKeyStorage = new LocalApiKeyStorage();

// Utility functions for easy access
export const getStoredApiKey = (): string | null => apiKeyStorage.getApiKey();
export const setStoredApiKey = (apiKey: string): void =>
  apiKeyStorage.setApiKey(apiKey);
export const removeStoredApiKey = (): void => apiKeyStorage.removeApiKey();
export const hasStoredApiKey = (): boolean => apiKeyStorage.hasApiKey();

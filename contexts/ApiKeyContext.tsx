"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiKeyStorage } from "@/utils/api-key-storage";

interface ApiKeyContextType {
  apiKey: string | null;
  hasApiKey: boolean;
  setApiKey: (apiKey: string) => void;
  removeApiKey: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider = ({ children }: ApiKeyProviderProps) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = apiKeyStorage.getApiKey();
    setApiKeyState(storedApiKey);
  }, []);

  const setApiKey = (newApiKey: string) => {
    apiKeyStorage.setApiKey(newApiKey);
    setApiKeyState(newApiKey);
  };

  const removeApiKey = () => {
    apiKeyStorage.removeApiKey();
    setApiKeyState(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const hasApiKey = apiKey !== null;

  const value: ApiKeyContextType = {
    apiKey,
    hasApiKey,
    setApiKey,
    removeApiKey,
    isModalOpen,
    openModal,
    closeModal,
  };

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};

"use client";
import ChatInput from "@/components/appComp/ChatInput";
import ChatMessages from "@/components/appComp/ChatMessages";
import Suggestion from "@/components/appComp/Suggestion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useDatingChat } from "@/utils/useDatingChat";
import { useApiKey } from "@/contexts/ApiKeyContext";

const HomePage = () => {
  const { messages, input, setInput, append, isLoading } = useDatingChat();
  const { hasApiKey, openModal } = useApiKey();

  const [isInputExpanded, setIsInputExpanded] = React.useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsInputExpanded(true);
      setInput("");

      await append({
        content: message,
        role: "user",
        id: Date.now().toString(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!hasApiKey) {
      openModal();
      return;
    }
    handleSendMessage(suggestion);
  };

  return (
    <main className="h-full flex flex-col overflow-hidden">
      <AnimatePresence>
        {!isInputExpanded && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold">Dating Response Assistant</h1>
            <p className="text-gray-600 mt-2">
              Share her prompt, message, or conversation and I'll help you craft
              the perfect response
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages or Suggestions */}
      <motion.div
        className="flex-1 relative"
        animate={{
          marginTop: isInputExpanded ? "1rem" : "0",
        }}
      >
        {messages.length > 1 ? (
          <ChatMessages messages={messages} />
        ) : (
          <Suggestion onSuggestionClick={handleSuggestionClick} />
        )}
      </motion.div>

      {/* Chat Input */}
      <motion.div
        className="w-full ml-5"
        initial={false}
        animate={{
          y: isInputExpanded ? "0%" : "-60%",
          scale: isInputExpanded ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </motion.div>
    </main>
  );
};

export default HomePage;

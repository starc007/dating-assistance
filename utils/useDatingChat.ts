import { useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseDatingChatReturn {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  append: (message: {
    content: string;
    role: "user" | "assistant";
    id: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function useDatingChat(): UseDatingChatReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "assistant",
      content:
        "Hello! I'm your dating response assistant. Share her prompt, message, or conversation and I'll help you craft the perfect response.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const append = useCallback(
    async (message: {
      content: string;
      role: "user" | "assistant";
      id: string;
    }) => {
      setMessages((prev) => [...prev, message]);

      if (message.role === "user") {
        setIsLoading(true);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [...messages, message],
              data: { context: "" },
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to get response");
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body");
          }

          let assistantMessage = "";
          const assistantId = Date.now().toString();

          // Add empty assistant message
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", content: "" },
          ]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  setIsLoading(false);
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    assistantMessage += parsed.content;
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantId
                          ? { ...msg, content: assistantMessage }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  // Ignore parsing errors for non-JSON chunks
                }
              }
            }
          }
        } catch (error) {
          console.error("Error:", error);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [messages]
  );

  return {
    messages,
    input,
    setInput,
    append,
    isLoading,
  };
}

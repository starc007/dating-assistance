import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Robot, User } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  if (messages.length === 0) {
    return null;
  }

  const formatMessage = (content: string) => {
    // Preprocess content to handle newlines properly
    const processedContent = content
      .replace(/\n/g, "\n\n") // Double newlines for markdown paragraphs
      .replace(/(\d+ — [^:]+:)/g, "\n\n**$1**") // Format numbered responses
      .replace(/^## /gm, "\n## ") // Ensure headings have proper spacing
      .trim();

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-primary">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-primary/80">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mb-2 text-primary/70">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed break-words">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-primary/90">
                {children}
              </strong>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 my-3">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2">
                <span className="text-primary/60 mt-1">•</span>
                <span className="flex-1">{children}</span>
              </li>
            ),
            pre: ({ children }) => (
              <pre className="whitespace-pre-wrap break-words">{children}</pre>
            ),
            code: ({ children }) => (
              <code className="break-words whitespace-pre-wrap">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <div className="my-2 text-primary/80">{children}</div>
            ),
            hr: () => <div className="my-2" />,
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden py-4 space-y-6 max-w-3xl mx-auto hide-scrollbar">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {message.role === "user" ? (
                <User size={20} weight="fill" className="text-primary/60" />
              ) : (
                <Robot size={20} weight="fill" className="text-primary/60" />
              )}
            </div>
            <div
              className={`px-6 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary/10 rounded-tr-sm"
                  : "border border-primary/5 pt-3 pb-2"
              }`}
            >
              {formatMessage(message.content)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { GithubLogo, Gear, Key } from "@phosphor-icons/react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyModal from "../ui/ApiKeyModal";
import { Button } from "../ui/Button";

const Navbar = () => {
  const {
    hasApiKey,
    openModal,
    closeModal,
    setApiKey,
    removeApiKey,
    isModalOpen,
  } = useApiKey();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  return (
    <>
      <nav className="h-20 px-4 flex items-center fixed top-0 w-full z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between container mx-auto">
          <Link href="/" className="text-2xl font-bold">
            DatingAI
          </Link>
          <div className="flex gap-4 items-center">
            {/* API Key Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasApiKey ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {hasApiKey ? "API Key Set" : "No API Key"}
              </span>
            </div>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-primary/80 hover:text-primary"
            >
              <Gear size={20} />
            </Button>

            <Link
              href="https://github.com/NodeOps-app/dating-ai"
              target="_blank"
              className="text-primary/80 hover:text-primary"
            >
              <GithubLogo size={24} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Settings Dropdown */}
      {showSettings && (
        <div
          ref={settingsRef}
          className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64"
        >
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Settings</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Key</span>
                <div className="flex gap-2">
                  {hasApiKey ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openModal}
                        className="text-xs"
                      >
                        <Key size={14} className="mr-1" />
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeApiKey}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openModal}
                      className="text-xs"
                    >
                      <Key size={14} className="mr-1" />
                      Add Key
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={setApiKey}
      />
    </>
  );
};

export default Navbar;

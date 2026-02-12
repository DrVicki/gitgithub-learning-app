"use client";

import { useState, useRef, useEffect } from "react";
import { useTutorial } from "./TutorialProvider";
import { Card } from "@/components/ui/card";
import { Terminal, ChevronRight } from "lucide-react";

export function CommandPrompt() {
  const { state, processCommand } = useTutorial();
  const [inputValue, setInputValue] = useState("");
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.terminalHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processCommand(inputValue);
      setInputValue("");
    }
  };

  return (
    <Card className="h-full flex flex-col font-code bg-black text-white">
      <div className="flex items-center gap-2 p-2 border-b border-gray-700 text-sm text-gray-400">
        <Terminal className="h-4 w-4" />
        <span>Terminal</span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto text-sm">
        {state.terminalHistory.map((line) => (
          <div key={line.id}>
            {line.type === "command" ? (
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-accent" />
                <span className="ml-1 text-gray-300">{line.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-400">{line.content}</div>
            )}
          </div>
        ))}
        <div ref={endOfHistoryRef} />
      </div>
      <form onSubmit={handleFormSubmit} className="flex items-center p-2 border-t border-gray-700">
        <ChevronRight className="h-4 w-4 text-accent" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-1 ml-1 bg-transparent outline-none placeholder-gray-500"
          placeholder="Type your git command here..."
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </Card>
  );
}

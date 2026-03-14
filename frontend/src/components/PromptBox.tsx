import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PromptBoxProps = {
  handleCreateProject: (prompt: string) => void;
};

const placeholderMessages = [
  "Describe what you want to build...",
  "A landing page for a tech startup...",
  "An e-commerce store with dark mode...",
  "A personal portfolio with animations...",
  "A blog with a minimalist design...",
  "A SaaS dashboard with charts...",
  "A mobile-friendly restaurant menu...",
  "A photography portfolio gallery...",
  "A newsletter signup page...",
  "A pricing table with three tiers...",
];

export const PromptBox = ({ handleCreateProject }: PromptBoxProps) => {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rotate placeholder messages with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderMessages.length);
        setIsFading(false);
      }, 200); // Fade out/in duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!prompt.trim()) return;

    handleCreateProject(prompt);
    setPrompt("");
  };

  // Auto-resize function
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <div className="flex justify-center relative">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderMessages[placeholderIndex]}
          className={`pr-36 py-6 pl-6 text-lg rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-primary resize-none overflow-hidden min-h-[72px] max-h-[300px] bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 ${
            isFading ? "opacity-60" : "opacity-100"
          }`}
          rows={1}
        />

        <Button
          type="button"
          size="lg"
          onClick={handleClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
          disabled={!prompt.trim()}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Press Enter to create, Shift+Enter for new line
      </p>
    </div>
  );
};

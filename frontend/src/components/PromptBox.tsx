import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromptBoxProps = {
  handleCreateProject: (prompt: string) => void;
};

export const PromptBox = ({ handleCreateProject }: PromptBoxProps) => {
  const [prompt, setPrompt] = useState("");

  const handleClick = () => {
    if (!prompt.trim()) return;

    handleCreateProject(prompt);
    setPrompt("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to build..."
          className="pr-20 py-6 text-lg pl-6 rounded-full border-2 focus-visible:ring-2 focus-visible:ring-primary"
        />

        <Button
          type="button"
          size="lg"
          onClick={handleClick}
          className="absolute right-1 top-1 rounded-full px-6"
          disabled={!prompt.trim()}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create
        </Button>
      </div>
    </div>
  );
};
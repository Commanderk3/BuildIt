import { useState } from "react";
import SandpackPreview from "../components/SandpackPreview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ViewMode = "code" | "preview" | "split";

export default function Builder() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const files = {
    "/App.tsx": `
export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Hello Builder</h1>
      <button>Click me</button>
    </div>
  );
}
`,
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between">
        <Badge variant="outline">⚡ Builder</Badge>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <div
          className={`
            transition-all duration-200
            ${viewMode === "preview" ? "w-full" : ""}
            ${viewMode === "code" ? "w-full" : ""}
            ${viewMode === "split" ? "w-2/3" : ""}
          `}
        >
          <SandpackPreview files={files} />
        </div>

        {/* Inspector */}
        {viewMode !== "code" && (
          <Card className="w-80 border-l rounded-none" />
        )}
      </div>
    </div>
  );
}

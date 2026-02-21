import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useBuild } from "@/contexts/BuildContext";
import SandpackWindow from "../components/SandpackWindow";
import { getStylesOfNode } from "../lib/getStyle";
import { injectNodeIdsIntoTsx } from "@/lib/ast/parser";
import { ChatWindow } from "@/components/Chat/ChatWindow";

type Mode = "preview" | "code_editor" | "inspector";

export default function WorkStation() {
  const { setSelected, setInjectedFiles, setNodeMap, files } = useBuild();
  const [mode, setMode] = useState<Mode>("preview");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "ELEMENT_SELECTED") return;

      const { tag, nodeId, className, inlineStyle, text } = event.data.payload;

      if (nodeId === null) {
        console.error("Node Id is null");
        return;
      }

      const style = getStylesOfNode(inlineStyle, className);

      console.log(style);

      setSelected({
        tag,
        nodeId,
        className,
        style,
        text,
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setSelected]);

  useEffect(() => {
    if (mode !== "inspector") return;
    const result = injectNodeIdsIntoTsx(files);

    setInjectedFiles(result.files);
    setNodeMap(result.map);
  }, [mode]);

  return (
    <div className="flex overflow-hidden">
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex justify-end gap-2 border-b p-2">
          <Button
            size="sm"
            variant={mode === "preview" ? "default" : "outline"}
            onClick={() => setMode("preview")}
          >
            Preview
          </Button>

          <Button
            size="sm"
            variant={mode === "code_editor" ? "default" : "outline"}
            onClick={() => setMode("code_editor")}
          >
            Code
          </Button>

          <Button
            size="sm"
            variant={mode === "inspector" ? "default" : "outline"}
            onClick={() => setMode("inspector")}
          >
            Inspector
          </Button>
        </div>

        {/* Sandpack */}
        <div className="flex flex-1 overflow-hidden h-full w-screen">
          <div className="w-[30vw]">
            <ChatWindow />
          </div>
          <SandpackWindow mode={mode} />
        </div>
      </div>
    </div>
  );
}

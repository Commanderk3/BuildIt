import { useEffect, useState } from "react";
import SandpackWindow from "../components/SandpackWindow";
import { Button } from "@/components/ui/button";

import { useBuild } from "@/contexts/BuildContext";
import { getStylesOfNode } from "../lib/getStyle";
import { injectNodeIdsIntoTsx, addInspectorImport } from "@/lib/ast/parser";
import { downloadProject } from "@/lib/generateProject";
import { ChatWindow } from "@/components/ChatWindow";
import { Trash2, ArrowDownToLine } from "lucide-react";

import { deleteProject } from "@/api/postMessage";
import { useNavigate } from "react-router-dom";

type Mode = "preview" | "code_editor" | "inspector";

export default function WorkStation() {
  const { setSelected, setInjectedFiles, setNodeMap, projectId, title, files } =
    useBuild();

  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("preview");

  const handleDeleteProject = async () => {
    if (!projectId) return;

    const confirmed = confirm("Delete this project?");
    if (!confirmed) return;

    try {
      await deleteProject(projectId);
      localStorage.removeItem(`chat_${projectId}`);
      navigate("/projects");
    } catch (error) {
      console.error(error);
    }
  };

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
    const inspectorCode = addInspectorImport(result.files);
    setInjectedFiles(inspectorCode);
    setNodeMap(result.map);
  }, [files, mode, setInjectedFiles, setNodeMap]);

  return (
    <div className="flex overflow-hidden">
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b p-2">
          {/* Title on the left */}
          <h2 className="text-lg font-semibold">{title}</h2>

          {/* Buttons on the right */}
          <div className="flex gap-2">
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

            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                downloadProject(files, title);
              }}
            >
              <ArrowDownToLine className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={handleDeleteProject}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sandpack */}
        <div className="flex flex-1 overflow-hidden h-full w-screen">
          <div className="w-[30vw]">
            <ChatWindow key={projectId} />
          </div>
          <SandpackWindow mode={mode} />
        </div>
      </div>
    </div>
  );
}

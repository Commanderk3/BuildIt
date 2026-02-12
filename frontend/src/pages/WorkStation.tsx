import { useEffect, useState } from "react";
import SandpackWindow from "@/components/SandpackWindow";
import { Button } from "@/components/ui/button";
import { Code2, Eye } from "lucide-react";
import { useBuild } from "@/contexts/BuildContext";
import Inspector from "@/components/Inspector";

export default function App() {
  const { selected, updateFiles, getFiles } = useBuild();

  const [showCode, setShowCode] = useState(false);

  useEffect(() => {


    document.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (selected) selected.style.outline = "";
      selected = e.target;
      selected.style.outline = "2px solid red";

      const nodeClass = [...selected.classList].find((c) =>
        c.startsWith("node-"),
      );

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: selected.tagName,
            nodeId: nodeClass,
            className: selected.className,
          },
        },
        "*",
      );
    });

    window.addEventListener("message", (event) => {
      if (!selected) return;

      if (event.data?.type === "APPLY_STYLE") {
        const { property, value } = event.data.payload;
        selected.style[property] = value;
      }

      if (event.data?.type === "APPLY_TEXT") {
        selected.textContent = event.data.payload;
      }
    });
  }, []);

  // Listen selection from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "ELEMENT_SELECTED") {
        updateFiles(event.data.payload);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="gap-2"
          >
            {showCode ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Code2 className="h-4 w-4" />
            )}
            {showCode ? "Hide Code" : "Show Code"}
          </Button>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <SandpackWindow files={getFiles()} showCode={showCode} />
        </div>
      </div>

      {/* Inspector */}
      <Inspector />
    </div>
  );
}

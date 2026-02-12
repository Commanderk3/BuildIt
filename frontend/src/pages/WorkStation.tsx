import { useEffect, useState } from "react";
import SandpackWindow from "@/components/SandpackWindow";
import { Button } from "@/components/ui/button";
import { Code2, Eye } from "lucide-react";

type SelectedElement = {
  tag: string;
  nodeId?: string;
  className?: string;
} | null;

export default function App() {
  const [selected, setSelected] = useState<SelectedElement>(null);
  const [showCode, setShowCode] = useState(false);

  // ==================================================
  // Files must be state → so editing updates preview
  // ==================================================
  const [files, setFiles] = useState({
    "/App.tsx": `
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    let selected = null;

    document.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (selected) selected.style.outline = "";
      selected = e.target;
      selected.style.outline = "2px solid red";

      const nodeClass = [...selected.classList].find(c => c.startsWith("node-"));

      window.parent.postMessage({
        type: "ELEMENT_SELECTED",
        payload: {
          tag: selected.tagName,
          nodeId: nodeClass,
          className: selected.className
        }
      }, "*");
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

  return (
    <div className="node-1" style={{ padding: 20 }}>
      <h1 className="node-2">Hello Builder</h1>
      <button className="node-3">Click me</button>
      <p className="node-4">A paragraph here</p>
    </div>
  );
}
`,
    "/index.tsx": `
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
`,
  });

  // ==================================================
  // Listen selection from iframe
  // ==================================================
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "ELEMENT_SELECTED") {
        setSelected(event.data.payload);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ==================================================
  // 🔥 STYLE → rewrite JSX
  // ==================================================
  const updateCodeStyle = (property: string, value: string) => {
    if (!selected?.nodeId) return;

    const code = files["/App.tsx"];

    const regex = new RegExp(
      `(className=["'][^"']*${selected.nodeId}[^"']*["'][^>]*)(>)`,
    );

    const match = code.match(regex);
    if (!match) return;

    let elementPart = match[1];

    if (elementPart.includes("style={{")) {
      const styleRegex = /style=\{\{([^}]*)\}\}/;
      elementPart = elementPart.replace(styleRegex, (m, styles) => {
        const propRegex = new RegExp(`${property}\\s*:`);
        if (propRegex.test(styles)) {
          const updated = styles.replace(
            new RegExp(`${property}\\s*:\\s*[^,}]*`),
            `${property}: "${value}"`,
          );
          return `style={{${updated}}}`;
        } else {
          return `style={{${styles}, ${property}: "${value}"}}`;
        }
      });
    } else {
      elementPart += ` style={{ ${property}: "${value}" }}`;
    }

    const newCode = code.replace(match[1], elementPart);

    setFiles({
      ...files,
      "/App.tsx": newCode,
    });
  };

  // ==================================================
  // 🔥 TEXT → rewrite JSX
  // ==================================================
  const updateCodeText = (value: string) => {
    if (!selected?.nodeId) return;

    const code = files["/App.tsx"];

    const regex = new RegExp(
      `(<[^>]*className=["'][^"']*${selected.nodeId}[^"']*["'][^>]*>)([^<]*)(</[^>]+>)`,
    );

    const newCode = code.replace(regex, `$1${value}$3`);

    setFiles({
      ...files,
      "/App.tsx": newCode,
    });

    const iframe = document.querySelector("iframe");
    iframe?.contentWindow?.postMessage(
      {
        type: "APPLY_TEXT",
        payload: value,
      },
      "*",
    );
  };

  // ==================================================
  // live preview feel + save to code
  // ==================================================
  const updateStyle = (property: string, value: string) => {
    const iframe = document.querySelector("iframe");
    iframe?.contentWindow?.postMessage(
      {
        type: "APPLY_STYLE",
        payload: { property, value },
      },
      "*",
    );

    updateCodeStyle(property, value);
  };

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

          <SandpackWindow files={files} showCode={showCode} />

    
        </div>
      </div>

      {/* Inspector */}
      <div
        style={{
          width: 260,
          padding: 16,
          borderLeft: "1px solid #ddd",
          fontFamily: "sans-serif",
        }}
      >
        <h3>🎯 Inspector</h3>

        {selected ? (
          <>
            <p>
              <b>{selected.tag}</b>
            </p>
            <p>
              <b>Node:</b> {selected.nodeId}
            </p>

            {/* TEXT */}
            <div>
              <label>Text</label>
              <input
                type="text"
                placeholder="Edit text"
                onChange={(e) => updateCodeText(e.target.value)}
              />
            </div>

            {/* PADDING */}
            <div style={{ marginTop: 10 }}>
              <label>Padding</label>
              <input
                type="text"
                placeholder="20px"
                onChange={(e) => updateStyle("padding", e.target.value)}
              />
            </div>

            {/* BACKGROUND */}
            <div style={{ marginTop: 10 }}>
              <label>Background</label>
              <input
                type="color"
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              />
            </div>

            {/* TEXT COLOR */}
            <div style={{ marginTop: 10 }}>
              <label>Text color</label>
              <input
                type="color"
                onChange={(e) => updateStyle("color", e.target.value)}
              />
            </div>
          </>
        ) : (
          <p>Click an element</p>
        )}
      </div>
    </div>
  );
}

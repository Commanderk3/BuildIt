import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Type definitions
type SelectedElement = {
  tag: string;
  nodeId?: string;
  className?: string;
  style?: React.CSSProperties;
} | null;

type Files = {
  [key: string]: string;
};

type BuildContextType = {
  updateCodeStyle: (property: string, value: string) => void;
  updateCodeText: (value: string) => void;
  updateStyle: (property: string, value: string) => void;
  updateFiles: (newFiles: Files) => void;
  getFiles: () => Files,
  selected?: SelectedElement;
  setSelected?: React.Dispatch<React.SetStateAction<SelectedElement>>;
};

const BuildContext = createContext<BuildContextType | null>(null);

type BuildProviderProps = {
  children: ReactNode;
};

export function BuildProvider({ children }: BuildProviderProps) {
  const [selected, setSelected] = useState<SelectedElement>(null);
  const [files, setFiles] = useState<Files>({
    "/App.tsx": `
    import { useEffect } from "react";
    
    export default function App() {
      useEffect(() => {
        let selected: HTMLElement | null = null;
    
        document.addEventListener("click", (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
    
          if (selected) selected.style.outline = "";
          selected = e.target as HTMLElement;
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
    
        window.addEventListener("message", (event: MessageEvent) => {
          if (!selected) return;
    
          if (event.data?.type === "APPLY_STYLE") {
            const { property, value } = event.data.payload;
            (selected.style as any)[property] = value;
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
  const getFiles = (): Files => {
    return files;
  } 

  const updateFiles = (newFiles: Files): void => {
    setFiles(newFiles);
  };

  const updateCodeText = (value: string): void => {
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

  const updateStyle = (property: string, value: string): void => {
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

  const updateCodeStyle = (property: string, value: string): void => {
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
      elementPart = elementPart.replace(styleRegex, (m: string, styles: string) => {
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

  const contextValue: BuildContextType = {
    updateCodeStyle,
    updateCodeText,
    updateStyle,
    updateFiles,
    selected,
    getFiles,
    setSelected,
  };

  return (
    <BuildContext.Provider value={contextValue}>
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild(): BuildContextType {
  const context = useContext(BuildContext);
  
  if (!context) {
    throw new Error("useBuild must be used within a BuildProvider");
  }
  
  return context;
}
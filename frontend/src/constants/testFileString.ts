const testFile = {
  "/App.tsx": `
    import { useEffect } from "react";
    
    export default function App() {
      useEffect(() => {

        document.addEventListener("click", (e) => {
          const el = e.target as HTMLElement;
        
          const nodeId = el.getAttribute("data-node-id");
          if (!nodeId) return;

          window.parent.postMessage(
            {
              type: "ELEMENT_SELECTED",
              payload: {
                tag: el.tagName,
                nodeId,
                className: el.className,
                inlineStyle: el.getAttribute("style")
              },
            },
            "*",
          );
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
        <div className="container bg-gray-500" data-node-id="1" style={{ padding: 20 }}>
          <h1 className="title" data-node-id="2" style={{ color: "red" }}>Hello Builder</h1>
          <button className="buttoner" data-node-id="3">Click me</button>
          <p className="info" data-node-id="4">A paragraph here</p>
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
};

const testFile2 = {
  "/styles.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles */
body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}`,
  "/App.tsx": `import { useEffect } from "react";
import "./styles.css";

export default function App() {

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;
  
      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      console.log(el.getAttribute("style"));

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
          },
        },
        "*",
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-5 text-white rounded-lg bg-green-500">
      <h1 className="text-2xl font-bold border-2 mb-4">Hello Builder</h1>
      <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Click me</button>
      <p className="mt-4 text-white/80">Diwangshu Kakoty</p>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

const testFile3 = {
  "/styles.css": `@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

/* Your custom styles */
body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}`,
  "/App.tsx": `import { useEffect } from "react";
import "./styles.css";

export default function App() {

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;
  
      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
          },
        },
        "*",
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-5 text-white rounded-lg bg-red-200">
      <h1 className="text-2xl font-bold mb-4">Hello Builder</h1>
      <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Click me</button>
      <p className="mt-4 text-white/80">Diwangshu Kakoty</p>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

export { testFile, testFile2, testFile3 };

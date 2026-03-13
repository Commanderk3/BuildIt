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
// coffee
const testFile2 = {
  "/index.tsx":
    "import React from 'react';import ReactDOM from 'react-dom/client';import App from './App';import './index.css';const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);root.render(<React.StrictMode><App /></React.StrictMode>);",
  "/App.tsx":
    "import React from 'react';import HeroSection from './components/HeroSection';const App: React.FC = () => {return (<div className=\"min-h-screen bg-gray-100\"><HeroSection /></div>);};export default App;",
  "/components/HeroSection.tsx":
    "import React from 'react';import ShopNameDisplay from './ShopNameDisplay';import TaglineDisplay from './TaglineDisplay';import CTAButton from './CTAButton';const HeroSection: React.FC = () => {return (<section className=\"relative h-screen flex items-center justify-center bg-amber-900 text-white overflow-hidden\"><div className=\"absolute inset-0 bg-cover bg-center opacity-20\" style={{ backgroundImage: 'url(\"https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\")' }}></div><div className=\"relative z-10 text-center p-4\"><ShopNameDisplay /><TaglineDisplay /><CTAButton /></div></section>);};export default HeroSection;",
  "/components/ShopNameDisplay.tsx":
    "import React from 'react';const ShopNameDisplay: React.FC = () => {return (<h1 className=\"text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg\">Brew Haven</h1>);};export default ShopNameDisplay;",
  "/components/TaglineDisplay.tsx":
    "import React from 'react';const TaglineDisplay: React.FC = () => {return (<p className=\"text-xl md:text-2xl font-light mb-8 max-w-xl mx-auto drop-shadow-md\">Your Daily Dose of Delight</p>);};export default TaglineDisplay;",
  "/components/CTAButton.tsx":
    "import React from 'react';const CTAButton: React.FC = () => {return (<button className=\"bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105\">Explore Our Menu</button>);};export default CTAButton;",
  "/tailwind.config.js":
    "/** @type {import('tailwindcss').Config} */module.exports = {content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],theme: {extend: {},},plugins: [],};",
  "/index.css": "@tailwind base;@tailwind components;@tailwind utilities;",
};

const testFile6 = {
  "/App.tsx": `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    let hoveredEl: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]") as HTMLElement | null;
      if (!el) return;

      // If same element, do nothing
      if (hoveredEl === el) return;

      // Remove old highlight
      if (hoveredEl) {
        hoveredEl.style.outline = "";
      }

      // Add new highlight
      el.style.outline = "2px solid #3b82f6"; // Tailwind blue-500
      el.style.outlineOffset = "-2px";

      hoveredEl = el;
    };

    const handleMouseLeave = () => {
      if (hoveredEl) {
        hoveredEl.style.outline = "";
        hoveredEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;

      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      let directText = "";

      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          directText += node.textContent;
        }
      });

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
            text: directText.trim(),
          },
        },
        "*"
      );
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Simple Test Page
      </h1>
      
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Card 1
        </h2>
        <p className="text-gray-600 mb-4">
          This is a simple card
        </p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Click
        </button>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">
          Card 2
        </h2>
        <p className="text-gray-600 mb-4">
          Another simple card
        </p>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Click
        </button>
      </div>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

const testFile4 = {
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

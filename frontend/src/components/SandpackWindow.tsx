import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

import Inspector from "./Inspector";
import { useBuild } from "@/contexts/BuildContext";
type SandpackWindowProps = {
  mode: "preview" | "code_editor" | "inspector";
};

export default function SandpackWindow({ mode }: SandpackWindowProps) {
  const { files, injectedFiles } = useBuild();

  return (
    <SandpackProvider
      template="react-ts"
      theme="dark"
      files={mode === "inspector" ? injectedFiles : files}
      customSetup={{
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.22.3",
        },
        devDependencies: {
          typescript: "^5.3.3",
          "@types/react": "^18.2.45",
          "@types/react-dom": "^18.2.18",
          "@types/react-router-dom": "^5.3.3",
          tailwindcss: "^3.3.0",
          autoprefixer: "^10.4.0",
          postcss: "^8.4.0",
          "postcss-loader": "^7.3.0",
          "css-loader": "^6.8.0",
          "style-loader": "^3.3.0",
        },
      }}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
    >
      <div
        className="flex rounded-2xl h-full w-full overflow-hidden"
        style={{ minHeight: "90vh" }}
      >
        {mode === "code_editor" && (
          <div className="w-full border-r overflow-hidden flex-shrink-0">
            <SandpackLayout style={{ height: "90vh" }}>
              <SandpackFileExplorer style={{ height: "90vh" }} />
              <SandpackCodeEditor
                showLineNumbers={true}
                showInlineErrors={true}
                showTabs={false}
                style={{ height: "90vh" }}
              />
            </SandpackLayout>
          </div>
        )}

        {/* Preview & Inspector Section - Hidden in code_editor mode, visible otherwise */}
        <div
          className={`${mode === "code_editor" ? "w-0" : "flex-1"} flex transition-all duration-300`}
        >
          <div
            className={`${mode === "inspector" ? "w-3/4" : "w-full"} transition-all duration-300 overflow-hidden flex-shrink-0`}
          >
            <SandpackPreview style={{ height: "90vh" }} />
          </div>

          <div
            className={`${mode === "inspector" ? "w-1/4" : "w-0"} transition-all duration-300 overflow-hidden flex-shrink-0`}
          >
            {mode === "inspector" && (
              <div className="h-full overflow-auto">
                <Inspector />
              </div>
            )}
          </div>
        </div>
      </div>
    </SandpackProvider>
  );
}

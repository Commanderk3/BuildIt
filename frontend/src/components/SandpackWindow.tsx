import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
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
        },
        devDependencies: {
          tailwindcss: "^3.3.0",
          autoprefixer: "^10.4.0",
          postcss: "^8.4.0",
          "postcss-loader": "^7.3.0",
          "css-loader": "^6.8.0",
          "style-loader": "^3.3.0",
        },
      }}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"], // Tailwind CDN as external resource
      }}
    >
      <div className="flex flex-1 overflow-hidden">
        {mode === "code_editor" && (
          <div className="w-1/2 border-r">
            <SandpackCodeEditor />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <SandpackPreview />
          {mode === "inspector" && <Inspector />}
        </div>
      </div>
    </SandpackProvider>
  );
}

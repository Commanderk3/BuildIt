import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

type Props = {
  files: Record<string, string>;
  showCode: boolean;
};
export default function SandpackWindow({ files, showCode }: Props) {
  return (
    <SandpackProvider template="react-ts" theme="dark" files={files}>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {showCode && (
          <div style={{ width: "50%", borderRight: "1px solid #ddd" }}>
            <SandpackCodeEditor />
          </div>
        )}
        <div style={{ overflow: "auto" }}>
          <SandpackPreview />
        </div>
      </div>
    </SandpackProvider>
  );
}

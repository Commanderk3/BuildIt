import { Sandpack } from "@codesandbox/sandpack-react";

type Props = {
  files: Record<string, string>;
};

export default function SandpackPreview({ files }: Props) {

  return (
    <Sandpack
      template="react-ts"
      theme="dark"
      files={files}
      options={{
        showNavigator: true,
        showTabs: true,
        showLineNumbers: true,
        wrapContent: true,
      }}
    />
  );
}

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { testFile, testFile2 } from "@/constants/testFileString";
import { addInspectorImport } from "@/lib/ast/parser";
import updateCode from "@/lib/ast/updateCode";

export type SelectedElement = {
  tag: string;
  nodeId: string;
  className: string;
  style: React.CSSProperties;
  text: string;
} | null;

export type Files = {
  [key: string]: string;
};

export type NodeMap = Record<string, { from: number; to: number }>;

type BuildContextType = {
  updateCodeText: (value: string) => void;
  updateStyle: (property: string, value: string) => void;
  updateFiles: (newFiles: Files) => void;
  renderCode: (code: string) => void;
  files: Files;
  injectedFiles: Files;
  title: string;
  updateTitle: (title: string) => void;
  projectId: string;
  setInjectedFiles: React.Dispatch<React.SetStateAction<Files>>;
  selected: SelectedElement;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElement>>;
  setNodeMap: React.Dispatch<React.SetStateAction<NodeMap>>;
  loadProject: (projectId: string, pullCode: boolean) => void;
};

const BuildContext = createContext<BuildContextType | null>(null);

type BuildProviderProps = {
  children: ReactNode;
};

export function BuildProvider({ children }: BuildProviderProps) {
  const [selected, setSelected] = useState<SelectedElement>(null);
  const [files, setFiles] = useState<Files>(testFile2);
  const [injectedFiles, setInjectedFiles] = useState<Files>({});
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [nodeMap, setNodeMap] = useState<
    Record<string, { from: number; to: number }>
  >({});

  const loadProject = (projectId: string, pullCode: boolean) => {
    setProjectId(projectId);
    if (pullCode) {
      // pull code from github and convert it to Files
      // or read text file data
      setFiles(testFile2);
    } else {
      setFiles(testFile2); // default page
    }
  };

  const updateTitle = (title: string) => {
    setTitle(title);
  };

  const renderCode = (code: string) => {
    // check if valid structure

    // render code
    const files = JSON.parse(code);
    console.log(files);
    console.log("Rendering .....");
    setFiles(files.files);
  };

  const updateFiles = (newFiles: Files): void => {
    setFiles(newFiles);
  };

  const updateCodeText = (value: string): void => {};

  const updateStyle = (property: string, value: string): void => {
    // FEAT: add debounce
    console.log(property, value);
    const newFiles = updateCode(
      property,
      value,
      injectedFiles,
      nodeMap,
      selected,
    );
    const inspectorCode = addInspectorImport(newFiles);
    setInjectedFiles(inspectorCode);
  };

  const contextValue: BuildContextType = {
    updateCodeText,
    updateStyle,
    updateFiles,
    selected,
    files,
    title,
    injectedFiles,
    updateTitle,
    projectId,
    loadProject,
    setInjectedFiles,
    setSelected,
    setNodeMap,
    renderCode,
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

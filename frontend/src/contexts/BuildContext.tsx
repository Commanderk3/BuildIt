import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { testFile, testFile2, testFile5 } from "@/constants/testFileString";
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
  files: Files;
  injectedFiles: Files;
  projectId: string;
  setInjectedFiles: React.Dispatch<React.SetStateAction<Files>>;
  selected: SelectedElement;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElement>>;
  setNodeMap: React.Dispatch<React.SetStateAction<NodeMap>>;
  loadProject: (projectId: string) => void;
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
  const [nodeMap, setNodeMap] = useState<
    Record<string, { from: number; to: number }>
  >({});

  const loadProject = (projectId: string) => {
    setProjectId(projectId);
    // pull code from github and convert it to Files
    setFiles(testFile2);
  }

  const updateFiles = (newFiles: Files): void => {
    setFiles(newFiles);
  };

  const updateCodeText = (value: string): void => {};

  const updateStyle = (property: string, value: string): void => {
    // FEAT: add debounce
    console.log(property, value);
    const newFiles= updateCode(property, value, injectedFiles, nodeMap, selected);
    setInjectedFiles(newFiles);
  };

  const contextValue: BuildContextType = {
    updateCodeText,
    updateStyle,
    updateFiles,
    selected,
    files,
    injectedFiles,
    projectId,
    loadProject,
    setInjectedFiles,
    setSelected,
    setNodeMap,
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

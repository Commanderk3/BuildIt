import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { testFile, testFile2, testFile3 } from "@/constants/testFileString";
import updateCode from "@/lib/ast/updateCode";

// Type definitions
export type SelectedElement = {
  tag: string;
  nodeId: string;
  className: string;
  style: React.CSSProperties;
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
  setInjectedFiles: React.Dispatch<React.SetStateAction<Files>>;
  selected: SelectedElement;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElement>>;
  setNodeMap: React.Dispatch<React.SetStateAction<NodeMap>>;
};

const BuildContext = createContext<BuildContextType | null>(null);

type BuildProviderProps = {
  children: ReactNode;
};

export function BuildProvider({ children }: BuildProviderProps) {
  const [selected, setSelected] = useState<SelectedElement>(null);
  const [files, setFiles] = useState<Files>(testFile2);
  const [injectedFiles, setInjectedFiles] = useState<Files>({});
  const [nodeMap, setNodeMap] = useState<
    Record<string, { from: number; to: number }>
  >({});

  const updateFiles = (newFiles: Files): void => {
    setFiles(newFiles);
  };

  const updateCodeText = (value: string): void => {};

  const updateStyle = (property: string, value: string): void => {
    // add debounce
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

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { testFile2 } from "@/constants/testFileString";
import { addInspectorImport } from "@/lib/ast/parser";
import updateCode from "@/lib/ast/updateCode";
import useLocalProject from "@/lib/localProject";

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
  loadProjectFromIndexDB: (projectId: string) => void;
};

const BuildContext = createContext<BuildContextType | null>(null);

type BuildProviderProps = {
  children: ReactNode;
};

type ResponseFiles = {
  files: Files;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
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

  const loadProjectFromIndexDB = async (projectId: string) => {
    try {
      const loadedFiles = await useLocalProject("load", projectId);
      if (loadedFiles === null) {
        setFiles(testFile2);
        throw new Error("File not found");
      } else {
        setProjectId(projectId);
        setFiles(loadedFiles);
      }
    } catch (err) {
      console.error("Error occured", err);
    }
  };

  const updateTitle = (title: string) => {
    setTitle(title);
  };

  const renderCode = (code: string) => {
    const files: ResponseFiles = JSON.parse(code);
    // check if valid structure
    // render code
    console.log("Rendering .....", files);
    setFiles(files.files);
    useLocalProject("save", projectId, files.files);
  };

  const updateFiles = (newFiles: Files): void => {
    setFiles(newFiles);
  };

  const updateCodeText = (_value: string): void => {
    void _value;
  };

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
    loadProjectFromIndexDB,
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

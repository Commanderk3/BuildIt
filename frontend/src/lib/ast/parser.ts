import { inspectorCode } from "@/constants/inspectorCode";
import { Project, Node } from "ts-morph";

export type RangeMap = Record<
  string,
  {
    from: number;
    to: number;
  }
>;

export type InjectResult = {
  code: string;
  map: RangeMap;
  nextCounter: number;
};

export function injectNodeIdsIntoTsx(files: Record<string, string>): {
  files: Record<string, string>;
  map: Record<string, { from: number; to: number }>;
} {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      jsx: 2,
    },
  });

  let counter = 1;
  const result: Record<string, string> = {};
  const nodeMap: Record<string, { from: number; to: number }> = {};

  Object.entries(files).forEach(([filePath, code]) => {
    // Skip files that can't have HTML tags
    if (!filePath.match(/\.(tsx|jsx|html)$/i)) {
      result[filePath] = code;
      return;
    }

    const sourceFile = project.createSourceFile(filePath, code, {
      overwrite: true,
    });

    const from = counter;

    sourceFile.forEachDescendant((node) => {
      if (
        Node.isJsxOpeningElement(node) ||
        Node.isJsxSelfClosingElement(node)
      ) {
        const nodeId = counter++;

        const alreadyHas = node.getAttributes().some((attr) => {
          if (!Node.isJsxAttribute(attr)) return false;
          return attr.getNameNode().getText() === "data-node-id";
        });

        if (!alreadyHas) {
          node.addAttribute({
            name: "data-node-id",
            initializer: `"${nodeId}"`,
          });
        }
      }
    });

    const to = counter - 1;
    nodeMap[filePath] = { from, to };
    result[filePath] = sourceFile.getText();
  });

  return {
    files: result,
    map: nodeMap,
  };
}

export function removeNodeIdsFromTsx(filePath: string, code: string): string {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      jsx: 2,
    },
  });

  const sourceFile = project.createSourceFile(filePath, code, {
    overwrite: true,
  });

  sourceFile.forEachDescendant((node) => {
    if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
      node.getAttributes().forEach((attr) => {
        if (!Node.isJsxAttribute(attr)) return;

        const name = attr.getNameNode().getText();

        if (name === "data-node-id") {
          attr.remove();
        }
      });
    }
  });

  return sourceFile.getText();
}

export function addInspectorImport(files: Record<string, string>) {
  const newFiles = { ...files };

  newFiles["/__inspector.ts"] = inspectorCode;

  const path = "/index.tsx";
  const importLine = `import "./__inspector";\n`;

  if (!newFiles[path]) return newFiles;
  if (!newFiles[path].includes(`"./__inspector"`)) {
    newFiles[path] = importLine + newFiles[path];
  }

  return newFiles;
}
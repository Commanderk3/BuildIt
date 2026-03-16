import type { NodeMap, SelectedElement } from "@/contexts/BuildContext";
import { Project, Node } from "ts-morph";

type Files = Record<string, string>;

const updateCode = (
  property: string, 
  value: string, 
  injectedFiles: Files, 
  nodeMap: NodeMap,
  selected: SelectedElement
): Files => {
  console.log(property, value);

  if (selected === null) return injectedFiles;
  
  const updatedFiles = { ...injectedFiles };
  
  // Find which file contains this nodeId
  let targetFilePath: string | null = null;
  const nodeIdNum = parseInt(selected.nodeId.replace('n', ''));
  
  for (const [filePath, range] of Object.entries(nodeMap)) {
    if (nodeIdNum >= range.from && nodeIdNum <= range.to) {
      targetFilePath = filePath;
      break;
    }
  }
  
  if (!targetFilePath) {
    console.error(`Node ID ${selected.nodeId} not found in any file range`);
    return updatedFiles;
  }

  const fileCode = updatedFiles[targetFilePath];
  if (!fileCode) {
    console.error(`File ${targetFilePath} not found in injectedFiles`);
    return updatedFiles;
  }

  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { jsx: 2 },
  });

  const sourceFile = project.createSourceFile(targetFilePath, fileCode, {
    overwrite: true,
  });

  let modified = false;

  const cssToTailwind = (property: string, value: string): string[] => {
    const classes: string[] = [];
    
    // Handle different property types
    if (property === 'backgroundColor') {
      classes.push(`bg-[${value}]`);
    }
    else if (property === 'color') {
      classes.push(`text-[${value}]`);
    }
    else if (property === 'borderColor') {
      classes.push(`border-[${value}]`);
      // Ensure border base class exists
      classes.push('border');
    }
    else if (property === 'borderWidth') {
      if (value === '0px' || value === '0') {
        classes.push('border-0');
      } else {
        classes.push(`border-[${value}]`);
      }
      // Ensure border base class exists
      classes.push('border');
    }
    else if (property === 'borderStyle') {
      classes.push(`border-${value}`);
      // Ensure border base class exists
      classes.push('border');
    }
    else if (property === 'margin') {
      classes.push(`m-[${value}]`);
    }
    else if (property === 'padding') {
      classes.push(`p-[${value}]`);
    }
    
    return classes;
  };

  const mergeClassNames = (
    existingClassName: string, 
    property: string, 
    newClasses: string[]
  ): string => {
    let classes = existingClassName.split(' ');
    
    // Define which classes to remove based on the property being updated
    const patternsToRemove: RegExp[] = [];
    
    if (property === 'backgroundColor') {
      patternsToRemove.push(/^bg-/);
    }
    else if (property === 'color') {
      patternsToRemove.push(/^text-/);
    }
    else if (property === 'borderColor') {
      // Remove only border color classes, keep border width and style
      patternsToRemove.push(/^border-\[#/); // Matches border-[#hex]
      patternsToRemove.push(/^border-(?!\[)/); // But don't remove border-width or border-style
    }
    else if (property === 'borderWidth') {
      // Remove only border width classes
      patternsToRemove.push(/^border-\[[0-9]/); // Matches border-[1px], etc.
      patternsToRemove.push(/^border-0$/); // Matches border-0
    }
    else if (property === 'borderStyle') {
      // Remove only border style classes
      patternsToRemove.push(/^border-solid$/);
      patternsToRemove.push(/^border-dashed$/);
      patternsToRemove.push(/^border-dotted$/);
      patternsToRemove.push(/^border-double$/);
    }
    else if (property === 'margin') {
      patternsToRemove.push(/^m-/, /^mx-/, /^my-/, /^mt-/, /^mr-/, /^mb-/, /^ml-/);
    }
    else if (property === 'padding') {
      patternsToRemove.push(/^p-/, /^px-/, /^py-/, /^pt-/, /^pr-/, /^pb-/, /^pl-/);
    }
    
    // Remove conflicting classes
    if (patternsToRemove.length > 0) {
      classes = classes.filter(cls => 
        !patternsToRemove.some(pattern => pattern.test(cls))
      );
    }
    
    // Add new classes
    classes.push(...newClasses);
    
    // Remove duplicates and filter out empty strings
    return [...new Set(classes)]
      .filter(cls => cls && cls.trim() !== '')
      .join(' ')
      .trim();
  };

  sourceFile.forEachDescendant((node) => {
    if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
      const attributes = node.getAttributes();
      
      for (const attr of attributes) {
        if (Node.isJsxAttribute(attr)) {
          const attrText = attr.getText();
          const attrName = attrText.split('=')[0].trim();
          
          if (attrName === 'data-node-id') {
            const initializer = attr.getInitializer();
            if (initializer && Node.isStringLiteral(initializer)) {
              const nodeId = initializer.getLiteralText();
              
              if (nodeId === selected.nodeId) {
                modified = true;
                
                // Find className attribute
                const classNameAttr = attributes.find(a => 
                  Node.isJsxAttribute(a) && a.getText().startsWith('className')
                );

                const tailwindClasses = cssToTailwind(property, value);
                
                if (classNameAttr && Node.isJsxAttribute(classNameAttr)) {
                  const init = classNameAttr.getInitializer();
                  if (init && Node.isStringLiteral(init)) {
                    const newClassName = mergeClassNames(
                      init.getLiteralText(), 
                      property, 
                      tailwindClasses
                    );
                    init.setLiteralValue(newClassName);
                  }
                } else {
                  // Add new className attribute with all necessary classes
                  node.addAttribute({
                    name: 'className',
                    initializer: `"${tailwindClasses.join(' ')}"`,
                  });
                }
              }
            }
          }
        }
      }
    }
  });

  if (modified) {
    updatedFiles[targetFilePath] = sourceFile.getFullText();
  }

  console.log(updatedFiles);

  return updatedFiles;
};

export default updateCode;

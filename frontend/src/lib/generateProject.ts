import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadProject(files: Record<string, string>, projectName: string) {
  const zip = new JSZip();

  Object.entries(files).forEach(([path, content]) => {
    // remove leading slash so zip paths look clean
    const cleanPath = path.replace(/^\//, "");
    zip.file(cleanPath, content);
  });

  const blob = await zip.generateAsync({ type: "blob" });

  saveAs(blob, `${projectName}.zip`);
}
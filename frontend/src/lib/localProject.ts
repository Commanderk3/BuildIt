const dbName = "BuildIt_Repo";
const storeName = "projects";
const version = 3;

type Files = Record<string, string>;

interface StoredProject {
  projectId: string;
  files: Files;
  lastUpdated: number;
}

const useLocalProject = (
  importOrExport: "load" | "save",
  projectId: string,
  files?: Files,
): Promise<Files | null> => {
  return new Promise((resolve, reject) => {
    // Debug: Check if projectId exists at the start
    console.log('useLocalProject called with:', { importOrExport, projectId, filesExists: !!files });

    if (!projectId) {
      reject(new Error("projectId is required"));
      return;
    }

    const request = indexedDB.open(dbName, version);

    request.onerror = () => {
      console.error("You didn't allow BuildIt to use IndexedDB");
      reject(request.error);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "projectId" });
        console.log('Object store created');
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      console.log('Database opened successfully');

      if (importOrExport === "save") {
        // Save mode
        if (!files) {
          reject(new Error("Files are required for save operation"));
          db.close();
          return;
        }

        // Debug: Check values before transaction
        console.log('Attempting to save:', { projectId, filesKeys: Object.keys(files) });

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        // Direct save approach - simpler and more reliable
        console.log('Directly saving project with ID:', projectId);
        
        const projectToSave: StoredProject = {
          projectId: projectId, // Explicitly set the key
          files: files,
          lastUpdated: Date.now(),
        };

        // Debug: Log the exact object being saved
        console.log('Project object to save:', projectToSave);
        console.log('Does it have projectId?', !!projectToSave.projectId);

        const putRequest = store.put(projectToSave);

        putRequest.onsuccess = () => {
          console.log(`Project "${projectId}" saved successfully`);
          resolve(null);
          db.close();
        };

        putRequest.onerror = () => {
          console.error("Error saving project:", putRequest.error);
          console.error("Failed project object:", projectToSave);
          reject(putRequest.error);
          db.close();
        };

        transaction.oncomplete = () => {
          console.log('Transaction completed');
        };

        transaction.onerror = () => {
          console.error("Transaction error:", transaction.error);
          reject(transaction.error);
          db.close();
        };

      } else if (importOrExport === "load") {
        // Load mode - retrieve files
        console.log('Loading project with ID:', projectId);
        
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);

        const getRequest = store.get(projectId);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            console.log(`Project "${projectId}" loaded successfully:`, getRequest.result);
            resolve((getRequest.result as StoredProject).files);
          } else {
            console.log(`Project "${projectId}" not found`);
            resolve(null);
          }
          db.close();
        };

        getRequest.onerror = () => {
          console.error("Error loading project:", getRequest.error);
          reject(getRequest.error);
          db.close();
        };
      }
    };
  });
};

export default useLocalProject;
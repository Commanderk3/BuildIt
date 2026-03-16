const dbName = "BuildIt_Repo";
const storeName = "projects";
const version = 3;

type Files = Record<string, string>;

const useLocalProject = (
  importOrExport: "load" | "save",
  projectId: string,
  files?: Files,
): Promise<Files | null> => {

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = () => {
      console.error("You didn't allow BuildIt to use IndexedDB");
      reject(request.error);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "projectId" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      if (importOrExport === "save") {
        // Save mode
        if (!files) {
          reject(new Error("Files are required for save operation"));
          db.close();
          return;
        }

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        const saveRequest = store.put({
          projectId,
          files,
          lastUpdated: Date.now(),
        });

        saveRequest.onsuccess = () => {
          console.log(`Project "${projectId}" saved successfully`);
          resolve(null); // Save resolves with null
          db.close();
        };

        saveRequest.onerror = () => {
          console.error("Error saving project:", saveRequest.error);
          reject(saveRequest.error);
          db.close();
        };
      } else if (importOrExport === "load") {
        // Export mode - retrieve files
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);

        const getRequest = store.get(projectId);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            console.log(`Project "${projectId}" loaded successfully`);
            resolve(getRequest.result.files);
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

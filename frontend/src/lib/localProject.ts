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

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const allProjects = getAllRequest.result;
          const existingProject = allProjects.find(
            (p) => p.projectId === projectId,
          );

          if (existingProject) {
            const request = store.put({
              projectId,
              files,
              lastUpdated: Date.now(),
            });

            request.onsuccess = () => {
              console.log(`Project "${projectId}" updated successfully`);
              resolve(null);
              db.close();
            };

            return;
          }

          // If we already have 5 projects, remove the oldest
          if (allProjects.length >= 5) {
            allProjects.sort((a, b) => a.lastUpdated - b.lastUpdated);
            const deleteRequest = store.delete(allProjects[0].projectId);

            deleteRequest.onsuccess = () => {
              const request = store.put({
                projectId,
                files,
                lastUpdated: Date.now(),
              });

              request.onsuccess = () => {
                console.log(
                  `Project "${projectId}" saved successfully (oldest removed)`,
                );
                resolve(null);
                db.close();
              };
            };
          } else {
            // Less than 5 projects, just save
            const request = store.put({
              projectId,
              files,
              lastUpdated: Date.now(),
            });

            request.onsuccess = () => {
              console.log(`Project "${projectId}" saved successfully`);
              resolve(null);
              db.close();
            };
          }

          request.onerror = () => {
            console.error("Error saving project:", request.error);
            reject(request.error);
            db.close();
          };
        };

        getAllRequest.onerror = () => {
          console.error("Error getting projects:", getAllRequest.error);
          reject(getAllRequest.error);
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

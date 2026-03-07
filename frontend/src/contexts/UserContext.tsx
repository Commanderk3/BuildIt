import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Project = {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  mode: "planner" | "builder";
};

type UserContextType = {
  username: string | null;
  projects: Project[];
  setUser: (user: any) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const setUser = (user: any) => {
    setUsername(user.username);
    setProjects(user.projects || []);
  };

  const clearUser = () => {
    setUsername(null);
    setProjects([]);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        projects,
        setUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
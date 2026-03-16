/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Project = {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  mode: "planner" | "builder";
};

type User = {
  username: string;
  projects?: Project[];
};

type UserContextType = {
  username: string | null;
  projects: Project[];
  setUser: (user: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const setUser = (user: User) => {
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

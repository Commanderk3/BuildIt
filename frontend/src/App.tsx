import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import ProjectsPage from "./pages/Projects";
import WorkStation from "./pages/WorkStation";
import { Toaster } from "@/components/ui/sonner";

import { BuildProvider } from "./contexts/BuildContext";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider defaultTheme="light">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboard" element={<AuthPage />} />
          <Route
            path="/projects"
            element={
              <BuildProvider>
                <ProjectsPage />
              </BuildProvider>
            }
          />
          <Route
            path="/work"
            element={
              <BuildProvider>
                <WorkStation />
              </BuildProvider>
            }
          />
        </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

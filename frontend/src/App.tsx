import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/signup";
import HomePage from "./pages/Home";
import WorkStation from "./pages/WorkStation";

// contexts
import { BuildProvider } from "./contexts/BuildContext";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/work" 
          element={
            <BuildProvider>
              <WorkStation />
            </BuildProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

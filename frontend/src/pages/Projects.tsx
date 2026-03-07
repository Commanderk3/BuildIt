import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Plus, Menu, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Sidebar } from "@/components/Sidebar";

import { sendNewProjectQuery } from "@/api/postMessage";
import { getUserDetails } from "@/api/getUser";

import { useUser } from "../contexts/UserContext";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { username, setUser, clearUser } = useUser();

  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // navigated from /onboard
      if (username) {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        navigate("/onboard");
        return;
      }

      try {
        const user = await getUserDetails();
        setUser(user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        clearUser();
        navigate("/onboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser, clearUser, username]); // Added username to dependencies

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    try {
      await sendNewProjectQuery(prompt);
      // load llm response in chatbot
      navigate("/work");
    } catch (error: unknown) {
      console.error(error);
      localStorage.removeItem("token");
      clearUser();
      navigate("/onboard");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return null;
  }

  if (!username) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {isSidebarOpen && <Sidebar />}

      <div className="flex-1 flex flex-col relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background/90"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col items-center justify-center px-4 min-h-screen"
          >
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {`Ready to build, ${username}?`}
                  </h1>

                  <p className="text-muted-foreground text-lg">
                    Ask Builder to create a prototype
                  </p>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="relative">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to build..."
                      className="pr-20 py-6 text-lg pl-6 rounded-full border-2 focus-visible:ring-2 focus-visible:ring-primary"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="absolute right-1 top-1 rounded-full px-6"
                      disabled={!prompt.trim()}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create
                    </Button>
                  </div>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Try: "Create a landing page for my coffee shop" or "Build a
                    task management app"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Sidebar } from "@/components/Sidebar";
import { PromptBox } from "@/components/PromptBox";

import { sendNewProjectQuery } from "@/api/postMessage";
import { getUserDetails } from "@/api/getUser";

import { useUser } from "../contexts/UserContext";
import { useBuild } from "@/contexts/BuildContext";

type Message = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  createdAt: number;
};

export default function ProjectsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { username, setUser, clearUser } = useUser();
  const { loadProject, renderCode, updateTitle } = useBuild();
  const navigate = useNavigate();

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
        navigate("/onboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser, clearUser, username]); // Added username to dependencies

  const handleCreateProject = async (prompt: string) => {
    if (!prompt.trim()) return;

    try {
      const userMessage: Message[] = [
        {
          id: Date.now().toString(),
          sender: "user",
          content: prompt,
          createdAt: Date.now(),
        },
      ];

      const res = await sendNewProjectQuery(userMessage);

      const { project, llmResponse } = res;

      loadProject(project.projectId, false);

      if (llmResponse.to === "user") {
        const chatHistory: Message[] = [
          userMessage[0],
          {
            id: (Date.now() + 1).toString(),
            sender: "assistant",
            content: llmResponse.message,
            createdAt: Date.now(),
          },
        ];

        localStorage.setItem(
          `chat_${project.projectId}`,
          JSON.stringify(chatHistory),
        );

      } else if (llmResponse.to === "builder") {
        updateTitle(llmResponse.projectName, llmResponse.description);
        renderCode(llmResponse.message);
      }
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

                <PromptBox handleCreateProject={handleCreateProject} />

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

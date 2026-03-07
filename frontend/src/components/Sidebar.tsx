import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "../contexts/UserContext";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBuild } from "@/contexts/BuildContext";

export const Sidebar = () => {
  const { projects } = useUser();
  const navigate = useNavigate();
  const { loadProject } = useBuild();

  const handleLoadProject = (projectId: string) => {
    loadProject(projectId);
    navigate("/work")
  }

  return (
    <div className="w-80 border-r pr-5 bg-muted/10 flex flex-col">
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4">Projects</h2>
      </div>
      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="px-4 space-y-2 pb-4">
            {projects.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <Button
                  key={project._id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-accent/50 transition-colors"
                  onClick={() => handleLoadProject(project.projectId)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

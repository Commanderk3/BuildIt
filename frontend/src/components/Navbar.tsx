import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ModeToggle } from "./mode-toogle";

export function NavBar({ page }: { page: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    // Clear user session, tokens, etc.
    
    navigate("/onboard");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md supports-[backdrop-filter]:bg-transparent">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <div
          className="font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          BuildIt
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {page === "projects" ? (
            // Show only logout and theme on projects page
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-foreground/90 hover:text-foreground hover:bg-background/10"
            >
              Logout
            </Button>
          ) : (
            // Show all other buttons on non-projects pages
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/projects")}
                className="text-foreground/90 hover:text-foreground hover:bg-background/10"
              >
                My Projects
              </Button>

              <Button
                variant="ghost"
                onClick={() =>
                  window.open("https://github.com/Commanderk3/buildit", "_blank")
                }
                className="text-foreground/90 hover:text-foreground hover:bg-background/10"
              >
                <Github className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => navigate("/onboard")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

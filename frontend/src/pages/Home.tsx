import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";
import { NavBar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
    <NavBar page={"/"} />
      <div className="flex flex-col min-h-screen">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col items-center justify-center px-4 min-h-screen"
          >
            {/* Minimal Hero Section */}
            <section className="w-full">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                  {/* Main Headline */}
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
                    <span className="whitespace-nowrap text-foreground">
                      Website generation
                    </span>{" "}
                    <span className="text-5xl md:text-6xl lg:text-7xl text-muted-foreground font-light">
                      at your fingertips
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                    Create breathtaking websites with AI that understands your
                    vision. No coding just describe what you imagine and watch
                    it come to life.
                  </p>
                  {/* CTA Buttons - Minimal Style */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      size="lg"
                      className="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate("/projects")}
                    >
                      Try for free
                    </Button>
                  </div>

                  {/* Minimal Decorative Line */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <div className="w-px h-16 bg-linear-to-b from-primary/20 to-transparent" />
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </AuroraBackground>
      </div>
    </>
  );
}

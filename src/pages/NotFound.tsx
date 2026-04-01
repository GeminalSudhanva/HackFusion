import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center pt-16">
      <div className="text-center">
        <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-glow" />
        <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-muted-foreground mb-6">This page doesn't exist in the matrix.</p>
        <Link to="/"><Button variant="neon">Return Home</Button></Link>
      </div>
    </div>
  );
};

export default NotFound;

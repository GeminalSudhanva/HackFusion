import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Menu, X, Zap } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-wider text-primary">
            HACK FUSION
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/event" className="text-sm text-muted-foreground hover:text-primary transition-colors">Event</Link>
          <Link to="/accommodation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accommodation</Link>
          <Link to="/coordinators" className="text-sm text-muted-foreground hover:text-primary transition-colors">Coordinators</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Platform Developers</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Admin</Link>
              )}
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/teams" className="text-sm text-muted-foreground hover:text-primary transition-colors">Teams</Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="neon-outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="neon" size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-card border-t border-border/50 p-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Home</Link>
          <Link to="/event" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Event</Link>
          <Link to="/accommodation" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Accommodation</Link>
          <Link to="/coordinators" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Coordinators</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Platform Developers</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium text-primary hover:text-primary transition-colors">Admin Panel</Link>
              )}
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link>
              <Link to="/teams" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-primary">Teams</Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="neon-outline" size="sm" className="w-full">Login</Button></Link>
              <Link to="/signup" onClick={() => setOpen(false)}><Button variant="neon" size="sm" className="w-full">Register</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

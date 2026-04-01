import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, CheckCircle, AlertCircle, UserPlus } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [myTeam, setMyTeam] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    loadData();
  }, [user, authLoading]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    
    if (user.teamId) {
      try {
        const teamData = await API.getMyTeam();
        setMyTeam(teamData);
        
        const regData = await API.getMyRegistration();
        setRegistration(regData);
      } catch (err: any) {
        console.error(err);
      }
    }
    setLoading(false);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-primary animate-pulse-glow font-display text-xl">Loading...</div>
      </div>
    );
  }

  const isLeader = myTeam?.leaderId === (user?.id || (user as any)?._id);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold gradient-text">
          Dashboard
        </motion.h1>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground ml-2">{user?.name}</span></div>
            <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground ml-2">{user?.email}</span></div>
            <div><span className="text-muted-foreground">College:</span> <span className="text-foreground ml-2">{user?.college}</span></div>
            <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground ml-2">{user?.phone}</span></div>
          </div>
        </motion.div>

        {/* Team Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Team
          </h2>
          {myTeam ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-foreground font-medium">{myTeam.teamName}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${isLeader ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                  {isLeader ? "Leader" : "Member"}
                </span>
              </div>

              {isLeader && myTeam.teamCode ? (
                <div className="w-full p-5 rounded-xl border border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">Your Team Code</h3>
                    <div className="text-3xl font-extrabold tracking-[0.2em] text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-1">
                      {myTeam.teamCode}
                    </div>
                    <p className="text-xs text-muted-foreground">Share this code with your teammates to join your team</p>
                  </div>
                  <Button 
                    variant="neon" 
                    className="shrink-0 w-full sm:w-auto hover:scale-105 transition-transform"
                    onClick={() => {
                      navigator.clipboard.writeText(myTeam.teamCode);
                      toast({ title: "Team code copied successfully! 📋", duration: 3000 });
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              ) : isLeader && !myTeam.teamCode ? (
                <div className="text-sm text-red-400">Team not created yet</div>
              ) : null}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Members ({myTeam.members?.length || 1}/{myTeam.maxSize})</p>
                <div className="space-y-2">
                  {myTeam.members?.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                      <span className="text-foreground">{m.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              {isLeader && (
                <Link to="/teams">
                  <Button variant="neon-outline" size="sm">Manage Team</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <UserPlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You're not part of any team yet.</p>
              <Link to="/teams"><Button variant="neon">Create or Join Team</Button></Link>
            </div>
          )}
        </motion.div>

        {/* Registration Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            {registration ? <CheckCircle className="h-5 w-5 text-neon-green" /> : <AlertCircle className="h-5 w-5 text-muted-foreground" />}
            Registration
          </h2>
          {registration ? (
            <div className="text-sm space-y-2">
              <div><span className="text-muted-foreground">Domain:</span> <span className="text-primary ml-2 font-medium">{registration.domain}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <span className="text-neon-green ml-2 capitalize">{registration.status}</span></div>
            </div>
          ) : myTeam && isLeader ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Your team hasn't registered for the hackathon yet.</p>
              <Link to="/register"><Button variant="neon">Register for Hackathon</Button></Link>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {myTeam ? "Your team leader can register for the hackathon." : "Join a team first to register."}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

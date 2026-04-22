import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Hash, UserCheck, UserX, Trash2, Copy, Lock, Share2, Shield, AlertCircle } from "lucide-react";

export default function TeamsPage() {
  const { user, updateUserContext, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [myTeam, setMyTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

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
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  }

  async function createTeam() {
    if (!user || !teamName.trim()) return;
    setCreating(true);
    try {
      const response = await API.createTeam({ teamName: teamName.trim() });
      toast({ title: "Team created successfully!" });
      updateUserContext({ teamId: response.id, role: 'leader' });
      await loadData();
    } catch (error: any) {
      toast({ title: "Failed to create team", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  async function joinByCode() {
    if (!user || !joinCode.trim()) return;
    setJoining(true);
    try {
      const response = await API.joinTeamViaCode({ teamCode: joinCode.trim() });
      toast({ title: "Joined team!" });
      updateUserContext({ teamId: response.team.id, role: 'member' });
      await loadData();
    } catch (error: any) {
      toast({ title: "Failed to join", description: error.message, variant: "destructive" });
    } finally {
      setJoining(false);
    }
  }

  async function handleRequest(requestId: string, accept: boolean) {
    try {
      await API.respondToRequest({ requesterId: requestId, accept });
      toast({ title: accept ? "Request accepted" : "Request rejected" });
      await loadData();
    } catch (error: any) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    }
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
      <div className="container mx-auto max-w-3xl space-y-6">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold gradient-text">
          Team Management
        </motion.h1>

        {/* Getting Started Guide */}
        {!myTeam && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="glass-card overflow-hidden border-primary/20 relative"
          >
            <div className="bg-primary/5 p-4 border-b border-primary/10">
              <h2 className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-[0.2em]">
                <Shield className="w-4 h-4" /> Team Management Guide
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-white uppercase flex items-center gap-2 tracking-wider">
                    <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px] border border-primary/20">1</span>
                    For Team Leaders
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Click <strong className="text-white">"Create Team"</strong> to get your unique Team Code. Share this code with your teammates (max 4 members).
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-white uppercase flex items-center gap-2 tracking-wider">
                    <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px] border border-primary/20">2</span>
                    For Team Members
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    <strong className="text-white">Wait</strong> for your leader to share the code. Use <strong className="text-white">"Join with Code"</strong>. 
                    Do <span className="text-red-400 font-black underline underline-offset-4">NOT</span> create a new team if you are joining one!
                </p>
              </div>
            </div>
            <div className="bg-yellow-500/5 p-4 px-6 border-t border-yellow-500/10 flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-200/60 leading-tight italic">
                   Important: Creating multiple teams for the same group of people will cause registration conflicts. 
                   Each person must belong to exactly ONE team.
                </p>
            </div>
          </motion.div>
        )}

        {myTeam ? (
          <>
            {/* BIG CENTERED TEAM CODE (LEADER ONLY) */}
            {isLeader && myTeam.teamCode && (
              <div className="w-full flex justify-center mb-10">
                <div className="glass-card p-8 md:p-14 w-full text-center border border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.15)] relative overflow-hidden rounded-3xl">
                  {/* Decorative ambient background effects */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px]"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <h2 className="text-sm md:text-base font-bold text-primary mb-2 uppercase tracking-[0.25em] flex items-center justify-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                      <Lock className="w-4 h-4" /> Your Team Code
                    </h2>
                    
                    <div className="text-6xl md:text-8xl font-black tracking-widest text-foreground drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] my-8">
                      {myTeam.teamCode}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
                      <Button 
                        variant="neon" 
                        size="lg"
                        className="w-full hover:scale-105 transition-transform text-base px-8 py-6 rounded-xl font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                        onClick={() => {
                          navigator.clipboard.writeText(myTeam.teamCode);
                          toast({ title: "Team code copied! 📋", duration: 3000 });
                        }}
                      >
                        <Copy className="w-5 h-5 mr-2" /> Copy Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-base py-6 border-white/10"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: 'Join my Hackathon Team',
                              text: `Join my team "${myTeam.teamName}" on HackFusion with the code: ${myTeam.teamCode}`,
                            });
                          } else {
                            toast({ title: "Sharing unsupported. Please copy the code." });
                          }
                        }}
                      >
                        <Share2 className="w-5 h-5 mr-2 text-muted-foreground" /> Share
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-8 max-w-sm leading-relaxed">
                      Share this code with your teammates to allow them to securely join your team.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Info */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-display text-xl font-bold text-foreground">{myTeam.teamName}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isLeader ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                  {isLeader ? "Leader" : "Member"}
                </span>
              </div>
            </div>

            {/* Members */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Members ({myTeam.members?.length}/{myTeam.maxSize})</h3>
              <div className="space-y-2">
                {myTeam.members?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
                    <div>
                      <span className="text-foreground text-sm font-medium">{m.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground ml-2">{m.college}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                      {isLeader && m.id !== user?.id && (
                        <button disabled className="text-destructive opacity-50 cursor-not-allowed">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests (Leader Only) */}
            {isLeader && myTeam.joinRequests?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Join Requests</h3>
                <div className="space-y-2">
                  {myTeam.joinRequests.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
                      <span className="text-foreground text-sm">{r.name || "Unknown"}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleRequest(r.id, true)} className="text-neon-green hover:opacity-80">
                          <UserCheck className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleRequest(r.id, false)} className="text-destructive hover:opacity-80">
                          <UserX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Team */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Create Team
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Team Name</Label>
                  <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name" className="bg-secondary border-border" />
                </div>
                <Button variant="neon" className="w-full" onClick={createTeam} disabled={creating || !teamName.trim()}>
                  {creating ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </div>

            {/* Join Team */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" /> Join with Code
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Team Code</Label>
                  <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter team code" className="bg-secondary border-border" />
                </div>
                <Button variant="neon" className="w-full" onClick={joinByCode} disabled={joining || !joinCode.trim()}>
                  {joining ? "Joining..." : "Join Team"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, CheckCircle, AlertCircle, UserPlus, Dice5, QrCode, Utensils, MessageCircle, Package, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [myTeam, setMyTeam] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [displayDice, setDisplayDice] = useState(1);
  const [activeQR, setActiveQR] = useState<"team" | "kit" | "food" | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    loadData();
  }, [user, authLoading]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    
    try {
      const teamData = await API.getMyTeam();
      setMyTeam(teamData);
      
      const regData = await API.getMyRegistration();
      setRegistration(regData);
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleRollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Animation effect
    const interval = setInterval(() => {
      setDisplayDice(Math.floor(Math.random() * 15) + 1);
    }, 100);

    try {
      const res = await API.rollDice();
      clearInterval(interval);
      setDisplayDice(res.problemStatement);
      setTimeout(() => {
        setIsRolling(false);
        setMyTeam({ ...myTeam, problemStatement: res.problemStatement });
        toast({ title: "Dice Rolled!", description: `Assigned Problem Statement: ${res.problemStatement}` });
      }, 1000);
    } catch (error: any) {
      clearInterval(interval);
      setIsRolling(false);
      toast({ title: "Roll Failed", description: error.message, variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-primary animate-pulse-glow font-display text-xl">Loading...</div>
      </div>
    );
  }

  const isLeader = myTeam?.leaderId === (user?.id || (user as any)?._id);
  const userId = user?.id || (user as any)?._id;
  const foodScanLink = `${window.location.origin}/admin/scan?userId=${userId}&type=food`;
  const kitScanLink = `${window.location.origin}/admin/scan?userId=${userId}&type=kit`;
  const teamScanLink = `${window.location.origin}/admin/scan?teamId=${myTeam?.id}&type=team`;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold gradient-text">
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="text-white ml-2">{user?.name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="text-white ml-2">{user?.email}</span></div>
                <div><span className="text-muted-foreground">College:</span> <span className="text-white ml-2">{user?.college}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="text-white ml-2">{user?.phone}</span></div>
              </div>
            </motion.div>

            {/* Team Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Team Details
                </h2>
                {myTeam && (
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${isLeader ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary text-secondary-foreground"}`}>
                    {isLeader ? "Team Leader" : "Team Member"}
                  </span>
                )}
              </div>
              
              {myTeam ? (
                <div className="space-y-6">
                  <div className="p-4 bg-secondary/30 rounded-xl border border-white/5">
                    <h3 className="text-xs text-muted-foreground uppercase mb-1">Team Name</h3>
                    <p className="text-xl font-bold text-white">{myTeam.teamName}</p>
                  </div>

                  {isLeader && myTeam.teamCode && (
                    <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                         <QrCode className="w-12 h-12" />
                      </div>
                      <h3 className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Invite Code</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-black tracking-widest text-white">{myTeam.teamCode}</div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={() => {
                            navigator.clipboard.writeText(myTeam.teamCode);
                            toast({ title: "Copied to clipboard!" });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-3">Members ({myTeam.members?.length || 1}/{myTeam.maxSize || 4})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {myTeam.members?.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${m.role === 'leader' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                             <span className="text-sm font-medium text-white">{m.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">You are not part of any team yet.</p>
                  <Link to="/teams"><Button variant="neon" size="lg">Create or Join Team</Button></Link>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Registration Status */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 overflow-hidden relative">
              <h2 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${registration ? "text-green-500" : "text-muted-foreground"}`} />
                Registration
              </h2>
              
              {registration ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase">Domain</p>
                      <p className="text-xs font-bold text-primary truncate">{registration.domain}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                      <p className="text-xs font-bold text-green-500 capitalize">{registration.status}</p>
                    </div>
                  </div>

                  {/* 3 QR Buttons */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-muted-foreground uppercase text-center mb-2">QR Codes</p>
                    
                    <button
                      onClick={() => setActiveQR(activeQR === "team" ? null : "team")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        activeQR === "team" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQR === "team" ? "bg-primary/20" : "bg-white/10"}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">Team QR</p>
                        <p className="text-[10px] text-muted-foreground">Team registration QR</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveQR(activeQR === "kit" ? null : "kit")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        activeQR === "kit" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQR === "kit" ? "bg-orange-500/20" : "bg-white/10"}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">Kit QR</p>
                        <p className="text-[10px] text-muted-foreground">Scan to receive your kit</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveQR(activeQR === "food" ? null : "food")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        activeQR === "food" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQR === "food" ? "bg-green-500/20" : "bg-white/10"}`}>
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">Food QR</p>
                        <p className="text-[10px] text-muted-foreground">Meal service (3 meals)</p>
                      </div>
                    </button>
                  </div>

                  {/* QR Display Area */}
                  <AnimatePresence mode="wait">
                    {activeQR && (
                      <motion.div
                        key={activeQR}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-white/10 text-center space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-white flex items-center gap-2">
                              {activeQR === "team" && <><Users className="w-4 h-4 text-primary" /> Team QR</>}
                              {activeQR === "kit" && <><Package className="w-4 h-4 text-orange-400" /> Kit QR</>}
                              {activeQR === "food" && <><Utensils className="w-4 h-4 text-green-400" /> Food QR</>}
                            </p>
                            <button onClick={() => setActiveQR(null)} className="text-muted-foreground hover:text-white transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div 
                            className="bg-white p-4 rounded-2xl inline-block shadow-2xl shadow-primary/20 relative"
                            style={{ colorScheme: "light" }}
                          >
                             <QRCodeSVG 
                               value={
                                 activeQR === "team" ? teamScanLink :
                                 activeQR === "kit" ? kitScanLink :
                                 foodScanLink
                               }
                               size={160} 
                               level="H" 
                               includeMargin 
                               fgColor="#000000" 
                               bgColor="#FFFFFF"
                             />
                             <div className="absolute inset-x-0 bottom-[-10px] flex justify-center">
                                <span className={`text-background text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                                  activeQR === "team" ? "bg-primary" :
                                  activeQR === "kit" ? "bg-orange-500" :
                                  "bg-green-500"
                                }`}>
                                  {activeQR === "team" ? "Team" : activeQR === "kit" ? "Kit" : "Food"}
                                </span>
                             </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground pt-2">
                            {activeQR === "team" && "Show this to admin for team verification."}
                            {activeQR === "kit" && "Show this to receive your hackathon kit."}
                            {activeQR === "food" && "Show this to the food counter staff (Limit: 3 meals/user)."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : myTeam && isLeader ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">Complete your registration to unlock the QR codes and Dice roll.</p>
                  <Link to="/register" className="w-full">
                    <Button variant="neon" className="w-full">Register Team</Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-muted/20 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground italic">
                    {myTeam ? "Waiting for leader to register..." : "Join a team first."}
                  </p>
                </div>
              )}
            </motion.div>

            {/* WhatsApp Group Link - visible to ALL team members after registration */}
            {registration && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6 relative overflow-hidden border border-green-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
                <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-400" /> WhatsApp Group
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the official HackFusion 2.0 WhatsApp group for live updates, announcements, and coordination.
                </p>
                <a
                  href="https://chat.whatsapp.com/EkDNcRUWaUC3JoFxVlnldF?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Group
                </a>
              </motion.div>
            )}

            {/* Problem Statement Dice Roll */}
            {registration && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 bg-gradient-to-br from-background via-background to-primary/10">
                <h2 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Dice5 className="h-5 w-5 text-primary" /> Problem Statement
                </h2>

                {myTeam?.problemStatement ? (
                  <div className="text-center space-y-4">
                     <div className="text-6xl font-black text-white glow-text animate-bounce-subtle">
                        #{myTeam.problemStatement}
                     </div>
                     <p className="text-sm text-muted-foreground">This is your assigned problem statement number for the hackathon.</p>
                  </div>
                ) : isLeader ? (
                  <div className="text-center space-y-6">
                     <div className={`text-6xl font-black text-white/20 transition-all ${isRolling ? 'animate-pulse scale-110 text-primary' : ''}`}>
                        {String(displayDice).padStart(2, '0')}
                     </div>
                     <Button 
                       variant="neon" 
                       className="w-full h-14 text-lg group" 
                       onClick={handleRollDice}
                       disabled={isRolling}
                     >
                       <Dice5 className={`mr-2 h-6 w-6 ${isRolling ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
                       {isRolling ? "Rolling..." : "Roll the Dice!"}
                     </Button>
                     <p className="text-[10px] text-muted-foreground">You can only roll once. The result will be final.</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Dice5 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Your team leader needs to roll the dice.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

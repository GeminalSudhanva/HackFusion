import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, CheckCircle, AlertCircle, UserPlus, Dice5, QrCode, Utensils, MessageCircle, Package, X, ClipboardCheck, Clock, ShieldCheck, ChevronRight, Plus, Hash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

export default function DashboardPage() {
  const { user, loading: authLoading, updateUserContext } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [myTeam, setMyTeam] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [displayDice, setDisplayDice] = useState(1);
  const [activeQR, setActiveQR] = useState<"team" | "kit" | "food" | null>(null);
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

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

  const handleCreateTeam = async () => {
    if (!user || !teamName.trim()) return;
    setCreating(true);
    try {
      const response = await API.createTeam({ teamName: teamName.trim() });
      toast({ title: "Team created successfully!" });
      updateUserContext({ teamId: response.id, role: 'leader' });
      setIsCreateDialogOpen(false);
      setTeamName("");
      await loadData();
    } catch (error: any) {
      toast({ title: "Failed to create team", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user || !joinCode.trim()) return;
    setJoining(true);
    try {
      const response = await API.joinTeamViaCode({ teamCode: joinCode.trim() });
      toast({ title: "Joined team!" });
      updateUserContext({ teamId: response.team.id, role: 'member' });
      setIsJoinDialogOpen(false);
      setJoinCode("");
      await loadData();
    } catch (error: any) {
      toast({ title: "Failed to join", description: error.message, variant: "destructive" });
    } finally {
      setJoining(false);
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

        {/* Registration Closed Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden p-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-500 mb-1">Registrations are now CLOSED</h3>
              <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                Thank you for the overwhelming response! HackFusion 2.0 registrations for both <strong className="text-white">AI/ML</strong> and <strong className="text-white">Full Stack</strong> domains have reached maximum capacity. 
                If you have already registered and paid, please wait for verification.
              </p>
            </div>
          </div>
        </motion.div>


        {/* Registration Workflow Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden relative border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ClipboardCheck className="w-32 h-32" />
          </div>

          <div className="p-6">
            <h2 className="font-display text-sm font-bold text-primary mb-6 uppercase tracking-widest flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" /> Registration Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  id: 1,
                  label: "Form Team",
                  icon: Users,
                  desc: "Create or join a team",
                  status: myTeam ? 'completed' : 'current'
                },
                {
                  id: 2,
                  label: "Register",
                  icon: UserPlus,
                  desc: "Select domain & pay",
                  status: registration ? 'completed' : (myTeam ? 'current' : 'pending')
                },
                {
                  id: 3,
                  label: "Verification",
                  icon: Clock,
                  desc: "Verification is done on the date of hackathon",
                  status: registration?.paymentStatus === 'verified' ? 'completed' : (registration ? 'current' : 'pending')
                },
                {
                  id: 4,
                  label: "Ready!",
                  icon: ShieldCheck,
                  desc: "Hackathon enabled",
                  status: registration?.paymentStatus === 'verified' ? 'completed' : 'pending'
                }
              ].map((step, i, arr) => (
                <div key={step.id} className="relative group">
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${step.status === 'completed' ? "bg-primary/10 border-primary/30" :
                    step.status === 'current' ? "bg-secondary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]" :
                      "bg-white/5 border-white/5 opacity-50"
                    }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.status === 'completed' ? "bg-primary text-black" :
                        step.status === 'current' ? "bg-primary/20 text-primary" :
                          "bg-white/10 text-muted-foreground"
                        }`}>
                        {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-tight ${step.status === 'pending' ? 'text-muted-foreground' : 'text-white'}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-tight ${step.status === 'pending' ? 'text-muted-foreground' : 'text-gray-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className={`w-4 h-4 ${step.status === 'completed' ? 'text-primary' : 'text-white/10'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            {!registration && (
              <div className="mt-6 space-y-4">
                {!myTeam ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Create Team Dialog */}
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="neon" className="flex-1 py-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/10 group">
                          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> 
                          Create Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10 backdrop-blur-xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-display font-bold">Create a New Team</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-xs">
                            As the creator, you will be the Team Leader.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input 
                              id="teamName" 
                              value={teamName} 
                              onChange={(e) => setTeamName(e.target.value)} 
                              placeholder="Enter a cool team name" 
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <Button 
                            variant="neon" 
                            className="w-full" 
                            onClick={handleCreateTeam} 
                            disabled={creating || !teamName.trim()}
                          >
                            {creating ? "Creating..." : "Create Team"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Join Team Dialog */}
                    <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 py-6 rounded-xl border-white/10 hover:bg-white/5 group">
                          <Hash className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                          Join with Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10 backdrop-blur-xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-display font-bold">Join an Existing Team</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-xs">
                            Enter the unique team code shared by your leader.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="joinCode">Team Code</Label>
                            <Input 
                              id="joinCode" 
                              value={joinCode} 
                              onChange={(e) => setJoinCode(e.target.value)} 
                              placeholder="e.g. HF-123456" 
                              className="bg-white/5 border-white/10 uppercase tracking-widest"
                            />
                          </div>
                          <Button 
                            variant="neon" 
                            className="w-full" 
                            onClick={handleJoinTeam} 
                            disabled={joining || !joinCode.trim()}
                          >
                            {joining ? "Joining..." : "Join Team"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (isLeader && !registration) && (
                  <Link to="/register">
                    <Button variant="neon" className="w-full py-6 rounded-xl shadow-lg shadow-primary/20">
                      <ClipboardCheck className="w-5 h-5 mr-2" /> Complete Registration Now
                    </Button>
                  </Link>
                )}

                {/* Status Message */}
                <div className="flex items-center gap-3 p-3 px-4 bg-primary/5 rounded-xl border border-primary/20">
                  <AlertCircle className="w-4 h-4 text-primary animate-pulse" />
                  <p className="text-[11px] text-primary/80 font-medium leading-tight">
                    {!myTeam ? "Start by joining or creating a team to participate in the hackathon." :
                      isLeader ? "Awesome! Now complete the registration to lock in your spot." :
                        "Team joined! Waiting for your team leader to complete the registration."}
                  </p>
                </div>

                {!myTeam && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-yellow-200/70 leading-relaxed">
                      <strong className="text-yellow-500 block mb-0.5">Pro Tip: Avoid Duplicate Teams!</strong>
                      Only one person (the Leader) should <strong>"Create"</strong> a team. All other members must <strong>"Join"</strong> using the code. 
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>

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
                      <p className={`text-xs font-bold capitalize ${registration.paymentStatus === 'verified' ? "text-green-500" : "text-yellow-500 animate-pulse"
                        }`}>
                        {registration.paymentStatus === 'verified' ? "Payment Verified" : "Pending Verification"}
                      </p>
                    </div>
                  </div>

                  {/* 3 QR Buttons */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-xs text-muted-foreground uppercase text-center mb-2">QR Codes</p>

                    <button
                      onClick={() => setActiveQR(activeQR === "team" ? null : "team")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${activeQR === "team" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQR === "team" ? "bg-primary/20" : "bg-white/10"}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">Team QR</p>
                        <p className="text-[10px] text-muted-foreground">Team registration & Kit distribution</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveQR(activeQR === "food" ? null : "food")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${activeQR === "food" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeQR === "food" ? "bg-green-500/20" : "bg-white/10"}`}>
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">Food QR</p>
                        <p className="text-[10px] text-muted-foreground">Meal service (4 meals)</p>
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
                                  foodScanLink
                              }
                              size={160}
                              level="H"
                              includeMargin
                              fgColor="#000000"
                              bgColor="#FFFFFF"
                            />
                            <div className="absolute inset-x-0 bottom-[-10px] flex justify-center">
                              <span className={`text-background text-[10px] font-black px-3 py-1 rounded-full uppercase ${activeQR === "team" ? "bg-primary" :
                                "bg-green-500"
                                }`}>
                                {activeQR === "team" ? "Team" : "Food"}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground pt-2">
                            {activeQR === "team" && "Show this to admin for team verification & kits."}
                            {activeQR === "food" && "Show this for meal service (Limit: 4 meals/user)."}
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

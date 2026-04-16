import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Utensils, ArrowLeft, Package, Coffee, Sun, Moon, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_OPTIONS = [
  { type: "May 5 Lunch", icon: Sun, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20" },
  { type: "May 5 Dinner", icon: Moon, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" },
  { type: "May 6 Breakfast", icon: Coffee, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20" },
  { type: "May 6 Lunch", icon: Sun, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20" },
];

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const teamId = searchParams.get("teamId");
  const scanType = searchParams.get("type") || "food"; // "food", "kit", or "team"
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState<"selecting" | "loading" | "success" | "error" | "team">(
    scanType === "kit" ? "loading" : 
    scanType === "team" ? "loading" :
    "selecting"
  );
  const [selectedMeal, setSelectedMeal] = useState("");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!userId && !teamId) {
      setStatus("error");
      setMessage("No ID found in QR code");
      return;
    }

    if (scanType === "team" && teamId) {
      processTeamScan();
    } else if (scanType === "kit" && userId) {
      processKitScan();
    } else if (scanType === "food" && userId) {
       processUserScanInit();
    } else if (scanType === "food" && !userId) {
       setStatus("error");
       setMessage("Individual User ID required for food scans");
    }
  }, [userId, teamId, scanType]);

  async function processTeamScan() {
    setStatus("loading");
    try {
      const res = await API.adminGetTeamScanDetails(teamId!);
      setTeamData(res);
      setStatus("team");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to fetch team details");
    }
  }

  async function processUserScanInit() {
    setStatus("loading");
    try {
      const res = await API.adminGetUserScanDetails(userId!);
      setUserData(res);
      setStatus("selecting");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to fetch user details");
    }
  }

  async function toggleMemberKit(uid: string) {
    try {
      const res = await API.adminToggleKit(uid);
      setTeamData((prev: any) => ({
        ...prev,
        members: prev.members.map((m: any) => 
          m.id === uid ? { ...m, kitReceived: res.kitReceived } : m
        )
      }));
      toast({ title: "Status Updated", description: res.message });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  }

  async function processFoodScan(mealType: string) {
    setStatus("loading");
    try {
      const res = await API.adminScanFood(userId!, mealType);
      setStatus("success");
      setMessage(`${mealType} — ${res.message}`);
      setDetails(res);
      toast({ title: `${mealType} Logged ✅`, description: res.message });
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to process scan");
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
    }
  }

  async function processKitScan() {
    setStatus("loading");
    try {
      const res = await API.adminToggleKit(userId!);
      setStatus("success");
      setMessage(res.message);
      setDetails({ kitReceived: res.kitReceived });
      toast({ title: res.kitReceived ? "Kit Received ✅" : "Kit Unmarked", description: res.message });
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to process kit scan");
      toast({ title: "Kit Scan Failed", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
           key={status}
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           className={`glass-card ${status === 'team' ? 'max-w-xl' : 'max-w-md'} w-full p-8 text-center space-y-6 relative overflow-hidden`}
        >
          {/* TEAM SCAN VIEW */}
          {status === "team" && teamData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                 <div className="text-left">
                    <h1 className="text-2xl font-black text-white leading-tight">{teamData.teamName}</h1>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{teamData.registration?.domain || "General"} Category</p>
                 </div>
                 <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                    <Users className="w-6 h-6 text-primary" />
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left flex items-center justify-between">
                   <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Leader</p>
                      <p className="text-white font-bold">{teamData.leader.name}</p>
                   </div>
                   <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold text-left px-1">Mark Kit Distribution</p>
                  {teamData.members.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-white/5">
                      <div className="text-left">
                         <p className="text-sm font-bold text-white">{m.name}</p>
                         <p className="text-[10px] text-muted-foreground">Food: {m.mealsTaken?.length || 0}/3</p>
                      </div>
                      <Button
                        size="sm"
                        variant={m.kitReceived === true ? "default" : "outline"}
                        className={m.kitReceived === true ? "bg-green-500/20 text-green-400 border-green-500/40 hover:bg-red-500/20 hover:text-red-400" : ""}
                        onClick={() => toggleMemberKit(m.id)}
                      >
                         {m.kitReceived === true ? <><Package className="w-3 h-3 mr-1" /> Received</> : "Mark Kit"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MEAL TYPE SELECTION (Food scans only) */}
          {status === "selecting" && userData && (
            <div className="py-4 space-y-6">
              <div className="relative inline-block">
                <Utensils className="w-16 h-16 text-primary mx-auto" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white">Select Meal Type</h1>
                <p className="text-muted-foreground text-sm">Choose the meal for <span className="text-white font-bold">{userData.name}</span></p>
              </div>
              <div className="space-y-3">
                {MEAL_OPTIONS.filter(m => !userData.mealsTaken.includes(m.type)).length > 0 ? (
                  MEAL_OPTIONS.filter(m => !userData.mealsTaken.includes(m.type)).map((meal) => (
                    <button
                      key={meal.type}
                      onClick={() => {
                        setSelectedMeal(meal.type);
                        processFoodScan(meal.type);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${meal.bg}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meal.bg}`}>
                        <meal.icon className={`w-6 h-6 ${meal.color}`} />
                      </div>
                      <span className="text-white font-bold text-lg">{meal.type}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl">
                    <p className="text-destructive font-bold">All meals (4/4) have been consumed.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOADING */}
          {status === "loading" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">
                Processing {scanType === "team" ? "Team Info" : scanType === "kit" ? "Kit" : "Food"}...
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div className="py-8 space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                {scanType === "kit" ? (
                  <Package className="w-24 h-24 text-green-500 relative z-10 mx-auto" />
                ) : (
                  <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10 mx-auto" />
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white">SUCCESS</h1>
                {scanType === "food" && details?.teamName && (
                  <p className="text-green-400 font-bold text-lg">{details.teamName}</p>
                )}
                <p className="text-white/70">{message}</p>
              </div>
              
              {scanType === "food" && (
                <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-xs text-muted-foreground uppercase">Remaining</p>
                      <p className="text-2xl font-black text-white">{4 - (details?.totalScans || 0)}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-xs text-muted-foreground uppercase">Used</p>
                      <p className="text-2xl font-black text-white">{details?.totalScans}/4</p>
                   </div>
                </div>
              )}

              {scanType === "kit" && (
                <div className="pt-6 border-t border-white/10">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                    <p className="text-xs text-muted-foreground uppercase">Kit Status</p>
                    <p className="text-xl font-black text-green-400">
                      {details?.kitReceived ? "✅ Received" : "❌ Not Received"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div className="py-8 space-y-6">
              <XCircle className="w-24 h-24 text-destructive mx-auto" />
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Access Denied</h1>
                <p className="text-destructive/80 font-medium">{message}</p>
              </div>
              {details?.currentScans === 4 && (
                <p className="text-sm text-muted-foreground bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                  This user has already consumed all 4 allocated meals.
                </p>
              )}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
             <Button variant="outline" className="w-full h-12" onClick={() => navigate('/admin')}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
             </Button>
             {status === "error" && (
               <Button variant="neon" className="w-full h-12" onClick={() => window.location.reload()}>
                  Retry Scan
               </Button>
             )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

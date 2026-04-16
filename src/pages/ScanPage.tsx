import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Utensils, ArrowLeft, Package, Coffee, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const MEAL_OPTIONS = [
  { type: "Breakfast", icon: Coffee, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20" },
  { type: "Lunch", icon: Sun, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20" },
  { type: "Dinner", icon: Moon, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" },
];

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const scanType = searchParams.get("type") || "food"; // "food" or "kit"
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState<"selecting" | "loading" | "success" | "error">(
    scanType === "kit" ? "loading" : "selecting"
  );
  const [selectedMeal, setSelectedMeal] = useState("");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      setStatus("error");
      setMessage("No User ID found in QR code");
      return;
    }
    // For kit scans, process immediately
    if (scanType === "kit") {
      processKitScan();
    }
  }, [userId, scanType]);

  async function processFoodScan() {
    setStatus("loading");
    try {
      const res = await API.adminScanFood(userId!);
      setStatus("success");
      setMessage(`${selectedMeal} — ${res.message}`);
      setDetails(res);
      toast({ title: `${selectedMeal} Logged ✅`, description: res.message });
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
           className="glass-card max-w-md w-full p-8 text-center space-y-6 relative overflow-hidden"
        >
          {/* MEAL TYPE SELECTION (Food scans only) */}
          {status === "selecting" && (
            <div className="py-4 space-y-6">
              <div className="relative inline-block">
                <Utensils className="w-16 h-16 text-primary mx-auto" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white">Select Meal Type</h1>
                <p className="text-muted-foreground text-sm">Choose the meal being served right now</p>
              </div>
              <div className="space-y-3">
                {MEAL_OPTIONS.map((meal) => (
                  <button
                    key={meal.type}
                    onClick={() => {
                      setSelectedMeal(meal.type);
                      processFoodScan();
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${meal.bg}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meal.bg}`}>
                      <meal.icon className={`w-6 h-6 ${meal.color}`} />
                    </div>
                    <span className="text-white font-bold text-lg">{meal.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOADING */}
          {status === "loading" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">
                {scanType === "kit" ? "Processing Kit QR..." : "Processing Food QR..."}
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
                      <p className="text-2xl font-black text-white">{3 - (details?.totalScans || 0)}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-xs text-muted-foreground uppercase">Used</p>
                      <p className="text-2xl font-black text-white">{details?.totalScans}/3</p>
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
              {details?.currentScans === 3 && (
                <p className="text-sm text-muted-foreground bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                  This user has already consumed all 3 allocated meals.
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

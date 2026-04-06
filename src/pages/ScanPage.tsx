import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Utensils, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!teamId) {
      setStatus("error");
      setMessage("No Team ID found in QR code");
      return;
    }
    processScan();
  }, [teamId]);

  async function processScan() {
    try {
      const res = await API.adminScanFood(teamId!);
      setStatus("success");
      setMessage(res.message);
      setDetails(res);
      toast({ title: "Scan Successful", description: res.message });
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to process scan");
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
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
          {status === "loading" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Processing Food QR...</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10 mx-auto" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white">SUCCESS</h1>
                <p className="text-green-400 font-bold text-lg">{details?.teamName}</p>
                <p className="text-white/70">{message}</p>
              </div>
              
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
            </div>
          )}

          {status === "error" && (
            <div className="py-8 space-y-6">
              <XCircle className="w-24 h-24 text-destructive mx-auto" />
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Access Denied</h1>
                <p className="text-destructive/80 font-medium">{message}</p>
              </div>
              {details?.currentScans === 4 && (
                <p className="text-sm text-muted-foreground bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                  This team has already consumed all 4 allocated meals.
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

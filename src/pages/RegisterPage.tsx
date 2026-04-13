import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Brain, Globe, Layers, Link2, Cpu, CreditCard, CheckCircle2, QrCode, ArrowRight } from "lucide-react";

const DOMAINS = [
  { value: "AI/ML", label: "AI / ML", icon: Brain },
  { value: "Full Stack Development", label: "Full Stack Development", icon: Layers },
] as const;

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDomain, setSelectedDomain] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    checkTeam();
  }, [user, authLoading]);

  async function checkTeam() {
    if (!user) return;
    
    if (!user.teamId) {
      toast({ title: "Join a team first", variant: "destructive" });
      navigate("/teams");
      return;
    }
    
    if (user.role !== 'leader') {
      toast({ title: "Only team leaders can register", variant: "destructive" });
      navigate("/dashboard");
      return;
    }

    try {
      const regData = await API.getMyRegistration();
      if (regData) {
        toast({ title: "Already registered!" });
        navigate("/dashboard");
        return;
      }
    } catch (e) {
       // Proceed (Not registered yet)
    }

    setLoading(false);
  }

  async function handleRegister() {
    if (!selectedDomain || !utrNumber) return;
    setSubmitting(true);
    try {
      await API.registerTeam({ domain: selectedDomain, utrNumber });
      toast({ title: "Payment received. Your registration is under verification.", });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-primary animate-pulse-glow font-display text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold gradient-text mb-8 text-center">
          Hackathon Registration
        </motion.h1>

        {/* STEP 1: SELECT DOMAIN */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-6 mb-8 transition-all duration-300 ${step !== 1 ? 'opacity-50 grayscale scale-[0.98]' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <Label className="text-foreground font-display text-lg flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">1</span>
              Select Your Domain
            </Label>
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-muted-foreground hover:text-white">
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAINS.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setSelectedDomain(d.value);
                  setStep(2);
                }}
                disabled={step > 1 && selectedDomain !== d.value}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  selectedDomain === d.value
                    ? "border-primary bg-primary/10 neon-glow"
                    : "border-border bg-secondary/30 hover:border-primary/50"
                }`}
              >
                <d.icon className={`h-6 w-6 ${selectedDomain === d.value ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${selectedDomain === d.value ? "text-primary" : "text-foreground"}`}>{d.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* STEP 2: PAYMENT & UTR */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 20 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }} 
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-0 overflow-hidden relative"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-neon-purple"></div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">2</span>
                  <Label className="text-foreground font-display text-lg mb-0 block">Hackathon Registration Fee</Label>
                </div>

                <div className="flex flex-col items-center justify-center text-center p-6 bg-secondary/20 rounded-2xl border border-secondary">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Total Amount due</span>
                  <div className="text-5xl font-extrabold text-foreground tracking-tight mb-2 flex items-start justify-center">
                    <span className="text-2xl mt-1 mr-1 text-primary">₹</span>600
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    Scan the QR code and complete payment, then enter your UTR number below
                  </p>
                </div>

                <div className="flex justify-center my-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-75 opacity-70"></div>
                  <div className="relative p-2 bg-white rounded-xl shadow-2xl">
                    {/* Display QR Image */}
                    <img 
                      src="/QR Code.jpeg" 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=dummy@upi&pn=HackFusion&am=600.00&cu=INR';
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="utr" className="text-sm font-medium">Enter UTR Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="utr"
                      type="text" 
                      placeholder="e.g. 301234567890" 
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="bg-secondary/30 border-secondary focus:border-primary text-base py-6"
                    />
                  </div>
                  
                  <Button 
                    variant="neon" 
                    className="w-full text-base py-6 relative overflow-hidden group" 
                    onClick={handleRegister} 
                    disabled={!utrNumber || utrNumber.length < 5 || submitting}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {submitting ? (
                        "Processing Payment..."
                      ) : (
                        <>
                          Submit Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    {/* Hover glare effect */}
                    <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-glare"></div>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    By submitting, you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

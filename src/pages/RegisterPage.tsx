import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { API } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Brain, Layers, ArrowRight, Check, CreditCard, Sparkles } from "lucide-react";

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20 pointer-events-none"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.15, 0.5, 0.15] }}
      transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    />
  );
}

const DOMAINS = [
  { value: "AI/ML", label: "AI / ML", icon: Brain, desc: "Build intelligent systems with ML, NLP & Computer Vision", gradient: "from-cyan-500/15 to-blue-500/5", border: "border-cyan-500/30", accent: "text-cyan-400", closed: true },
  { value: "Full Stack Development", label: "Full Stack Development", icon: Layers, desc: "Design & ship end-to-end web applications", gradient: "from-purple-500/15 to-pink-500/5", border: "border-purple-500/30", accent: "text-purple-400", closed: true },
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
  const [focused, setFocused] = useState(false);

  const particles = useRef(
    Array.from({ length: 12 }, () => ({
      width: Math.random() * 5 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  ).current;

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
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary font-display text-xl flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
          />
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0014] via-background to-[#0a0018] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      {particles.map((p, i) => (
        <Particle key={i} style={{ width: p.width, height: p.width, top: p.top, left: p.left, opacity: p.opacity }} />
      ))}

      <div className="relative z-10 container mx-auto max-w-2xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Final Step</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Hackathon Registration</span>
          </h1>
          <p className="text-gray-400 text-sm">Select your domain and complete payment to register your team</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step >= 1 ? "bg-primary/10 border border-primary/30 text-primary" : "bg-white/5 border border-white/10 text-gray-500"}`}>
            {step > 1 ? <Check className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">1</span>}
            Domain
          </div>
          <div className="w-8 h-px bg-gradient-to-r from-primary/30 to-white/10" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step >= 2 ? "bg-primary/10 border border-primary/30 text-primary" : "bg-white/5 border border-white/10 text-gray-500"}`}>
            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">{step > 2 ? <Check className="w-3 h-3" /> : "2"}</span>
            Payment
          </div>
        </motion.div>

        {/* STEP 1: SELECT DOMAIN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-3xl overflow-hidden mb-8 transition-all duration-500 ${step !== 1 ? 'opacity-40 scale-[0.98] pointer-events-none' : ''}`}
        >
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500" />
            <div className="p-6 md:p-8 bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_60px_-20px_rgba(0,255,255,0.08)]">

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border border-primary/30">1</span>
                  <Label className="text-white font-display text-lg mb-0 block">Select Your Domain</Label>
                </div>
                {step > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-primary/60 hover:text-primary text-xs">
                    Change
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOMAINS.map((d) => (
                  <motion.button
                    key={d.value}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    onClick={() => {
                      if ((d as any).closed) {
                        toast({ title: "Registration Closed", description: "This domain has reached its maximum capacity.", variant: "destructive" });
                        return;
                      }
                      setSelectedDomain(d.value);
                      setStep(2);
                    }}
                    disabled={(step > 1 && selectedDomain !== d.value) || ((d as any).closed && selectedDomain !== d.value)}
                    className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border transition-all text-left overflow-hidden group ${selectedDomain === d.value
                        ? `bg-gradient-to-br ${d.gradient} ${d.border} shadow-[0_0_30px_-10px_rgba(0,255,255,0.3)]`
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${selectedDomain === d.value ? `${d.border} bg-white/10` : "border-white/10 bg-white/5"
                      } group-hover:scale-110 transition-transform`}>
                      <d.icon className={`h-6 w-6 ${selectedDomain === d.value ? d.accent : "text-gray-400 group-hover:text-white"} transition-colors`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold block ${selectedDomain === d.value ? "text-white" : "text-gray-200"}`}>{d.label}</span>
                        {(d as any).closed && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-md font-bold border border-red-500/20">FULL</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 leading-relaxed">
                        {(d as any).closed ? "Registrations for this domain are now closed." : d.desc}
                      </span>
                    </div>
                    {selectedDomain === d.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* STEP 2: PAYMENT & UTR */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-3xl overflow-hidden relative"
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500" />

                <div className="p-6 md:p-8 bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_60px_-20px_rgba(0,255,255,0.08)] space-y-6">

                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border border-primary/30">2</span>
                    <Label className="text-white font-display text-lg mb-0 block">Hackathon Registration Fee</Label>
                  </div>

                  {/* Amount Display */}
                  <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10">
                    <span className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3 font-semibold">Total Amount Due</span>
                    <div className="text-5xl font-extrabold text-white tracking-tight mb-1 flex items-start justify-center">
                      <span className="text-2xl mt-1 mr-1 text-primary font-display">₹</span>
                      <span className="font-display">800</span>
                    </div>
                    <p className="text-xs text-gray-400 max-w-xs mt-3 leading-relaxed">
                      Scan the QR code below and complete payment, then enter your UTR number
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center my-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-40 bg-primary/15 blur-2xl rounded-full" />
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="relative p-3 bg-white rounded-2xl shadow-[0_0_40px_-10px_rgba(0,255,255,0.2)]"
                    >
                      <img
                        src="/Payment Recieve QR.jpeg"
                        alt="Payment QR Code"
                        className="w-48 h-48 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=dummy@upi&pn=HackFusion&am=800.00&cu=INR';
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* UTR Input */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <Label htmlFor="utr" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-primary/60" />
                        Enter UTR Number <span className="text-red-500">*</span>
                      </Label>
                      <div className={`relative rounded-xl transition-all duration-300 ${focused ? "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)]" : ""}`}>
                        <Input
                          id="utr"
                          type="text"
                          placeholder="e.g. 301234567890"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          className="bg-white/5 border-white/10 focus:border-primary/50 h-13 rounded-xl pl-4 text-base placeholder:text-gray-500 transition-all py-6"
                        />
                      </div>
                    </div>

                    <Button
                      variant="neon"
                      className="w-full h-13 text-base rounded-xl py-6 relative overflow-hidden group shadow-[0_0_30px_-8px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(0,255,255,0.5)] transition-shadow"
                      onClick={handleRegister}
                      disabled={!utrNumber || utrNumber.length < 5 || submitting}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                            />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            Submit Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[glare_0.6s_ease-out]" />
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-2">
                      By submitting, you agree to our terms and conditions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

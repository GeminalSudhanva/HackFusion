import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API } from "@/lib/api";
import { Zap, Mail, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const particles = useRef(
    Array.from({ length: 14 }, () => ({
      width: Math.random() * 5 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  ).current;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.forgotPassword(email);
      setSent(true);
      toast({ title: "Reset link sent", description: "If an account exists, you will receive a reset link." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0014] via-background to-[#0a0018] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      {particles.map((p, i) => (
        <Particle key={i} style={{ width: p.width, height: p.width, top: p.top, left: p.left, opacity: p.opacity }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Top gradient accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500" />

          <div className="p-8 md:p-10 bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_-20px_rgba(0,255,255,0.1)]">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.15)]"
              >
                <Zap className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl font-black mb-2"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Reset Password</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-400"
              >
                {sent ? "Check your email for reset instructions" : "Enter your email to receive a reset link"}
              </motion.p>
            </div>

            {/* Form */}
            {!sent ? (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary/60" />
                    Email
                  </Label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focused === "email" ? "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)]" : ""}`}>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      className="bg-white/5 border-white/10 focus:border-primary/50 h-12 rounded-xl pl-4 text-sm placeholder:text-gray-500 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="neon"
                  className="w-full h-12 text-base rounded-xl group relative overflow-hidden shadow-[0_0_30px_-8px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(0,255,255,0.5)] transition-shadow"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[glare_0.6s_ease-out]" />
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We've sent a password reset link to <span className="text-primary font-medium">{email}</span>. Please check your inbox and follow the instructions.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5"
                >
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Zap, User, Building2, Mail, Phone, Lock, ShieldCheck, ArrowRight, LogIn } from "lucide-react";
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

const fields = [
  { key: "fullName", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
  { key: "collegeName", label: "College Name", icon: Building2, type: "text", placeholder: "AGM Rural College of Eng. & Tech." },
  { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
  { key: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "9876543210" },
  { key: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••" },
  { key: "confirmPassword", label: "Confirm Password", icon: ShieldCheck, type: "password", placeholder: "••••••••" },
] as const;

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", collegeName: "", email: "", phone: "", password: "", confirmPassword: "" });
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
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast({ title: "Phone number must be exactly 10 digits", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      college: form.collegeName,
      password: form.password
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now login!" });
      navigate("/login");
    }
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // For phone field, strip non-digits and limit to 10
    if (key === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-24">
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
        className="relative z-10 w-full max-w-lg"
      >
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Top gradient accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500" />

          <div className="p-8 md:p-10 bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_-20px_rgba(0,255,255,0.1)]">
            {/* Header */}
            <div className="text-center mb-8">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Join HackFusion 2.0</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-400"
              >
                Create your account to register for the hackathon
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="space-y-4"
            >
              {/* Two-column for name & college on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.slice(0, 2).map((f, i) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor={f.key} className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                      <f.icon className="w-3.5 h-3.5 text-primary/60" />
                      {f.label}
                    </Label>
                    <div className={`relative rounded-xl transition-all duration-300 ${focused === f.key ? "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)]" : ""}`}>
                      <Input
                        id={f.key}
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={update(f.key)}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                        className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl pl-4 text-sm placeholder:text-gray-500 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Email & Phone in two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.slice(2, 4).map((f, i) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.62 + i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor={f.key} className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                      <f.icon className="w-3.5 h-3.5 text-primary/60" />
                      {f.label}
                    </Label>
                    <div className={`relative rounded-xl transition-all duration-300 ${focused === f.key ? "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)]" : ""}`}>
                      <Input
                        id={f.key}
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={update(f.key)}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                        className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl pl-4 text-sm placeholder:text-gray-500 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Password fields in two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.slice(4, 6).map((f, i) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.74 + i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor={f.key} className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                      <f.icon className="w-3.5 h-3.5 text-primary/60" />
                      {f.label}
                    </Label>
                    <div className={`relative rounded-xl transition-all duration-300 ${focused === f.key ? "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)]" : ""}`}>
                      <Input
                        id={f.key}
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={update(f.key)}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                        className="bg-white/5 border-white/10 focus:border-primary/50 h-11 rounded-xl pl-4 text-sm placeholder:text-gray-500 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Password hint */}
              <p className="text-xs text-gray-500 flex items-center gap-1.5 pl-1">
                <Lock className="w-3 h-3" />
                Minimum 6 characters required
              </p>

              <Button
                type="submit"
                variant="neon"
                className="w-full h-12 text-base rounded-xl group relative overflow-hidden shadow-[0_0_30px_-8px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(0,255,255,0.5)] transition-shadow mt-2"
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[glare_0.6s_ease-out]" />
              </Button>
            </motion.form>

            {/* Footer link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 pt-6 border-t border-white/5"
            >
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
                >
                  Login <LogIn className="w-3.5 h-3.5" />
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

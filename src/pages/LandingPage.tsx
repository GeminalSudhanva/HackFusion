import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Brain, Globe, Layers, Link2, Cpu,
  Trophy, MapPin, CheckCircle, Crosshair,
  UserPlus, Navigation, ShieldCheck, Zap, Users,
  Clock, ListOrdered
} from "lucide-react";

const HACKATHON_DATE = new Date("2026-04-21T09:00:00");

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

const domains = [
  { icon: Brain, label: "AI / ML", desc: "Build intelligent machine learning models and predictive AI systems." },
  { icon: Layers, label: "Full Stack Development", desc: "End-to-end robust application development linking front to back." },
];

const rules = [
  "Maximum of 4 participants per registered team.",
  "Only officially registered users on the HackFusion platform can participate.",
  "The Team Leader is strictly responsible for managing the official domain registration.",
  "All code must be originally written during the designated 24-hour hacking frame.",
];

const steps = [
  { id: 1, title: "Register Individually", desc: "Create an account on our platform specifying your native college details.", icon: UserPlus },
  { id: 2, title: "Form Your Squad", desc: "Create a new team via the dashboard or join an existing one using an invite code.", icon: Users },
  { id: 3, title: "Link Up", desc: "Use the uniquely generated 6-character secret code to securely bind members into teams.", icon: Link2 },
  { id: 4, title: "Leader Registration", desc: "The designated team leader then officially submits the team into one of the 5 hackathon domains.", icon: ShieldCheck },
];

// Reusable standard viewport animation mapping
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

export default function LandingPage() {
  const { user } = useAuth();
  const countdown = useCountdown(HACKATHON_DATE);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-24">
        {/* Background Layering */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={heroBg} alt="Cyber Background" className="w-full h-full object-cover opacity-20 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center mt-12 md:mt-0">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

            {/* Headers */}
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-6 animate-pulse-glow">
              <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold">
                National Level Technical Fest 2K26
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black mb-3 tracking-tight text-white drop-shadow-2xl">
              AGRATA 2K26
            </h1>

            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 glow-text text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              HackFusion 2.0
            </h2>

            <p className="font-display text-xl md:text-2xl text-white/90 mb-4 font-medium tracking-wide">
              A 24-Hour Non-Stop Hackathon
            </p>

            <div className="max-w-3xl mx-auto p-4 mb-10 glass-card border-primary/20 bg-background/40 backdrop-blur-xl">
              <p className="text-base md:text-xl font-bold text-foreground">
                AGM Rural College of Engineering and Technology
              </p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Varur, Hubli
              </p>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-primary font-bold uppercase tracking-widest">21st & 22nd April 2026</span>
              </div>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-3 md:gap-5 mb-14"
          >
            {[
              { val: countdown.days, label: "Days" },
              { val: countdown.hours, label: "Hours" },
              { val: countdown.minutes, label: "Minutes" },
              { val: countdown.seconds, label: "Seconds" },
            ].map((item) => (
              <div key={item.label} className="glass-card shadow-lg shadow-primary/10 border-primary/20 bg-background/60 p-4 md:p-6 min-w-[75px] md:min-w-[100px] text-center hover:-translate-y-2 transition-transform duration-300">
                <span className="font-display text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                  {String(item.val).padStart(2, "0")}
                </span>
                <p className="text-[10px] md:text-xs text-primary mt-2 uppercase tracking-[0.2em] font-bold">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-5 mx-auto justify-center max-w-lg">
            {user ? (
              <Link to="/dashboard" className="w-full">
                <Button variant="neon" size="lg" className="w-full text-lg h-14 group">
                  Enter Dashboard <Navigation className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full">
                  <Button variant="neon" size="lg" className="w-full text-lg h-14 shadow-[0_0_30px_-5px_var(--primary)] group">
                    Register Now <Zap className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="neon-outline" size="lg" className="w-full text-lg h-14 bg-background/50 hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. PRIZE POOL OUTLIER */}
      <section className="relative z-20 -mt-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="glass-card shadow-2xl p-8 md:p-12 rounded-3xl border-primary/40 bg-gradient-to-br from-background via-background to-primary/10 text-center relative overflow-hidden"
          >
            {/* Decorative Background Blur */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-green/30 blur-[80px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/30 blur-[80px] rounded-full" />

            <Trophy className="h-12 w-12 mx-auto text-yellow-400 mb-4 animate-pulse-glow" />
            <h3 className="text-xl md:text-2xl font-bold text-muted-foreground uppercase tracking-widest mb-2 font-display">
              Total Prize Pool
            </h3>
            <p className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              ₹75,000
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. DOMAINS SECTION */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Hackathon Domains
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 max-w-5xl mx-auto">
            {domains.map((d, i) => (
              <motion.div key={d.label} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px" }} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card p-10 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/50 group flex flex-col items-center text-center shadow-xl hover:shadow-[0_0_50px_-15px_rgba(56,189,248,0.4)] w-full sm:w-[calc(50%-1rem)] max-w-[420px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <d.icon className="h-8 w-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3 leading-snug">{d.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RULES & HOW TO PLAY - DUAL COLUMN ROW */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-secondary/10 skew-y-[-2deg] transform-origin-top border-y border-border/50" />

        <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-start max-w-7xl">

          {/* Rules */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="flex flex-col h-full">
            <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
              <Crosshair className="text-primary w-8 h-8" /> Rules & Regulations
            </h2>
            <div className="glass-card p-8 rounded-3xl border-border bg-background/50 h-full">
              <ul className="space-y-6">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                      <CheckCircle className="w-5 h-5" />
                    </span>
                    <span className="text-white/80 font-medium leading-relaxed mt-1">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* How To Reg */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="flex flex-col h-full">
            <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
              <ListOrdered className="text-primary w-8 h-8" /> How to Participate
            </h2>
            <div className="glass-card p-8 rounded-3xl border border-primary/30 bg-primary/5 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-8 relative z-10">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex gap-5 relative group">
                    {/* Connecting Line */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-[1.15rem] top-12 bottom-[-2rem] w-[2px] bg-border group-hover:bg-primary/50 transition-colors" />
                    )}

                    <div className="shrink-0 mt-1 relative">
                      <div className="w-10 h-10 rounded-xl bg-background border border-primary/40 flex items-center justify-center group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_15px_-3px_var(--primary)] transition-all duration-300">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-lg text-white mb-1">{step.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>



      {/* 6. VENUE Map Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              The Venue
            </h2>
            <p className="text-xl md:text-2xl font-medium text-white/90 mb-2">AGM Rural College of Engineering and Technology</p>
            <p className="text-lg text-primary uppercase tracking-widest font-bold">Varur, Hubli</p>
          </motion.div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 border-t border-primary/20 backdrop-blur-sm" />
        <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/20 rounded-[100%] blur-[100px]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-display text-4xl md:text-6xl font-black mb-8 text-white drop-shadow-md">
              Ready to Build?
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
              <Link to="/signup" className="flex-1 min-w-[200px]">
                <Button variant="neon" size="lg" className="w-full text-lg h-16 rounded-xl hover:scale-[1.02] transition-transform">
                  Register Individually
                </Button>
              </Link>
              <Link to="/teams" className="flex-1 min-w-[200px]">
                <Button variant="outline" size="lg" className="w-full text-lg h-16 rounded-xl border-primary bg-background/50 hover:bg-primary/10 hover:border-primary hover:neon-glow transition-all">
                  Create / Join Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Micro Footer */}
      <footer className="py-6 border-t border-border/40 bg-background text-center relative z-20 flex flex-col items-center gap-2">
        <p className="text-white/40 text-sm font-medium tracking-wide">
          © 2026 AGRATA 2K26 — HackFusion 2.0. All rights reserved.
        </p>
        <Link to="/about" className="text-white/30 hover:text-primary text-xs transition-colors">
          Platform Developers
        </Link>
      </footer>

    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Zap, Navigation, Clock } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HACKATHON_DATE = new Date("2026-05-05T09:00:00");

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

// Animated particle
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/30 pointer-events-none"
      style={style}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    />
  );
}

export function HeroSection({ onRegisterClick }: { onRegisterClick?: () => void }) {
  const { user } = useAuth();
  const countdown = useCountdown(HACKATHON_DATE);

  // Generate stable particles
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      width: Math.random() * 6 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  ).current;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-24">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={heroBg} alt="Hero Background" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0014]/90 via-[#0a0014]/60 to-[#0a0014]" />
        {/* Ambient orbs */}
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] bg-primary/8 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-20" />
        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{ width: p.width, height: p.width, top: p.top, left: p.left, opacity: p.opacity }} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center mt-12 md:mt-0">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-semibold">
              National Level Technical Fest — AGRATA 2K26
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-9xl font-black mb-2 tracking-tight leading-none">
            <span className="text-white drop-shadow-2xl">HACK</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 drop-shadow-[0_0_40px_rgba(0,255,255,0.3)]">
              {" "}FUSION
            </span>
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-white/60 tracking-[0.3em] uppercase">
            2.0
          </h2>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto p-5 mb-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <p className="text-base md:text-lg font-bold text-white">
              AGM Rural College of Engineering &amp; Technology
            </p>
            <p className="text-sm md:text-base text-gray-400 mt-1">Varur, Hubli, Karnataka</p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-primary font-bold uppercase tracking-widest text-sm">5th &amp; 6th May 2026</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center gap-3 md:gap-6 mb-12"
        >
          {[
            { val: countdown.days, label: "Days" },
            { val: countdown.hours, label: "Hours" },
            { val: countdown.minutes, label: "Mins" },
            { val: countdown.seconds, label: "Secs" },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex flex-col items-center justify-center p-4 md:p-6 min-w-[72px] md:min-w-[100px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.05)] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-display text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                {String(item.val).padStart(2, "0")}
              </span>
              <p className="text-[10px] md:text-xs text-primary mt-1.5 uppercase tracking-[0.2em] font-bold">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mx-auto justify-center max-w-md"
        >
          {user ? (
            <Link to="/dashboard" className="w-full">
              <Button variant="neon" size="lg" className="w-full text-lg h-14 group shadow-[0_0_30px_-5px_rgba(0,255,255,0.5)]">
                Enter Dashboard <Navigation className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup" className="w-full">
                <Button variant="neon" size="lg" className="w-full text-lg h-14 group shadow-[0_0_30px_-5px_rgba(0,255,255,0.5)]">
                  Register Now <Zap className="ml-2 w-5 h-5 group-hover:scale-125 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="neon-outline" size="lg" className="w-full text-lg h-14 bg-white/5 hover:bg-primary/10 backdrop-blur-md">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

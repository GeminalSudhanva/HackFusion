import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Brain, Layers, Trophy, Zap, Users, Clock, Code2,
  Cpu, Shield, Github, Globe, Sparkles, MapPin,
  ChevronRight, Lightbulb, Rocket, Star, Award
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: "easeOut" }
  }),
};

// ────────────────────────────────────────
// HIGHLIGHT STRIP
// ────────────────────────────────────────
const highlights = [
  { icon: Clock, text: "24-Hour Hackathon" },
  { icon: Trophy, text: "₹75,000 Prize Pool" },
  { icon: Users, text: "Max 4 Per Team" },
  { icon: Cpu, text: "AI/ML & Full Stack" },
  { icon: Sparkles, text: "5–6 May 2026" },
  { icon: Shield, text: "Secure Platform" },
];

export function HighlightStrip() {
  return (
    <div className="relative overflow-hidden py-5 border-y border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="flex gap-12 items-center animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...highlights, ...highlights].map((h, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <h.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-white/70 tracking-wide uppercase">{h.text}</span>
            <span className="text-primary/40 text-xl font-thin">|</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────
// ABOUT
// ────────────────────────────────────────
export function About() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">About The Event</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
              What is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                HackFusion 2.0?
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              HackFusion 2.0 is a premier national-level 24-hour hackathon hosted under{" "}
              <span className="text-white font-semibold">AGRATA 2K26</span> at AGM Rural College of Engineering and Technology, Varur (Hubli).
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              This is your platform to innovate, collaborate, and solve real-world problems. Code through the night, showcase your talent, and compete with the brightest minds across the nation.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300">24 Hours Non-Stop</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300">Varur, Hubli</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300">National Level</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lightbulb, label: "Innovate", desc: "Build solutions that matter", color: "from-yellow-500/20 to-orange-500/10", border: "border-yellow-500/20", icon_c: "text-yellow-400" },
                { icon: Code2, label: "Code", desc: "24 hours of pure creation", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20", icon_c: "text-blue-400" },
                { icon: Users, label: "Collaborate", desc: "Up to 4 members per team", color: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20", icon_c: "text-green-400" },
                { icon: Trophy, label: "Win", desc: "₹75,000 in prizes", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/20", icon_c: "text-purple-400" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm`}
                >
                  <item.icon className={`w-7 h-7 ${item.icon_c} mb-3`} />
                  <p className="font-display text-base font-bold text-white mb-1">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// PAST HIGHLIGHTS (SLIDESHOW)
// ────────────────────────────────────────
const pastImages = [
  { url: "/image 1.jpeg", title: "Innovation in Action", desc: "Winners" },
  { url: "/image 2.jpeg", title: "Collaborative Spirit", desc: "Winners" },
  { url: "/image 3.jpeg", title: "Mentorship & Growth", desc: "Hackathon Glimpse" },
  { url: "/image 4.jpeg", title: "The Final Pitch", desc: "Formal Function" },
];

export function PastHighlights() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % pastImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Previous Edition</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Past Edition <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Highlights</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Relive the energy, innovation, and excitement of our previous hackathons.</p>
        </motion.div>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img
                src={pastImages[index].url}
                alt={pastImages[index].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
                >
                  {pastImages[index].title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 text-sm md:text-base max-w-2xl"
                >
                  {pastImages[index].desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="absolute bottom-6 right-8 z-30 flex gap-2">
            {pastImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// DOMAINS
// ────────────────────────────────────────
const domains = [
  {
    icon: Brain,
    label: "AI / ML",
    desc: "Build intelligent systems — predictive models, NLP pipelines, computer vision, and neural networks that solve real-world challenges.",
    tags: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
    gradient: "from-cyan-500/10 to-blue-500/5",
    border: "border-cyan-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]",
    accent: "text-cyan-400",
    badge_bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
  },
  {
    icon: Layers,
    label: "Full Stack Development",
    desc: "Design and ship end-to-end web applications — from interactive frontends to scalable backends and robust database architectures.",
    tags: ["React / Next.js", "Node.js", "REST APIs", "Databases"],
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "border-purple-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(168,85,247,0.4)]",
    accent: "text-purple-400",
    badge_bg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
  },
];

export function Domains() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Challenge Tracks</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Domains</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Choose your battleground. Two powerful tracks, infinite possibilities.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domains.map((d, i) => (
            <motion.div
              key={d.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${d.gradient} border ${d.border} ${d.glow} backdrop-blur-sm overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className={`w-16 h-16 rounded-2xl bg-white/5 border ${d.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <d.icon className={`w-8 h-8 ${d.accent}`} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">{d.label}</h3>
              <p className="text-gray-400 leading-relaxed mb-6">{d.desc}</p>
              <div className="flex flex-wrap gap-2">
                {d.tags.map(tag => (
                  <span key={tag} className={`text-xs px-3 py-1 rounded-full border ${d.badge_bg} font-medium`}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// PRIZE SECTION
// ────────────────────────────────────────


// ────────────────────────────────────────
// TIMELINE
// ────────────────────────────────────────
const timelineEvents = [
  { time: "Day 1 — 5 May", event: "Arrival & Check-in", desc: "Participants arrive, settle in, and complete registration formalities.", icon: "🚀" },
  { time: "Day 1 — 5 May, 9:00 AM", event: "Opening Ceremony", desc: "Inauguration, problem statement reveal, and team briefing.", icon: "🎯" },
  { time: "5 May, 10:00 AM", event: "Hacking Begins!", desc: "The 24-hour coding sprint officially kicks off.", icon: "💻" },
  { time: "5 May, 1:00 PM", event: "Lunch Break", desc: "Fuel up and keep building. Food served on-site.", icon: "🍽️" },
  { time: "6 May, 12:00 AM", event: "Midnight Madness", desc: "Special midnight activities and surprise challenges.", icon: "🌙" },
  { time: "6 May, 9:00 AM", event: "Submission Deadline", desc: "All projects must be submitted via GitHub by this time.", icon: "📊" },
  { time: "6 May, 10:00 AM", event: "Presentations", desc: "Teams demo their projects to the evaluation panel.", icon: "🎤" },
  { time: "6 May, 3:00 PM", event: "Closing & Awards", desc: "Prize distribution, certificates, and closing ceremony.", icon: "🏆" },
];

export function Timeline() {
  return (
    <section className="py-24 relative">
      <div className="absolute left-1/2 -translate-x-1/2 w-[1px] top-32 bottom-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Schedule</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Timeline</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {timelineEvents.map((item, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i % 4}
              className={`flex items-start gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                <div className={`inline-block p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors hover:bg-white/8 ${i % 2 === 0 ? "lg:ml-auto" : ""}`} style={{ maxWidth: "380px" }}>
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">{item.time}</p>
                  <h4 className="font-display text-lg font-bold text-white mb-1">{item.event}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-full bg-black border-2 border-primary/40 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,255,255,0.1)] z-10">
                {item.icon}
              </div>
              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// WHY JOIN
// ────────────────────────────────────────
const reasons = [
  { icon: Rocket, title: "Launch Your Career", desc: "Get noticed by industry mentors and potential employers.", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { icon: Globe, title: "National Exposure", desc: "Compete alongside talented teams from colleges across India.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Code2, title: "Build Real Projects", desc: "Walk away with a fully functional project for your portfolio.", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { icon: Star, title: "Win Big", desc: "₹75,000 prize pool and recognitions await top performers.", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { icon: Users, title: "Network & Grow", desc: "Connect with like-minded innovators, mentors, and sponsors.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: Github, title: "Open Source Spirit", desc: "Submit on GitHub and contribute to the open-source community.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
];

export function WhyJoin() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/3 via-transparent to-purple-500/3 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Why Participate</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Join HackFusion?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`p-6 rounded-2xl border ${r.bg} backdrop-blur-sm group`}
            >
              <div className={`w-12 h-12 rounded-xl ${r.bg} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <r.icon className={`w-6 h-6 ${r.color}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{r.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// COLLEGE PREVIEW
// ────────────────────────────────────────
export function CollegePreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Venue</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Venue</span>
          </h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <img
              src="/Agm college image.jpeg"
              alt="AGM Rural College Campus"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                AGM Rural College of Engineering &amp; Technology
              </h3>
              <p className="text-primary font-semibold uppercase tracking-widest text-sm">Varur, Hubli, Karnataka</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// FINAL CTA
// ────────────────────────────────────────
export function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Ready to Hack?</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
            Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              Incredible.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            24 hours. Your team. Unlimited potential. Register now before slots fill up!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="neon" size="lg" className="h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(0,255,255,0.6)] hover:scale-[1.03] transition-transform">
                Register Now <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/teams">
              <Button variant="neon-outline" size="lg" className="h-14 px-10 text-lg bg-white/5 hover:bg-primary/10 backdrop-blur-md">
                Join a Team
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-white/30 text-sm">© 2026 AGRATA 2K26 — HackFusion 2.0. All rights reserved.</p>
        <div className="flex flex-col items-center gap-1 mt-2">
          <Link to="/about" className="text-white/20 hover:text-primary text-[10px] transition-colors">
            Platform Developers
          </Link>
          <a 
            href="https://geminal-studios.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/10 hover:text-white/30 text-[9px] transition-colors"
          >
            created the website in association with <span className="underline decoration-white/5">Geminal Studios</span>
          </a>
        </div>
      </footer>
    </section>
  );
}

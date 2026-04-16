import { motion } from "framer-motion";
import {
  MapPin, Clock, Trophy, Github, Wallet, AlertTriangle,
  Code2, Zap, Moon, CheckCircle2, Info, Star, Users,
  ChevronRight, Globe, Sparkles
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: "easeOut" }
  }),
};

const GlowDivider = () => (
  <div className="w-full h-px relative my-20 flex justify-center items-center">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-[2px]" />
  </div>
);

// ────────────────────────────────────────
// COLLEGE INFO
// ────────────────────────────────────────
export function CollegeInfo() {
  return (
    <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">The Venue</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight text-white">
            AGM Rural College of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Engineering &amp; Technology</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Nestled in Varur, Hubli — one of Karnataka's fastest-growing engineering hubs — our college provides the perfect environment for innovation and collaboration.
          </p>
          <div className="space-y-3">
            {[
              { icon: MapPin, text: "Varur, Hubli, Karnataka — 580025", color: "text-blue-400" },
              { icon: Globe, text: "National Level — Open to All Indian Colleges", color: "text-green-400" },
              { icon: Clock, text: "5th &amp; 6th May 2026", color: "text-purple-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
                <span className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <img
              src="/Agm college image.jpeg"
              alt="AGM Rural College Campus"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// EVENT OVERVIEW
// ────────────────────────────────────────
export function EventOverview() {
  const items = [
    { icon: Clock, title: "Duration", value: "24 Hours", sub: "Non-stop hacking", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: Users, title: "Team Size", value: "2–4 Members", sub: "Max 4 participants", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { icon: Trophy, title: "Prize Pool", value: "₹75,000", sub: "Win big", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { icon: Code2, title: "Domains", value: "2 Tracks", sub: "AI/ML & Full Stack", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  ];

  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Quick Facts</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white">
          Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Overview</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            whileHover={{ y: -6, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className={`p-6 rounded-2xl border ${item.bg} backdrop-blur-sm text-center`}
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} border flex items-center justify-center mx-auto mb-4`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.title}</p>
            <p className={`font-display text-xl font-black ${item.color} mb-0.5`}>{item.value}</p>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// FEES AND PRIZES
// ────────────────────────────────────────
export function FeesAndPrizes() {
  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <GlowDivider />
      <div className="max-w-xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Registration Fee</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm font-medium">Per Team</span>
                <span className="font-display text-2xl font-black text-primary">₹600</span>
              </div>
              <p className="text-sm text-gray-400">Payment via UPI/QR. Submit UTR number on the registration page after payment is complete.</p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">Registration is valid only after payment verification by the organizers.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// ROADMAP
// ────────────────────────────────────────
const roadmap = [
  { time: "5 May", event: "Arrival & Check-in", desc: "Settle in, complete check-in, and meet your team.", emoji: "🚀" },
  { time: "5 May, 9 AM", event: "Opening Ceremony", desc: "Inauguration and problem statement reveal.", emoji: "🎯" },
  { time: "5 May, 10 AM", event: "Hacking Starts!", desc: "24-hour sprint begins — build, break, and iterate!", emoji: "💻" },
  { time: "6 May, 12 AM", event: "Midnight Madness", desc: "Surprise activity and team energy boost.", emoji: "🌙" },
  { time: "6 May, 9 AM", event: "Submission Deadline", desc: "GitHub repo locked. All submissions closed.", emoji: "⏰" },
  { time: "6 May, 10 AM", event: "Project Demos", desc: "Present your solution to judges.", emoji: "🎤" },
  { time: "6 May, 3 PM", event: "Closing Ceremony", desc: "Certificates distribution and closing ceremony.", emoji: "🏆" },
];

export function Roadmap() {
  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <GlowDivider />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Schedule</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white">
          Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Roadmap</span>
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="space-y-6 pl-16">
          {roadmap.map((item, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i % 4}
              className="relative"
            >
              <div className="absolute -left-[2.6rem] top-4 w-8 h-8 rounded-full bg-black border-2 border-primary/40 flex items-center justify-center text-base z-10">
                {item.emoji}
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors hover:bg-white/8">
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">{item.time}</p>
                <h4 className="font-display text-lg font-bold text-white mb-1">{item.event}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// MIDNIGHT EXPERIENCE
// ────────────────────────────────────────
export function MidnightExperience() {
  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <GlowDivider />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
        <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-blue-900/20 backdrop-blur-sm text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <Moon className="w-12 h-12 text-purple-300 mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/5 mb-6">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Midnight Special</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Midnight Madness 🌙
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            At the stroke of midnight on May 6th, the energy peaks. Expect surprise mini-challenges, team activities, and morale-boosting events to keep the spirit alive through the night.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Surprise Challenges", "Energy Boosts", "Interactive Activities", "Special Recognitions"].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────
// GITHUB SUBMISSION
// ────────────────────────────────────────
export function GithubSubmission() {
  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <GlowDivider />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
        <div className="relative p-10 rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
                <Github className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">Submission</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                GitHub Submission Guidelines
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                All projects must be submitted via a public GitHub repository before the deadline. Include a proper README with setup instructions, screenshots, and demo links.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { num: "01", title: "Create GitHub Repo", desc: "Public repo with your project code" },
                { num: "02", title: "Write a README", desc: "Problem, solution, tech stack, setup guide" },
                { num: "03", title: "Record a Demo", desc: "Short video or live link showcasing the project" },
                { num: "04", title: "Submit Link", desc: "Submit via the platform dashboard before 9AM" },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/20 transition-colors group">
                  <span className="font-display text-2xl font-black text-primary/30 group-hover:text-primary/60 transition-colors">{step.num}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{step.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────
// LOST & FOUND / RULES
// ────────────────────────────────────────
export function LostAndFound() {
  const rules = [
    "Maximum 4 participants per registered team.",
    "Only officially registered platform users can participate.",
    "Team Leader is responsible for official domain registration.",
    "All code must be originally written during the 24-hour hacking frame.",
    "No plagiarism or pre-built projects — judges may verify.",
    "Participants must carry a valid college ID proof.",
    "Any misconduct may lead to immediate disqualification.",
  ];

  return (
    <section className="relative z-10 px-6 max-w-7xl mx-auto">
      <GlowDivider />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Rules &amp; Regulations</h3>
            </div>
            <ul className="space-y-4">
              {rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover:text-green-400 transition-colors" />
                  <span className="text-gray-300 text-sm leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/20 backdrop-blur-sm h-full">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Important Notes</h3>
            </div>
            <div className="space-y-5">
              {[
                { icon: "📍", title: "Check-in Mandatory", desc: "All participants must check in at the registration desk on arrival." },
                { icon: "🍽️", title: "Meals Provided", desc: "Breakfast, lunch, dinner, and midnight snacks included for all registered participants." },
                { icon: "💡", title: "Mentorship Available", desc: "Industry mentors will be available throughout the hackathon for guidance." },
                { icon: "🔋", title: "Power &amp; Internet", desc: "Power outlets and high-speed WiFi available at all hacking stations." },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white text-sm mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

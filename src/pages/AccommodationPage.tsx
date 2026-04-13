import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building, MapPin, Wallet, Phone,
  AlertTriangle, Bed, Backpack, Clock,
  ShieldCheck, Sparkles, CheckCircle2
} from "lucide-react";

const GlowingDivider = () => (
  <div className="w-full h-px relative flex justify-center items-center my-16">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <div className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-[2px]" />
    <div className="absolute w-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />
  </div>
);

export default function AccommodationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 pt-24 pb-32">

      {/* 1. HERO */}
      <section className="relative z-10 px-8 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <Bed className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium tracking-wider uppercase text-gray-300">Stay With Us</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            Accommodation &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Stay</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light mb-12">
            Accommodation is available for participants arriving early or staying during the HackFusion 2.0 hackathon.
          </p>

          <div className="relative h-[300px] md:h-[500px] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1769&auto=format&fit=crop"
              alt="Accommodation Campus"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      <GlowingDivider />

      {/* 2, 3, 4. OVERVIEW, LOCATION, FEES */}
      <section className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Building className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Accommodation Overview</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /> Provided at A.G.M Rural College of Engineering and Technology</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /> Designed for participants attending HackFusion 2.0</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /> Focus on comfort, accessibility, and proximity to the event</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Location Context</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> Arranged within or near the college campus</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> Easy access to the hackathon venue</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" /> Participants stay close to all event activities</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 p-8 rounded-3xl hover:bg-green-500/20 transition-colors group"
          >
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30 group-hover:scale-110 transition-transform">
              <Wallet className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Fees Clarity</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> Accommodation is provided at <strong className="text-white">no additional cost</strong></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> Participants must confirm in advance</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <GlowingDivider />

      {/* 5. BOOKING PROCESS & CONTACT */}
      <section className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">Booking Process</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">

              {[
                { num: 1, color: "bg-blue-500", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]", title: "Inform the Team", desc: "Inform the Student Coordination Team about your arrival." },
                { num: 2, color: "bg-purple-500", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]", title: "Confirm Requirement", desc: "Confirm your accommodation requirement and team size." },
                { num: 3, color: "bg-pink-500", shadow: "shadow-[0_0_20px_rgba(236,72,153,0.5)]", title: "Receive Details", desc: "Receive your confirmation details and room allocation." },
              ].map((step) => (
                <div key={step.num} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-background ${step.color} text-white font-bold ${step.shadow} z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-display`}>
                    {step.num}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl ml-4 md:ml-0">
                    <h4 className="font-display text-xl font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3"
          >
            <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              <h2 className="font-display text-2xl font-bold text-white mb-8 tracking-tight">Contact Coordinators</h2>

              <div className="space-y-8">
                {/* Johan J */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                      <Phone className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Johan J</h4>
                      <p className="text-sm text-gray-400">Accommodation Team</p>
                    </div>
                  </div>
                  <a
                    href="tel:+917892821517"
                    className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +91 78928 21517
                  </a>
                </div>

                {/* Bhavani Dengi */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                      <Phone className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Bhavani Dengi</h4>
                      <p className="text-sm text-gray-400">Accommodation Team</p>
                    </div>
                  </div>
                  <a
                    href="tel:+917204005783"
                    className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 border border-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +91 72040 05783
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <GlowingDivider />

      {/* 6, 7, 8. RULES, EXPECTATIONS, BRING */}
      <section className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Accommodation Rules</h3>
            </div>
            <ul className="space-y-4 text-gray-300">
              {["Maintain discipline and cleanliness", "Respect college property", "Any damage may lead to necessary action", "Follow coordinator instructions"].map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/40">
                <Bed className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">What to Expect</h3>
            </div>
            <ul className="space-y-4 text-gray-200 font-medium">
              {["Shared accommodation setup", "Basic facilities provided", "Safe and monitored environment", "Close proximity to the event location"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center border border-pink-500/30">
                <Backpack className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">What to Bring</h3>
            </div>
            <ul className="space-y-4 text-gray-300">
              {["Personal essentials", "Identification proof", "Chargers / devices", "Basic bedding if required"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <GlowingDivider />

      {/* 9, 10, 11. CHECK-IN, SAFETY, ENGAGEMENT */}
      <section className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Check-in / Check-out</h3>
            <ul className="space-y-3 text-gray-300">
              {["Arrive one day prior to the event", "Stay is allowed during the hackathon", "Stay until the next day after conclusion", "Check-out expected after completion"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Safety Assurance</h3>
            <ul className="space-y-3 text-gray-300">
              {["Accommodation areas will be monitored", "Coordinators available for assistance", "Safe and organized environment maintained"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4">Engagement &amp; Experience</h3>
            <ul className="space-y-3 text-gray-300">
              {["Interactive and light engagement activities", "Ensures participants remain active and refreshed"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

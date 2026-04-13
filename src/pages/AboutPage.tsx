import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

export default function AboutPage() {
  return (
    <div className="min-h-[100svh] bg-background pt-24 pb-12 overflow-x-hidden selection:bg-primary/30">
      <section className="relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Platform Developers
            </h1>
            <p className="text-muted-foreground text-lg mb-4 max-w-2xl mx-auto">
              Meet the team who built this registration platform for HackFusion 2.0.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Sanjeev */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 rounded-full bg-secondary overflow-hidden mb-6 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <img src="/sanjeev.jpeg" alt="Sanjeev" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Sanjeev</h3>
              <p className="text-primary font-medium mb-2">Frontend Dev</p>
              <p className="text-sm text-muted-foreground">Co-lead, OS Code AGMR Chapter</p>
            </motion.div>

            {/* Sudhanva */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 rounded-full bg-secondary overflow-hidden mb-6 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <img src="/sudhanva.jpeg" alt="Sudhanva" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Sudhanva</h3>
              <p className="text-primary font-medium mb-2">Backend Dev</p>
            </motion.div>

            {/* Shrusti */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 rounded-full bg-secondary overflow-hidden mb-6 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <img src="/Shrusti.jpeg" alt="Shrusti" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Shrusti</h3>
              <p className="text-primary font-medium mb-2">Database Dev</p>
            </motion.div>

            {/* Krishi */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 rounded-full bg-secondary overflow-hidden mb-6 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <img src="/krishi.jpeg" alt="Krishi" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Krishi</h3>
              <p className="text-primary font-medium mb-2">UI UX Developer</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

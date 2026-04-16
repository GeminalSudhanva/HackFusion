import { useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Users, Bed, Code2, Megaphone, ShieldCheck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  }),
};

interface Coordinator {
  name: string;
  phone: string;
  role: string;
  team: string;
  color: string;
  iconBg: string;
  borderColor: string;
}

const coordinators: { category: string; icon: any; accent: string; members: Coordinator[] }[] = [
  {
    category: "Overall Coordination",
    icon: ShieldCheck,
    accent: "text-primary",
    members: [
      {
        name: "Sanjeev Nadgir",
        phone: "+919611103853",
        role: "Lead Coordinator",
        team: "Core Team",
        color: "text-primary",
        iconBg: "bg-primary/10 border-primary/20",
        borderColor: "border-primary/20",
      },
    ],
  },
  {
    category: "Accommodation Team",
    icon: Bed,
    accent: "text-blue-400",
    members: [
      {
        name: "Johan J",
        phone: "+917892821517",
        role: "Accommodation Coordinator",
        team: "Accommodation",
        color: "text-blue-400",
        iconBg: "bg-blue-500/10 border-blue-500/20",
        borderColor: "border-blue-500/20",
      },
      {
        name: "Bhavani Dengi",
        phone: "+917204005783",
        role: "Accommodation Coordinator",
        team: "Accommodation",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
    ],
  },
  {
    category: "Faculty Coordinators",
    icon: Users,
    accent: "text-purple-400",
    members: [
      {
        name: "Dr. Chandru J",
        phone: "+919535142472",
        role: "Faculty Coordinator",
        team: "HOD",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
      {
        name: "Mrs. Harsha A",
        phone: "+919886155553",
        role: "Faculty Coordinator",
        team: "Faculty",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
      {
        name: "Mrs. Kavita",
        phone: "+919164592547",
        role: "Faculty Coordinator",
        team: "Faculty",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
      {
        name: "Mrs. Shobha J",
        phone: "+918618309795",
        role: "Faculty Coordinator",
        team: "Faculty",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
      {
        name: "Mr. Tanveer K",
        phone: "+919241220230",
        role: "Faculty Coordinator",
        team: "Faculty",
        color: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/20",
      },
    ],
  },
  {
    category: "Technical Team",
    icon: Code2,
    accent: "text-green-400",
    members: [
      {
        name: "Sudhanva",
        phone: "+919876543210",
        role: "Technical Lead",
        team: "Tech Team",
        color: "text-green-400",
        iconBg: "bg-green-500/10 border-green-500/20",
        borderColor: "border-green-500/20",
      },
    ],
  },
  {
    category: "Event Management",
    icon: Megaphone,
    accent: "text-orange-400",
    members: [
      {
        name: "Krishi Navale",
        phone: "+917019463464",
        role: "Event Coordinator",
        team: "Events",
        color: "text-orange-400",
        iconBg: "bg-orange-500/10 border-orange-500/20",
        borderColor: "border-orange-500/20",
      },
      {
        name: "Jonah J",
        phone: "+917892821517",
        role: "Event Coordinator",
        team: "Events",
        color: "text-orange-400",
        iconBg: "bg-orange-500/10 border-orange-500/20",
        borderColor: "border-orange-500/20",
      },
      {
        name: "Pavitra Maradi",
        phone: "+918792466843",
        role: "Event Coordinator",
        team: "Events",
        color: "text-orange-400",
        iconBg: "bg-orange-500/10 border-orange-500/20",
        borderColor: "border-orange-500/20",
      },
      {
        name: "Rajat Nyamti",
        phone: "+917892493391",
        role: "Event Coordinator",
        team: "Events",
        color: "text-orange-400",
        iconBg: "bg-orange-500/10 border-orange-500/20",
        borderColor: "border-orange-500/20",
      },
    ],
  },
];

export default function CoordinatorsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 pt-24 pb-32">
      {/* Hero */}
      <section className="relative z-10 px-8 py-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-wider uppercase text-gray-300">Get In Touch</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            Event{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Coordinators</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            Reach out to our team for any queries related to HackFusion 2.0 — registration, accommodation, technical issues, or general inquiries.
          </p>
        </motion.div>
      </section>

      {/* Coordinator Categories */}
      <section className="relative z-10 px-8 max-w-5xl mx-auto space-y-12">
        {coordinators.map((group, gi) => (
          <motion.div
            key={group.category}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={gi}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${group.members[0].iconBg}`}>
                <group.icon className={`w-5 h-5 ${group.accent}`} />
              </div>
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">{group.category}</h2>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {group.members.map((person, pi) => (
                <motion.div
                  key={person.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={pi + 1}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`relative p-6 rounded-2xl bg-white/5 border ${person.borderColor} backdrop-blur-sm overflow-hidden group hover:bg-white/10 transition-colors`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${person.iconBg} group-hover:scale-110 transition-transform`}>
                      <Phone className={`w-6 h-6 ${person.color}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{person.name}</h3>
                      <p className="text-xs text-gray-400">{person.role}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${person.phone}`}
                    className={`w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl border border-white/10 transition-colors`}
                  >
                    <Phone className="w-4 h-4" />
                    {person.phone.replace("+91", "+91 ").replace(/(\d{5})(\d{5})/, "$1 $2")}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Emergency Footer */}
      <section className="relative z-10 px-8 max-w-5xl mx-auto mt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 text-center"
        >
          <h3 className="font-display text-xl font-bold text-white mb-3">Need Urgent Help?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-lg mx-auto">
            If you face any emergency during the event, contact the Lead Coordinator directly or approach any volunteer on campus.
          </p>
          <a
            href="tel:+919611103853"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-background font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            <Phone className="w-5 h-5" />
            Call Lead Coordinator
          </a>
        </motion.div>
      </section>
    </main>
  );
}

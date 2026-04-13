import { useEffect } from "react";
import {
  CollegeInfo,
  EventOverview,
  FeesAndPrizes,
  Roadmap,
  MidnightExperience,
  GithubSubmission,
  LostAndFound,
} from "@/components/EventSections";
import { Domains, FinalCTA } from "@/components/Sections";

export default function EventPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 pt-20">
      {/* Page hero header */}
      <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Hackathon 2026</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-black mb-4 tracking-tight leading-tight text-white">
          The{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
            Event
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Everything you need to know about HackFusion 2.0 — venue, schedule, rules, prizes, and more.
        </p>
      </div>

      <CollegeInfo />
      <EventOverview />
      <FeesAndPrizes />
      <Domains />
      <Roadmap />
      <MidnightExperience />
      <GithubSubmission />
      <LostAndFound />
      <div className="pb-10" />
      <FinalCTA />
    </main>
  );
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionCCTV from "@/components/SectionCCTV";
import SectionAI from "@/components/SectionAI";
import SectionMap from "@/components/SectionMap";
import SectionStats from "@/components/SectionStats";
import SectionCTA from "@/components/SectionCTA";
import FloatingMascot from "@/components/FloatingMascot";
import SectionTeam from "@/components/SectionTeam";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">
      <Navbar />
      <Hero />
      <SectionCCTV />
      <SectionAI />
      <SectionMap />
      <SectionStats />
      <SectionTeam />
      <SectionCTA />
      <FloatingMascot />
    </main>
  );
}

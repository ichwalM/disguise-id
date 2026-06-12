import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionCCTV from "@/components/SectionCCTV";
import SectionAI from "@/components/SectionAI";
import SectionMap from "@/components/SectionMap";
import SectionStats from "@/components/SectionStats";
import SectionCTA from "@/components/SectionCTA";
import FloatingMascot from "@/components/FloatingMascot";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#080810" }}>
      <Navbar />
      <Hero />
      <SectionCCTV />
      <SectionAI />
      <SectionMap />
      <SectionStats />
      <SectionCTA />
      <FloatingMascot />
    </main>
  );
}


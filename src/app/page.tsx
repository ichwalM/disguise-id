import Navbar from "@/components/Navbar";
import ScrollytellingWrapper from "@/components/scrollytelling/ScrollytellingWrapper";
import ThreeDimensionalCanvas from "@/components/scrollytelling/layers/ThreeDimensionalCanvas";
import StoryboardDOM from "@/components/scrollytelling/layers/StoryboardDOM";
import ForegroundMascot from "@/components/scrollytelling/layers/ForegroundMascot";

export default function Home() {
  return (
    <main className="bg-[#080810] text-zinc-50 font-sans">
      <Navbar />

      {/* Layer 1: 3D Background — CCTV Pole, Stars (SINGLE Canvas) */}
      <ThreeDimensionalCanvas />

      <ScrollytellingWrapper>
        {/* Layer 2: HTML Storyboard — all 10 sections with glassmorphism cards */}
        <StoryboardDOM />

        {/* Layer 3: Foreground Mascot — right-side spatial zone, hologram panels, FSM states */}
        <ForegroundMascot />
      </ScrollytellingWrapper>
    </main>
  );
}

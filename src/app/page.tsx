import Navbar from "@/components/Navbar";
import ScrollytellingWrapper from "@/components/scrollytelling/ScrollytellingWrapper";
import ThreeDimensionalCanvas from "@/components/scrollytelling/layers/ThreeDimensionalCanvas";
import StoryboardDOM from "@/components/scrollytelling/layers/StoryboardDOM";
import ForegroundMascot from "@/components/scrollytelling/layers/ForegroundMascot";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080810] text-zinc-50 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <ScrollytellingWrapper>
        {/* Layer 1 & 2: 3D Background and Midground (Rings, CCTV Pole, Stars) */}
        <ThreeDimensionalCanvas />
        
        {/* Layer 2.5: The Interactive HTML UI Storyboard (Glassmorphism cards) */}
        <StoryboardDOM />
        
        {/* Layer 3: Foreground Mascot with FSM Personalities */}
        <ForegroundMascot />
      </ScrollytellingWrapper>
      
      {/* We can keep the footer outside the scrollytelling if we want, or disable it. We'll leave it out for now since the Finale section serves as CTA. */}
    </main>
  );
}

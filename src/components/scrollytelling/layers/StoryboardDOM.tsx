"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import SectionCCTV from "@/components/SectionCCTV";
import SectionAI from "@/components/SectionAI";
import SectionMap from "@/components/SectionMap";
import SectionStats from "@/components/SectionStats";
import SectionCTA from "@/components/SectionCTA";

export default function StoryboardDOM() {
  const scrollProgress = useMascotStore((state) => state.scrollProgress);
  const setMascotState = useMascotStore((state) => state.setState);

  // FSM State Manager linked to scroll
  useEffect(() => {
    if (scrollProgress < 0.08) setMascotState("IDLE");
    else if (scrollProgress < 0.18) setMascotState("PROBLEM");
    else if (scrollProgress < 0.28) setMascotState("SCANNING");
    else if (scrollProgress < 0.45) setMascotState("ANALYZING");
    else if (scrollProgress < 0.65) setMascotState("RECONSTRUCTING");
    else if (scrollProgress < 0.75) setMascotState("MATCH_FOUND");
    else if (scrollProgress < 0.9) setMascotState("REPORTING");
    else setMascotState("IDLE");
  }, [scrollProgress, setMascotState]);

  // Utility to determine opacity based on progress window
  const getOpacity = (start: number, end: number) => {
    if (scrollProgress < start - 0.03 || scrollProgress > end + 0.03) return 0;
    if (scrollProgress >= start && scrollProgress <= end) return 1;
    if (scrollProgress < start) return (scrollProgress - (start - 0.03)) / 0.03;
    return (end + 0.03 - scrollProgress) / 0.03;
  };

  const getTransform = (start: number) => {
    const offset = (start - scrollProgress) * 500;
    // Cap it so it doesn't fly infinitely
    if (offset > 200 || offset < -200) return `translateY(${offset > 0 ? 200 : -200}px)`;
    return `translateY(${offset}px)`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 1. HERO */}
      <div 
        className="absolute inset-0 flex flex-col justify-center will-change-transform"
        style={{ opacity: getOpacity(0, 0.08), transform: getTransform(0.04) }}
      >
        <div className="pointer-events-auto h-full overflow-y-auto hide-scrollbar flex items-center">
          <Hero />
        </div>
      </div>

      {/* 2. PROBLEM STATEMENT (New Custom Overlay combining glassmorphism) */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center px-16 lg:px-32 will-change-transform text-center"
        style={{ opacity: getOpacity(0.12, 0.18), transform: getTransform(0.15) }}
      >
        <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-red-500/30 p-12 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_#ef4444]">THE DISGUISE CHALLENGE</h2>
          <p className="text-2xl text-zinc-300 leading-relaxed">
            Masks, hats, and glasses shield identities. Conventional CCTV systems fail when key facial features are hidden.
          </p>
          <div className="mt-8 inline-block border border-red-500/80 bg-red-950/50 px-8 py-4 rounded-xl text-red-200 font-mono animate-pulse tracking-widest">
            TARGET DISGUISED. CHALLENGE ACCEPTED.
          </div>
        </div>
      </div>

      {/* 3. CCTV INFRA */}
      <div 
        className="absolute inset-0 flex flex-col justify-center will-change-transform"
        style={{ opacity: getOpacity(0.22, 0.28), transform: getTransform(0.25) }}
      >
        <div className="pointer-events-auto h-full flex items-center">
          <SectionCCTV />
        </div>
      </div>

      {/* 4. FACE DETECT (New Custom Overlay) */}
      <div 
        className="absolute inset-0 flex flex-col items-end justify-center px-16 lg:px-32 will-change-transform text-right"
        style={{ opacity: getOpacity(0.32, 0.38), transform: getTransform(0.35) }}
      >
        <div className="pointer-events-auto bg-[#0a0a14]/60 backdrop-blur-xl border border-emerald-500/20 p-12 rounded-3xl max-w-3xl">
          <h2 className="text-5xl font-bold text-emerald-400 mb-4">THE EXTRACTION</h2>
          <p className="text-xl text-zinc-300">
            Advanced MTCNN isolates anomalous targets in dense crowds within 12 milliseconds.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3 text-emerald-500 font-mono text-xl">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"/> TARGET LOCKED
          </div>
        </div>
      </div>

      {/* 5. AI RECONSTRUCTION */}
      <div 
        className="absolute inset-0 flex flex-col justify-center will-change-transform"
        style={{ opacity: getOpacity(0.42, 0.52), transform: getTransform(0.47) }}
      >
        <div className="pointer-events-auto h-full flex items-center">
          <SectionAI />
        </div>
      </div>

      {/* 6. FACE RECOG & 7. MATCH */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-end pb-32 will-change-transform text-center"
        style={{ opacity: getOpacity(0.58, 0.68), transform: getTransform(0.63) }}
      >
        <div className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-red-500/40 p-16 rounded-[3rem] shadow-[0_0_100px_rgba(239,68,68,0.3)]">
          <h2 className="text-7xl font-black text-red-500 tracking-widest drop-shadow-[0_0_30px_#ef4444]">MATCH FOUND</h2>
          <div className="mt-6 text-9xl font-mono text-white">
            <span className="tabular-nums">
              {scrollProgress < 0.62 ? (scrollProgress * 150).toFixed(2) : "94.74"}
            </span>%
          </div>
          <p className="text-2xl text-red-300 mt-4 font-mono tracking-widest">STRUCTURAL SIMILARITY INDEX</p>
        </div>
      </div>

      {/* 8. MOBILE ALERT (New Custom Overlay) */}
      <div 
        className="absolute inset-0 flex flex-col justify-center px-16 lg:px-32 will-change-transform"
        style={{ opacity: getOpacity(0.72, 0.78), transform: getTransform(0.75) }}
      >
         <div className="pointer-events-auto bg-[#0a0a14]/80 backdrop-blur-xl border border-indigo-500/30 p-12 rounded-3xl max-w-3xl">
          <h2 className="text-5xl font-bold text-indigo-400 mb-4">FIELD OPS ALERT</h2>
          <p className="text-xl text-zinc-300">
            Instant push notifications to mobile units. Real-time target coordinates and reconstructed dossiers delivered seamlessly.
          </p>
        </div>
      </div>

      {/* 9. STATS & IMPACT */}
      <div 
        className="absolute inset-0 flex flex-col justify-center will-change-transform"
        style={{ opacity: getOpacity(0.82, 0.90), transform: getTransform(0.86) }}
      >
        <div className="pointer-events-auto h-full flex items-center">
          <SectionStats />
        </div>
      </div>

      {/* 11. FINALE */}
      <div 
        className="absolute inset-0 flex flex-col justify-center will-change-transform"
        style={{ opacity: getOpacity(0.93, 1.0), transform: getTransform(0.96) }}
      >
        <div className="pointer-events-auto h-full flex items-center">
          <SectionCTA />
        </div>
      </div>

    </div>
  );
}

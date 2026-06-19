"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function StorySections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useMascotStore((state) => state.scrollProgress);
  const setMascotState = useMascotStore((state) => state.setState);

  // We will map progress to active sections
  useEffect(() => {
    // 0-11 steps mapping based on progress
    // Hero (0-0.09)
    // Problem (0.1 - 0.18)
    // CCTV (0.2 - 0.28)
    // Detect (0.3 - 0.38)
    // Reconstruct (0.4 - 0.48)
    // Recog (0.5 - 0.58)
    // Match (0.6 - 0.68)
    // Mobile (0.7 - 0.78)
    // Stats (0.8 - 0.88)
    // Impact (0.9 - 0.95)
    // Finale (0.95 - 1.0)
    
    if (scrollProgress < 0.1) setMascotState("IDLE");
    else if (scrollProgress < 0.2) setMascotState("PROBLEM");
    else if (scrollProgress < 0.3) setMascotState("SCANNING");
    else if (scrollProgress < 0.4) setMascotState("ANALYZING");
    else if (scrollProgress < 0.6) setMascotState("RECONSTRUCTING");
    else if (scrollProgress < 0.7) setMascotState("MATCH_FOUND");
    else if (scrollProgress < 0.9) setMascotState("REPORTING");
    else setMascotState("IDLE"); // Finale
    
  }, [scrollProgress, setMascotState]);

  // Utility to determine opacity based on progress window
  const getOpacity = (start: number, end: number) => {
    // Fade in 0.02, hold, fade out 0.02
    if (scrollProgress < start - 0.02 || scrollProgress > end + 0.02) return 0;
    if (scrollProgress >= start && scrollProgress <= end) return 1;
    if (scrollProgress < start) return (scrollProgress - (start - 0.02)) / 0.02;
    return (end + 0.02 - scrollProgress) / 0.02;
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 1. HERO */}
      <section 
        className="absolute inset-0 flex flex-col justify-center px-16 lg:px-32 will-change-transform"
        style={{ opacity: getOpacity(0, 0.08), transform: `translateY(${(0.04 - scrollProgress) * 200}px)` }}
      >
        <h1 className="text-6xl font-bold tracking-tighter text-white drop-shadow-lg">
          DIGITAL FORENSICS <br/> <span className="text-emerald-500">REDEFINED</span>
        </h1>
        <p className="mt-4 max-w-xl text-xl text-zinc-300">
          Identify targets beyond disguises in real-time.
        </p>
      </section>

      {/* 2. PROBLEM */}
      <section 
        className="absolute inset-0 flex flex-col items-end justify-center px-16 lg:px-32 will-change-transform text-right"
        style={{ opacity: getOpacity(0.12, 0.18), transform: `translateY(${(0.15 - scrollProgress) * 200}px)` }}
      >
        <h2 className="text-5xl font-bold text-red-500 drop-shadow-[0_0_20px_#ef4444]">THE DISGUISE CHALLENGE</h2>
        <p className="mt-4 max-w-md text-lg text-zinc-300">
          Masks, hats, and glasses shield identities. Conventional CCTV systems fail when key facial features are hidden.
        </p>
        <div className="mt-6 border border-red-500/50 bg-red-950/30 p-4 backdrop-blur-sm rounded-lg text-red-200">
          "Target Disguised. Challenge Accepted."
        </div>
      </section>

      {/* 3. CCTV INFRA */}
      <section 
        className="absolute inset-0 flex flex-col justify-center px-16 lg:px-32 will-change-transform"
        style={{ opacity: getOpacity(0.22, 0.28), transform: `translateY(${(0.25 - scrollProgress) * 200}px)` }}
      >
        <h2 className="text-5xl font-bold text-blue-400">512+ SMART NODES</h2>
        <p className="mt-4 max-w-md text-lg text-zinc-300">
          Continuous monitoring across the city grid. Capturing millions of faces per hour with high-definition optical sensors.
        </p>
      </section>

      {/* 4. FACE DETECT */}
      <section 
        className="absolute inset-0 flex flex-col items-end justify-center px-16 lg:px-32 will-change-transform text-right"
        style={{ opacity: getOpacity(0.32, 0.38), transform: `translateY(${(0.35 - scrollProgress) * 200}px)` }}
      >
        <h2 className="text-5xl font-bold text-emerald-400">THE EXTRACTION</h2>
        <p className="mt-4 max-w-md text-lg text-zinc-300">
          Advanced MTCNN isolates anomalous targets in dense crowds within 12 milliseconds.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2 text-emerald-500 font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/> TARGET LOCKED
        </div>
      </section>

      {/* 5. AI RECONSTRUCT */}
      <section 
        className="absolute inset-0 flex flex-col justify-center px-16 lg:px-32 will-change-transform"
        style={{ opacity: getOpacity(0.42, 0.48), transform: `translateY(${(0.45 - scrollProgress) * 200}px)` }}
      >
        <div className="border-l-4 border-emerald-500 pl-6">
          <h2 className="text-5xl font-bold text-white">VAE V2 RECONSTRUCTION</h2>
          <p className="mt-4 max-w-md text-lg text-zinc-300">
            Pixel-level restoration. Generative AI predicts and rebuilds obstructed facial structures with mathematical precision.
          </p>
        </div>
      </section>

      {/* 6. FACE RECOG & 7. MATCH */}
      <section 
        className="absolute inset-0 flex flex-col items-center justify-end pb-32 will-change-transform text-center"
        style={{ opacity: getOpacity(0.55, 0.68), transform: `translateY(${(0.6 - scrollProgress) * 100}px)` }}
      >
        <h2 className="text-6xl font-black text-red-500 tracking-widest drop-shadow-[0_0_30px_#ef4444]">MATCH FOUND</h2>
        <div className="mt-4 text-8xl font-mono text-white">
          <span className="tabular-nums">
            {scrollProgress < 0.6 ? (scrollProgress * 150).toFixed(2) : "94.74"}
          </span>%
        </div>
        <p className="text-xl text-red-300 mt-2 font-mono">STRUCTURAL SIMILARITY INDEX</p>
      </section>

      {/* 8. MOBILE */}
      <section 
        className="absolute inset-0 flex flex-col justify-center px-16 lg:px-32 will-change-transform"
        style={{ opacity: getOpacity(0.72, 0.78), transform: `translateY(${(0.75 - scrollProgress) * 200}px)` }}
      >
        <h2 className="text-5xl font-bold text-indigo-400">FIELD OPS ALERT</h2>
        <p className="mt-4 max-w-md text-lg text-zinc-300">
          Instant push notifications to mobile units. Real-time target coordinates and reconstructed dossiers delivered seamlessly.
        </p>
      </section>

      {/* 9 & 10. STATS & IMPACT */}
      <section 
        className="absolute inset-0 flex flex-col items-center justify-center will-change-transform text-center"
        style={{ opacity: getOpacity(0.82, 0.92) }}
      >
        <h2 className="text-4xl font-bold text-white mb-12">SYSTEM CAPABILITY</h2>
        <div className="grid grid-cols-3 gap-16 text-center">
          <div>
            <div className="text-6xl font-black text-emerald-400">12ms</div>
            <div className="text-zinc-400 mt-2 font-mono">DETECTION LATENCY</div>
          </div>
          <div>
            <div className="text-6xl font-black text-emerald-400">1.2M</div>
            <div className="text-zinc-400 mt-2 font-mono">FACES / HOUR</div>
          </div>
          <div>
            <div className="text-6xl font-black text-emerald-400">-40%</div>
            <div className="text-zinc-400 mt-2 font-mono">CRIME RATE</div>
          </div>
        </div>
      </section>

      {/* 11. FINALE */}
      <section 
        className="absolute inset-0 flex flex-col items-center justify-center will-change-transform text-center"
        style={{ opacity: getOpacity(0.95, 1.0) }}
      >
        <h1 className="text-7xl font-black tracking-tighter text-white">
          DISGUISE-ID
        </h1>
        <p className="mt-6 text-2xl text-emerald-400 font-mono tracking-widest drop-shadow-[0_0_15px_#34d399]">
          IDENTIFY BEYOND DISGUISE
        </p>
        <button className="mt-12 pointer-events-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          ENTER COMMAND CENTER
        </button>
      </section>

    </div>
  );
}

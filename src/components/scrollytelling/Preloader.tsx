"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem("disguise_visited");
    if (hasVisited) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("disguise_visited", "true");
        setIsVisible(false);
        onComplete();
      },
    });

    const lines = [
      "Loading CCTV Network...",
      "Loading AI Engine...",
      "Loading Recognition Database...",
      "Loading Investigation Modules...",
      "System Ready.",
    ];

    // Initial setup
    gsap.set(textRef.current, { opacity: 0 });

    tl.to(textRef.current, { opacity: 1, duration: 0.2 })
      .to(".boot-text", { opacity: 1, duration: 0.3 })
      .to(".boot-text", { opacity: 0, duration: 0.2, delay: 0.2 });

    lines.forEach((line, index) => {
      tl.to(".loading-lines", {
        text: { value: line },
        duration: 0.25,
        ease: "none",
      }).to({}, { duration: 0.1 }); // Short pause
    });

    // Final fade out of the entire preloader
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
      delay: 0.2,
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 font-mono text-emerald-500"
    >
      <div ref={textRef} className="text-center">
        <h1 className="boot-text mb-4 text-3xl font-bold tracking-widest opacity-0">
          SYSTEM BOOTING...
        </h1>
        <div className="h-6 text-sm opacity-80">
          <span className="loading-lines">Initializing Core...</span>
          <span className="animate-pulse">_</span>
        </div>
        
        {/* Simple fast progress bar */}
        <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-full origin-left animate-[scale-x_2s_ease-out_forwards] bg-emerald-500" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </div>
  );
}

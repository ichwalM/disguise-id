"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Skip if visited
    if (sessionStorage.getItem("disguise_visited")) {
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

    // Boot Sequence
    gsap.set(textRef.current, { opacity: 0 });
    tl.to(textRef.current, { opacity: 1, duration: 0.2 })
      .to(".boot-text", { opacity: 1, duration: 0.3 })
      .to(".boot-text", { opacity: 0, duration: 0.2, delay: 0.2 });

    const lines = [
      "Loading CCTV Network... [OK]",
      "Loading AI Engine... [OK]",
      "Loading Investigation Modules... [OK]",
      "System Ready.",
    ];

    lines.forEach((line) => {
      tl.set(".loading-lines", { textContent: line }) // Simplistic, TextPlugin is better but let's avoid extra deps if possible
        .to({}, { duration: 0.3 }); 
    });

    // Expand / Open door effect
    tl.to(".preloader-panel-left", { xPercent: -100, duration: 0.8, ease: "power4.inOut" }, "split")
      .to(".preloader-panel-right", { xPercent: 100, duration: 0.8, ease: "power4.inOut" }, "split")
      .to(containerRef.current, { display: "none", duration: 0 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-mono text-emerald-500 overflow-hidden"
    >
      {/* Background Panels for split effect */}
      <div className="preloader-panel-left absolute left-0 top-0 w-1/2 h-full bg-zinc-950" />
      <div className="preloader-panel-right absolute right-0 top-0 w-1/2 h-full bg-zinc-950" />
      
      <div ref={textRef} className="z-10 text-center">
        <h1 className="boot-text mb-4 text-3xl font-bold tracking-widest opacity-0">
          SYSTEM BOOTING...
        </h1>
        <div className="h-6 text-sm opacity-80 flex items-center justify-center">
          <span className="loading-lines">Initializing Core...</span>
          <span className="animate-pulse ml-1">_</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Preloader from "./Preloader";
import { useMascotStore } from "@/store/useMascotStore";

export default function ScrollytellingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const setScrollProgress = useMascotStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (!isPreloaderDone) return;

    let ctx = gsap.context(() => {
      if (!wrapperRef.current) return;

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=12000", // 12000px scroll duration for the 11 steps
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Master timeline structure mapped to 11 steps
      // 0-10%: Hero (Step 1)
      // 10-20%: Problem (Step 2)
      // 20-30%: CCTV Infra (Step 3)
      // 30-40%: Face Detect (Step 4)
      // 40-50%: AI Reconstruct (Step 5)
      // 50-60%: Face Recog (Step 6)
      // 60-70%: DPO Match (Step 7)
      // 70-80%: Mobile Alert (Step 8)
      // 80-90%: Stats (Step 9) & Impact (Step 10)
      // 90-100%: Finale (Step 11)
      
      // The timeline is exposed globally or we drive children directly through the store
      // We will drive children via the useMascotStore scrollProgress to keep DOM decoupled

    }, containerRef);

    return () => ctx.revert();
  }, [isPreloaderDone, setScrollProgress]);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      
      <div 
        ref={wrapperRef} 
        className="relative h-screen w-full overflow-hidden bg-[#080810] text-white"
        style={{ opacity: isPreloaderDone ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <div ref={containerRef} className="absolute inset-0">
          {children}
        </div>
      </div>
    </>
  );
}

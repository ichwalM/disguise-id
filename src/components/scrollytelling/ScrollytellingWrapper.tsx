"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Preloader from "./Preloader";
import { useMascotStore } from "@/store/useMascotStore";

export default function ScrollytellingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const setScrollProgress = useMascotStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (!isPreloaderDone) return;

    let ctx = gsap.context(() => {
      // Create the master timeline linked to scroll
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=10000", // 10000px scroll duration
          scrub: 1, // Smooth scrubbing
          pin: true, // Pin the container
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Expose timeline to children via standard classnames or ids if needed,
      // but ideally children will register their own ScrollTriggers attached to this container
      // or we pass the progress down via store. We are passing progress via store.
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP
  }, [isPreloaderDone, setScrollProgress]);

  return (
    <>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      
      {/* We wait for preloader to finish before rendering the heavy 3D content if desired, 
          but usually we render it hidden so it compiles/loads during preloader. */}
      <div 
        ref={containerRef} 
        className="relative h-screen w-full overflow-hidden bg-zinc-950 text-white"
        style={{ opacity: isPreloaderDone ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        {children}
      </div>
    </>
  );
}

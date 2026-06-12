"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";

export default function ForegroundMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  
  const scrollProgress = useMascotStore((state) => state.scrollProgress);
  const currentState = useMascotStore((state) => state.currentState);

  // FSM Logic for Animations
  useEffect(() => {
    if (!mascotRef.current || !eyeRef.current) return;

    const ctx = gsap.context(() => {
      // Base idle floating (continuous)
      gsap.to(mascotRef.current, {
        y: "+=15",
        rotationZ: 1,
        rotationX: 2,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // State specific animations
      switch (currentState) {
        case 'IDLE':
          gsap.to(mascotRef.current, { scale: 1, duration: 0.5 });
          gsap.to(eyeRef.current, { scaleY: 1, duration: 0.2 }); // Normal eyes
          break;
        case 'PROBLEM':
          gsap.to(mascotRef.current, { scale: 1.1, rotationZ: 5, duration: 0.3 });
          gsap.to(eyeRef.current, { scaleY: 0.4, duration: 0.2 }); // Squint
          break;
        case 'SCANNING':
          gsap.to(mascotRef.current, { scale: 1, rotationY: 30, duration: 1, yoyo: true, repeat: -1 });
          gsap.to(eyeRef.current, { scaleY: 1, duration: 0.2 });
          break;
        case 'ANALYZING':
          gsap.to(mascotRef.current, { scale: 1.05, rotationY: 0, rotationZ: -2, duration: 0.5 });
          gsap.to(eyeRef.current, { scaleY: 0.8, duration: 0.2 });
          break;
        case 'RECONSTRUCTING':
          // Micro vibrations
          gsap.to(mascotRef.current, { x: "+=2", y: "+=2", duration: 0.05, yoyo: true, repeat: -1 });
          gsap.to(eyeRef.current, { scaleY: 0.3, duration: 0.2 }); // Deep focus
          break;
        case 'MATCH_FOUND':
          gsap.killTweensOf(mascotRef.current); // Stop vibrations
          gsap.to(mascotRef.current, { scale: 1.2, y: -20, duration: 0.4, ease: "back.out(1.7)" });
          gsap.to(eyeRef.current, { scaleY: 1.2, duration: 0.2 }); // Wide eyes
          break;
        case 'REPORTING':
          gsap.to(mascotRef.current, { scale: 1, x: -200, duration: 0.8, ease: "power3.out" }); // Move aside for UI
          gsap.to(eyeRef.current, { scaleY: 1, duration: 0.2 });
          break;
      }
    });

    return () => ctx.revert();
  }, [currentState]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
    >
      <div 
        ref={mascotRef}
        className="relative will-change-transform"
        // Parallax effect: 50% speed. We'll use style here since it's driven by React state (scrollProgress) directly.
        // Actually, since scrollProgress goes 0 to 1 over 10000px, 50% speed means it should move relatively.
        // Let's use a subtle translation based on progress to keep it centered but dynamic.
        style={{ transform: `translateY(${scrollProgress * 500}px)` }}
      >
        <div className="relative w-64 h-64 md:w-96 md:h-96 pointer-events-auto cursor-pointer group">
          {/* Main Mascot Image */}
          <Image 
            src="/images/maskot.svg" 
            alt="DISGUISE-ID Mascot" 
            fill 
            className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_50px_rgba(16,185,129,0.6)]" 
            priority
          />
          
          {/* Fake "Eyes" overlay for blinking/squinting without modifying the SVG */}
          {/* This is a visual hack since we don't have separated SVG layers: we'll place glowing eye dots over the SVG eyes */}
          <div 
            ref={eyeRef}
            className="absolute top-[45%] left-[35%] right-[35%] h-[10%] flex justify-between px-6 opacity-80 mix-blend-screen"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
          </div>
        </div>
      </div>
    </div>
  );
}

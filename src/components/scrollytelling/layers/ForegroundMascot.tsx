"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { Search } from "lucide-react";

export default function ForegroundMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const scrollProgress = useMascotStore((state) => state.scrollProgress);
  const currentState = useMascotStore((state) => state.currentState);

  // FSM Logic for Animations & Personality
  useEffect(() => {
    if (!mascotRef.current || !eyeRef.current) return;

    const ctx = gsap.context(() => {
      // Base idle floating (Friendly, Curious)
      gsap.to(mascotRef.current, {
        y: "+=10",
        rotationZ: 1,
        rotationX: 1,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      if (isHovered) {
        gsap.to(mascotRef.current, { scale: 1.1, duration: 0.3 });
        return; // Pause state animations while interacting
      }

      // Personality State specific animations
      switch (currentState) {
        case 'IDLE':
          gsap.to(mascotRef.current, { scale: 1, duration: 0.5 });
          gsap.to(eyeRef.current, { scaleY: 1, duration: 0.2 });
          break;
        case 'PROBLEM':
          // Determined
          gsap.to(mascotRef.current, { scale: 1.15, rotationZ: 5, duration: 0.3 });
          gsap.to(eyeRef.current, { scaleY: 0.3, duration: 0.2 }); // Squint
          break;
        case 'SCANNING':
          // Observant, Focused
          gsap.to(mascotRef.current, { scale: 1, rotationY: 25, duration: 1.5, yoyo: true, repeat: -1 });
          gsap.to(eyeRef.current, { scaleY: 1.2, duration: 0.2 }); // Glowing eyes
          break;
        case 'ANALYZING':
          // Thinking, Intelligent
          gsap.to(mascotRef.current, { scale: 1.05, rotationY: 0, rotationZ: -2, duration: 0.5 });
          gsap.to(eyeRef.current, { scaleY: 0.7, duration: 0.2 });
          break;
        case 'RECONSTRUCTING':
          // Precise, Intense (Micro vibrations)
          gsap.to(mascotRef.current, { x: "+=1", y: "+=1", duration: 0.05, yoyo: true, repeat: -1 });
          gsap.to(eyeRef.current, { scaleY: 0.2, duration: 0.2 }); // Deep focus
          break;
        case 'MATCH_FOUND':
          // Confident, Victorious
          gsap.killTweensOf(mascotRef.current);
          gsap.to(mascotRef.current, { scale: 1.25, y: -20, duration: 0.4, ease: "back.out(1.7)" });
          gsap.to(eyeRef.current, { scaleY: 1.5, duration: 0.2 }); // Wide eyes
          break;
        case 'REPORTING':
          // Professional, Helpful
          gsap.to(mascotRef.current, { scale: 1, x: -150, duration: 0.8, ease: "power3.out" }); // Move aside
          gsap.to(eyeRef.current, { scaleY: 1, duration: 0.2 });
          break;
      }
    });

    return () => ctx.revert();
  }, [currentState, isHovered]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden"
    >
      <div 
        ref={mascotRef}
        className="relative will-change-transform"
        style={{ transform: `translateY(${scrollProgress * 150}px)` }} // Subtle parallax
      >
        <div 
          className="relative w-64 h-64 md:w-96 md:h-96 pointer-events-auto cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            // Interactive click: Show reconstruction demo if analyzing, etc.
            if (currentState === 'RECONSTRUCTING') alert("Launch Reconstruction Demo");
            if (currentState === 'REPORTING') alert("Preview Mobile App");
          }}
        >
          {/* Main Mascot SVG */}
          <Image 
            src="/images/maskot.svg" 
            alt="DISGUISE-ID Mascot" 
            fill 
            className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_60px_rgba(16,185,129,0.8)]" 
            priority
          />
          
          {/* Interactive Hologram Elements */}
          {isHovered && currentState === 'IDLE' && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-full text-sm font-mono whitespace-nowrap backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
              AI Ready.
            </div>
          )}

          {currentState === 'ANALYZING' && (
            <div className="absolute right-0 top-1/2 bg-blue-900/80 border border-blue-500 p-3 rounded-full text-blue-400 backdrop-blur-md animate-pulse">
              <Search size={24} />
            </div>
          )}
          
          {/* Personality Eyes Overlay */}
          <div 
            ref={eyeRef}
            className="absolute top-[45%] left-[35%] right-[35%] h-[10%] flex justify-between px-6 opacity-80 mix-blend-screen pointer-events-none"
          >
            <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] ${currentState === 'PROBLEM' ? 'bg-red-500 text-red-500' : 'bg-emerald-400 text-emerald-400'}`} />
            <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] ${currentState === 'PROBLEM' ? 'bg-red-500 text-red-500' : 'bg-emerald-400 text-emerald-400'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

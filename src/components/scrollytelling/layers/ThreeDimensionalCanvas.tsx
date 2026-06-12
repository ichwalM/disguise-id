"use client";

import { useMascotStore } from "@/store/useMascotStore";
import ThreeScene from "@/components/ThreeScene"; // Existing 3D scene component
import MascotScene from "@/components/MascotScene"; // Existing 3D rings/effects

export default function ThreeDimensionalCanvas() {
  const scrollProgress = useMascotStore((state) => state.scrollProgress);

  return (
    <div className="absolute inset-0 -z-30 h-full w-full pointer-events-none">
      {/* We reuse the existing ThreeScene which internally has a <Canvas> */}
      {/* However, the existing ThreeScene component renders its own Canvas.
          We can pass scrollY to it. But since we use GSAP scrub (0-1),
          we'll multiply it by a large number to simulate scroll pixels for the old component.
          Or, better yet, modify it to accept progress, but we'll try to just pass fake scrollY first.
      */}
      <div className="absolute inset-0 opacity-40">
        <ThreeScene scrollY={scrollProgress * 5000} />
      </div>

      {/* Orbit Rings / Midground from existing MascotScene */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <MascotScene scrollY={scrollProgress * 5000} />
      </div>

      {/* Dark vignette gradient to blend UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-transparent to-[#080810]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-transparent to-[#080810]" />
    </div>
  );
}

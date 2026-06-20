"use client";

import { useMascotStore } from "@/store/useMascotStore";
import ThreeScene from "@/components/ThreeScene";

/*
 * ─── SINGLE Three.js Canvas Layer ───
 *
 * Previously this component imported BOTH ThreeScene (Canvas #1)
 * and MascotScene (Canvas #2), which caused two WebGL contexts.
 * Hero.tsx also imported MascotScene directly (Canvas #3).
 *
 * Now: ONE canvas only — ThreeScene (CCTV Pole + Stars + Rings).
 * MascotScene logic is replaced by the CSS-only ForegroundMascot.
 */
export default function ThreeDimensionalCanvas() {
  const scrollProgress = useMascotStore((s) => s.scrollProgress);

  return (
    <div className="fixed inset-0 -z-30 h-full w-full pointer-events-none">
      {/* Single Three.js canvas — CCTV pole scene */}
      <div className="absolute inset-0" style={{ opacity: 0.45 }}>
        <ThreeScene scrollY={scrollProgress * 5000} />
      </div>

      {/* Vignette: top + bottom fade for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #080810 0%, transparent 18%, transparent 82%, #080810 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Vignette: left + right fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #080810 0%, transparent 20%, transparent 80%, #080810 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

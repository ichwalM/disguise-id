"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import SectionCCTV from "@/components/SectionCCTV";
import SectionAI from "@/components/SectionAI";
import SectionMap from "@/components/SectionMap";
import SectionStats from "@/components/SectionStats";
import SectionCTA from "@/components/SectionCTA";
import SectionMobile from "@/components/SectionMobile";

/*
 * SCROLL PROGRESS → SECTION MAPPING
 *
 *  0.00 → 0.10  → HERO
 *  0.10 → 0.20  → PROBLEM STATEMENT
 *  0.20 → 0.30  → SMART CCTV INFRASTRUCTURE
 *  0.30 → 0.40  → FACE DETECTION ENGINE
 *  0.40 → 0.52  → AI RECONSTRUCTION (VAE V2)
 *  0.52 → 0.64  → RECOGNITION & MATCHING
 *  0.64 → 0.76  → SMART CITY NETWORK (MAP)
 *  0.76 → 0.86  → MOBILE INTEGRATION
 *  0.86 → 0.93  → STATISTICS
 *  0.93 → 1.00  → CALL TO ACTION
 */

export default function StoryboardDOM() {
  const scrollProgress = useMascotStore((s) => s.scrollProgress);
  const setMascotState = useMascotStore((s) => s.setState);

  /* ── FSM State Manager ── */
  useEffect(() => {
    if (scrollProgress < 0.10)       setMascotState("IDLE");
    else if (scrollProgress < 0.20)  setMascotState("PROBLEM");
    else if (scrollProgress < 0.30)  setMascotState("SCANNING");
    else if (scrollProgress < 0.46)  setMascotState("ANALYZING");
    else if (scrollProgress < 0.64)  setMascotState("RECONSTRUCTING");
    else if (scrollProgress < 0.76)  setMascotState("MATCH_FOUND");
    else if (scrollProgress < 0.93)  setMascotState("REPORTING");
    else                              setMascotState("IDLE");
  }, [scrollProgress, setMascotState]);

  return (
    <div className="relative z-20">

      {/* ═══════════════════════════════════════════════════
          01. HERO
      ═══════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center py-20 px-6 lg:px-12">
        <Hero />
      </section>

      {/* ═══════════════════════════════════════════════════
          02. PROBLEM STATEMENT
      ═══════════════════════════════════════════════════ */}
      <section className="min-h-[80vh] flex items-center justify-center py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div
            style={{
              background: "rgba(8,8,16,0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(230,33,41,0.35)",
              padding: "clamp(32px,5vw,64px)",
              boxShadow: "0 0 80px rgba(230,33,41,0.12), inset 0 0 40px rgba(230,33,41,0.04)",
              position: "relative",
            }}
          >
            {/* Corner decorators */}
            {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls,i)=>(
              <div key={i} className={`absolute ${cls} border-red-500/60 w-5 h-5`} />
            ))}

            <div className="font-mono text-xs tracking-[0.3em] text-red-500/60 mb-4 uppercase">
              // CHALLENGE — IDENTIFIKASI FORENSIK
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 900,
                color: "#E62129",
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "24px",
                filter: "drop-shadow(0 0 30px rgba(230,33,41,0.6))",
              }}
            >
              THE DISGUISE
              <br />
              CHALLENGE
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 18px)",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.75,
                maxWidth: "580px",
                margin: "0 auto 28px",
              }}
            >
              Masker, topi, dan kacamata menyembunyikan identitas. Sistem CCTV
              konvensional{" "}
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>
                gagal total
              </strong>{" "}
              ketika fitur wajah utama tertutup.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid rgba(230,33,41,0.6)",
                background: "rgba(230,33,41,0.1)",
                padding: "10px 24px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#E62129",
                letterSpacing: "0.2em",
                animation: "problem-pulse 2s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#E62129",
                  borderRadius: "50%",
                  animation: "ping-dot 1.5s ease-in-out infinite",
                }}
              />
              TARGET DISGUISED. CHALLENGE ACCEPTED.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          03. SMART CCTV INFRASTRUCTURE
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionCCTV />
      </section>

      {/* ═══════════════════════════════════════════════════
          04. FACE DETECTION ENGINE
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div
            style={{
              maxWidth: "560px",
              marginLeft: "auto",
              background: "rgba(8,8,16,0.8)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0,86,179,0.25)",
              padding: "clamp(24px, 3vw, 48px)",
              boxShadow: "0 0 60px rgba(0,86,179,0.1)",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -1, left: -1, width: 10, height: 10, borderTop: "2px solid #0056B3", borderLeft: "2px solid #0056B3" }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderBottom: "2px solid #0056B3", borderRight: "2px solid #0056B3" }} />

            <div className="font-mono text-[10px] tracking-[0.3em] text-[#0056B3] mb-3 uppercase">
              // SECTION 04 — FACE DETECTION ENGINE
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 900,
                color: "#fff",
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
              }}
            >
              THE{" "}
              <span style={{ color: "#0056B3" }}>EXTRACTION</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
            >
              MTCNN + YOLO mengisolasi target anomali dalam kerumunan padat
              dalam waktu{" "}
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>
                12 milidetik
              </strong>
              , bahkan ketika wajah tertutup sebagian.
            </p>

            {/* Detection stats */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { label: "Detection Speed", val: "< 12ms", color: "#0056B3" },
                { label: "Multi-Face", val: "32 faces", color: "#FFC107" },
                { label: "Occlusion", val: "Supported", color: "#E62129" },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  style={{
                    flex: "1 1 auto",
                    border: `1px solid ${color}30`,
                    background: `${color}08`,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 900, fontSize: "20px", color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: "4px", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#0056B3",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#0056B3",
                  animation: "ping-dot 1s ease-in-out infinite",
                }}
              />
              TARGET LOCKED — INITIATING RECONSTRUCTION
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          05. AI RECONSTRUCTION (VAE V2)
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionAI />
      </section>

      {/* ═══════════════════════════════════════════════════
          06. RECOGNITION & MATCHING (SSIM Counter)
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12 flex flex-col items-center justify-center">
        <div
          className="text-center"
          style={{
            background: "rgba(8,8,16,0.85)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(230,33,41,0.5)",
            padding: "clamp(24px, 4vw, 56px) clamp(32px, 5vw, 80px)",
            boxShadow: "0 0 120px rgba(230,33,41,0.15)",
            position: "relative",
          }}
        >
          {/* Corner decorators */}
          {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls,i)=>(
            <div key={i} className={`absolute ${cls} border-red-500/70 w-6 h-6`} />
          ))}

          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "rgba(230,33,41,0.6)",
              letterSpacing: "0.3em",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            // FACE RECOGNITION — ARCFACE MATCHING
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 900,
              color: "#E62129",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
              filter: "drop-shadow(0 0 30px rgba(230,33,41,0.6))",
            }}
          >
            MATCH FOUND
          </h2>
          <div
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(72px, 14vw, 140px)",
              color: "#fff",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            94.74
            <span style={{ fontSize: "0.4em", color: "#E62129" }}>%</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "rgba(230,33,41,0.7)",
              letterSpacing: "0.3em",
              marginTop: "12px",
              textTransform: "uppercase",
            }}
          >
            STRUCTURAL SIMILARITY INDEX — DPO IDENTIFIED
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          07. SMART CITY NETWORK
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionMap />
      </section>

      {/* ═══════════════════════════════════════════════════
          08. MOBILE INTEGRATION
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionMobile />
      </section>

      {/* ═══════════════════════════════════════════════════
          09. STATISTICS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionStats />
      </section>

      {/* ═══════════════════════════════════════════════════
          10. CALL TO ACTION (FINALE)
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-12">
        <SectionCTA />
      </section>

      <style>{`
        @keyframes problem-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230,33,41,0.2); }
          50%       { box-shadow: 0 0 20px 4px rgba(230,33,41,0.15); }
        }
        @keyframes ping-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
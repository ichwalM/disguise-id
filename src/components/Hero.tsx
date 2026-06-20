"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import MiniCCTV from "./MiniCCTV";

const techBadges = [
  { label: "MTCNN Face Detection", color: "#0056B3" },
  { label: "VAE V2 Reconstruction", color: "#FFC107" },
  { label: "ArcFace + PUSIKNAS", color: "#E62129" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);

  const dots = ".".repeat(tick);

  return (
    <section
      className="relative w-full min-h-screen flex items-center py-20"
      style={{ zIndex: 1 }}
    >
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ── Left content column ── */}
          <div className="order-2 lg:order-1">
            <div className="max-w-full lg:max-w-[620px]">
              {/* Status chip */}
              <div
                className="inline-flex items-center gap-2 mb-8"
                style={{
                  border: "1px solid rgba(0,86,179,0.4)",
                  background: "rgba(0,86,179,0.08)",
                  backdropFilter: "blur(12px)",
                  padding: "7px 16px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#0056B3",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    background: "#E62129",
                    borderRadius: "50%",
                    animation: "hero-ping 1.5s ease-in-out infinite",
                    display: "inline-block",
                  }}
                />
                SISTEM AKTIF — CCTV ONLINE
              </div>

              {/* Main headline */}
              <h1
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "clamp(48px, 6vw, 96px)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  marginBottom: "28px",
                  textTransform: "uppercase",
                }}
              >
                BONGKAR
                <br />
                <span
                  style={{
                    WebkitTextStroke: "2px #0056B3",
                    color: "transparent",
                  }}
                >
                  PENYAMARAN
                </span>
                <br />
                <span style={{ color: "#E62129" }}>WAJAH AI</span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.85,
                  maxWidth: "480px",
                  marginBottom: "32px",
                }}
              >
                Ketika penjahat menyamarkan wajah dengan masker atau kacamata,{" "}
                <strong style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>
                  AI kami merekonstruksi kembali wajah aslinya
                </strong>{" "}
                dari rekaman CCTV secara real-time, lalu mencocokkan dengan
                database DPO POLRI.
              </p>

              {/* Tech badges */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "36px",
                }}
              >
                {techBadges.map(({ label, color }) => (
                  <div
                    key={label}
                    style={{
                      border: `1px solid ${color}40`,
                      background: `${color}10`,
                      padding: "6px 14px",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "48px",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#E62129",
                    color: "#fff",
                    border: "none",
                    padding: "16px 32px",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#c01920";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(230,33,41,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#E62129";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  LIHAT DEMO SISTEM
                  <ArrowRight size={15} />
                </button>
                <Link
                  href="/dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "transparent",
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.2)",
                    padding: "16px 32px",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,86,179,0.8)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,86,179,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <Shield size={15} />
                  COMMAND CENTER
                </Link>
              </div>

              {/* Stats bar */}
              <div
                style={{
                  display: "flex",
                  gap: "32px",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  paddingTop: "24px",
                }}
              >
                {[
                  { val: "94.74%", label: "SSIM ACCURACY" },
                  { val: "<50ms", label: "LATENCY" },
                  { val: "96.4%", label: "MATCH RATE" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontWeight: 900,
                        fontSize: "22px",
                        color: "#FFC107",
                        lineHeight: 1,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.15em",
                        marginTop: "4px",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: Mini CCTV 3D ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[400px]">
              {/* Miniatur CCTV Container dengan efek glassmorphism */}
              <div
                style={{
                  background: "rgba(10,10,20,0.5)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(0,86,179,0.2)",
                  padding: "24px",
                  boxShadow: "0 0 60px rgba(0,86,179,0.15), inset 0 0 30px rgba(0,86,179,0.05)",
                }}
              >
                <MiniCCTV />
                {/* Label di bawah CCTV */}
                <div className="text-center mt-4">
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: "#0056B3",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    KAMERA PENGAMAN
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── HUD top-right ── */}
      {mounted && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            right: "24px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "5px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(0,86,179,0.5)",
            letterSpacing: "0.12em",
          }}
        >
          <div>SYS_VER: 2.6.1</div>
          <div>MODEL: vae_nusantara_best_v2.pth</div>
          <div>CAM_ONLINE: 512</div>
          <div style={{ color: "rgba(230,33,41,0.65)" }}>
            SCANNING{dots}
          </div>
        </div>
      )}

      {/* ── Scroll hint ── */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.2em",
          animation: "hero-bounce 2s ease-in-out infinite",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        SCROLL
      </div>

      <style>{`
        @keyframes hero-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes hero-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}

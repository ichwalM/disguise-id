"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Eye, Cpu, Database, ArrowDown } from "lucide-react";
import Image from "next/image";
import HeroMascotScene from "./3d/HeroMascotScene";

const features = [
  { icon: Eye, label: "Live CCTV Scan", color: "#0056B3" },
  { icon: Cpu, label: "U-Net VAE Inpainting", color: "#FFC107" },
  { icon: Database, label: "PUSIKNAS POLRI Match", color: "#E62129" },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#080810",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ── Grid background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0,86,179,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,179,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Left blue glow ── */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-15%",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(0,86,179,0.22) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Right red glow ── */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "0",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(230,33,41,0.18) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── CRT scanlines ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "100px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        {/* ──── LEFT COLUMN — Text ──── */}
        <div>
          {/* Status chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              border: "1px solid rgba(0,86,179,0.5)",
              background: "rgba(0,86,179,0.1)",
              backdropFilter: "blur(12px)",
              padding: "6px 16px",
              marginBottom: "32px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#0056B3",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "#E62129",
                borderRadius: "50%",
                display: "inline-block",
                animation: "dg-ping 1.5s ease-in-out infinite",
              }}
            />
            SISTEM AKTIF — CCTV ONLINE
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(48px, 6.5vw, 86px)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            BONGKAR<br />
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
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.8,
              maxWidth: "480px",
              marginBottom: "32px",
            }}
          >
            Ketika penjahat menyamarkan wajah dengan masker atau kacamata,{" "}
            <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              AI kami merekonstruksi kembali wajah aslinya
            </strong>{" "}
            dari rekaman CCTV secara real-time, lalu mencocokkan dengan database DPO POLRI.
          </p>

          {/* Feature chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
            {features.map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: `1px solid ${color}40`,
                  background: `${color}10`,
                  padding: "8px 14px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color,
                  letterSpacing: "0.08em",
                }}
              >
                <Icon size={13} />
                {label}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "48px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#E62129",
                color: "#fff",
                border: "none",
                padding: "15px 30px",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              LIHAT DEMO SISTEM
              <ArrowRight size={16} />
            </button>
            <a
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "transparent",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.25)",
                padding: "15px 30px",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.7)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)")}
            >
              COMMAND CENTER
            </a>
          </div>

          {/* SSIM accuracy badge */}
          <div
            style={{
              display: "inline-flex",
              gap: "24px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
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
                    color: "rgba(255,255,255,0.35)",
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

        {/* ──── RIGHT COLUMN — Mascot 3D ──── */}
        <div
          style={{
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {mounted && <HeroMascotScene scrollY={scrollY} />}
        </div>
      </div>

      {/* ── HUD top-right ── */}
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
          color: "rgba(0,86,179,0.55)",
          letterSpacing: "0.12em",
        }}
      >
        <div>SYS_VER: 2.6.1</div>
        <div>MODEL: vae_nusantara_best_v2.pth</div>
        <div>CAM_ONLINE: 512</div>
        <div style={{ color: "rgba(230,33,41,0.65)" }}>SCANNING...</div>
      </div>

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
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.2em",
          animation: "dg-bounce 2s ease-in-out infinite",
        }}
      >
        <ArrowDown size={18} />
        SCROLL
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes dg-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes dg-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}

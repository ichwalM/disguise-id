"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Cpu,
  Database,
  Shield,
  ShieldAlert,
  ScanLine,
  Check,
  AlertTriangle,
  MapPin,
  Activity,
  Terminal,
  ArrowDown,
} from "lucide-react";

// Indonesia map nodes
const mapNodes = [
  { id: "MKS", city: "Makassar", x: 68, y: 60, active: true, dpo: true },
  { id: "JKT", city: "Jakarta", x: 38, y: 52, active: true, dpo: false },
  { id: "SBY", city: "Surabaya", x: 52, y: 58, active: true, dpo: false },
  { id: "MDN", city: "Medan", x: 22, y: 28, active: true, dpo: false },
  { id: "BDG", city: "Bandung", x: 40, y: 55, active: false, dpo: false },
  { id: "PLB", city: "Palembang", x: 33, y: 54, active: true, dpo: false },
  { id: "MND", city: "Manado", x: 79, y: 38, active: true, dpo: false },
  { id: "BLI", city: "Bali", x: 60, y: 65, active: true, dpo: false },
];

export default function ScrollytellingLandingPage() {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalScrollable = scrollHeight - windowHeight;
      const pct = totalScrollable > 0 ? scrollY / totalScrollable : 0;
      setProgress(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Time tracking for idle rotation
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      setTime((timestamp - start) / 1000);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Scrolling to specific stage on timeline dot click
  const scrollToStage = (stageNum: number) => {
    const percentages = [0.0, 0.25, 0.49, 0.70, 0.86, 0.98];
    const targetPct = percentages[stageNum];
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const totalScrollable = scrollHeight - windowHeight;
    window.scrollTo({
      top: totalScrollable * targetPct,
      behavior: "smooth",
    });
  };

  // Helper to calculate active stage
  const getActiveStage = () => {
    if (progress < 0.15) return 0; // Hero
    if (progress < 0.38) return 1; // Face Detection
    if (progress < 0.60) return 2; // VAE Inpainting
    if (progress < 0.80) return 3; // SSIM Accuracy
    if (progress < 0.92) return 4; // Map
    return 5; // CTA
  };

  const activeStage = getActiveStage();

  // Mascot dynamic transitions:
  // - Starts at right column position (translateX(250px)) during Stage 0 (Hero)
  // - Slides smoothly to center (translateX(0)) as user scrolls to Stage 1
  // - Fades out completely in Stage 5 (Logo transition)
  const mascotX = progress < 0.15 ? (1 - progress / 0.15) * 220 : 0;
  const mascotScale = progress >= 0.92 ? Math.max(0, 1 - (progress - 0.92) * 12) : 1;
  const logoScale = progress >= 0.92 ? Math.min(1, (progress - 0.92) * 12) : 0;

  // Mascot Y rotation combined scroll and slow idle spin
  const mascotRotY = time * 15 + progress * 720;

  // Helper to compute side text styles based on scroll progress
  const getBlockStyle = (stageNum: number): React.CSSProperties => {
    let opacity = 0;
    let translateY = 40;
    let pointerEvents: "auto" | "none" = "none";

    const stages = [
      { start: 0, peak: 0.0, end: 0.15, slope: 8 },
      { start: 0.15, peak: 0.26, end: 0.38, slope: 8 },
      { start: 0.38, peak: 0.49, end: 0.60, slope: 8 },
      { start: 0.60, peak: 0.70, end: 0.80, slope: 8 },
      { start: 0.80, peak: 0.86, end: 0.92, slope: 14 },
      { start: 0.92, peak: 0.97, end: 1.0, slope: 14 },
    ];

    const s = stages[stageNum];
    if (progress >= s.start && progress <= s.end) {
      const diff = progress - s.peak;
      opacity = Math.max(0, 1 - Math.abs(diff) * s.slope);
      translateY = diff * -150; // smooth sliding parallax
      pointerEvents = opacity > 0.3 ? "auto" : "none";
    }

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents,
      width: "100%",
    };
  };

  // Holographic Panel Styles based on active ranges
  const showPanel1 = progress >= 0.15 && progress < 0.38;
  const showPanel2 = progress >= 0.38 && progress < 0.60;
  const showPanel3 = progress >= 0.60 && progress < 0.80;
  const showPanel4 = progress >= 0.80 && progress < 0.92;

  return (
    <div
      style={{
        position: "relative",
        height: "600vh", // 6 segments of 100vh
        backgroundColor: "#080810",
      }}
    >
      {/* ── STICKY VIEWPORT CONTAINER ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Cyber grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,86,179,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,179,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            zIndex: 0,
          }}
        />

        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(0,86,179,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(230,33,41,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* CRT Scanline effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 4px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* HUD Statistics Overlay (Top Right) */}
        <div
          style={{
            position: "absolute",
            top: "90px",
            right: "32px",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(0,86,179,0.6)",
            letterSpacing: "0.15em",
          }}
        >
          <div>SYS_VER: 2.6.1</div>
          <div>MODEL: vae_nusantara_best_v2.pth</div>
          <div>CAMS_ONLINE: 512</div>
          <div style={{ color: activeStage === 5 ? "#0056B3" : "#E62129", fontWeight: 700 }}>
            {activeStage === 5 ? "GRID ACTIVE // SYSTEM SECURED" : "SCANNING PUBLIC AREA..."}
          </div>
        </div>

        {/* ── SIDE TIMELINE DOTS NAVIGATOR ── */}
        <div
          style={{
            position: "fixed",
            left: "32px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 50,
          }}
        >
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.05)", zIndex: 0 }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              width: "2px",
              background: "#0056B3",
              height: `${progress * 100}%`,
              maxHeight: "100%",
              zIndex: 1,
            }}
          />
          {[
            "Intro / Hero",
            "Face Detection",
            "VAE Reconstruction",
            "Accuracy Details",
            "Smart City Map",
            "System Action",
          ].map((label, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={label}
                onClick={() => scrollToStage(idx)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isActive ? (idx % 2 === 0 ? "#FFC107" : "#E62129") : "rgba(255,255,255,0.2)",
                  border: isActive ? "2px solid #080810" : "none",
                  boxShadow: isActive ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                  cursor: "pointer",
                  zIndex: 2,
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
                title={label}
              >
                {/* Floating indicator text */}
                <div
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "9px",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAIN CONTENT LAYOUT GRID ── */}
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 48px",
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* ──── LEFT BLOCK COLUMN ──── */}
          <div
            style={{
              width: "42%",
              height: "450px",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Stage 0: Hero Text */}
            <div style={getBlockStyle(0)}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid rgba(0,86,179,0.5)",
                  background: "rgba(0,86,179,0.1)",
                  padding: "5px 12px",
                  marginBottom: "24px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#0056B3",
                  letterSpacing: "0.15em",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#E62129",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "ping-glow 1.5s infinite",
                  }}
                />
                DPO MONITORING — ONLINE
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "58px",
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                BONGKAR<br />
                <span style={{ WebkitTextStroke: "2px #0056B3", color: "transparent" }}>PENYAMARAN</span><br />
                <span style={{ color: "#E62129" }}>WAJAH AI</span>
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.75,
                  marginBottom: "32px",
                }}
              >
                Sistem Digital Forensik berbasis kecerdasan buatan untuk merekonstruksi kembali fitur wajah pelaku DPO yang tertutup masker atau kacamata dari rekaman CCTV secara real-time.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link
                  href="/dashboard"
                  style={{
                    background: "#E62129",
                    color: "#fff",
                    padding: "14px 28px",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                >
                  COMMAND CENTER
                </Link>
                <button
                  onClick={() => scrollToStage(1)}
                  style={{
                    border: "2px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#fff",
                    padding: "12px 28px",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  CARA KERJA
                </button>
              </div>
            </div>

            {/* Stage 1: Face Detection (MTCNN) Text */}
            <div style={getBlockStyle(1)}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#0056B3", letterSpacing: "0.2em", marginBottom: "12px" }}>
                // TAHAP 01 — DETECTION
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "40px", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "16px", lineHeight: 1.1 }}>
                LIVE CCTV<br />
                <span style={{ color: "#0056B3" }}>FACE SCANNING</span>
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "24px" }}>
                Stream video CCTV diurai secara real-time oleh model **MTCNN** (Multi-task Cascaded Convolutional Networks). AI mendeteksi keberadaan wajah manusia di ruang publik meskipun tertutup masker, topi, atau kacamata dalam waktu <strong style={{ color: "#fff" }}>&lt;50ms</strong>.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["RTSP FEED", "EDGE INFERENCE", "MULTI-FACE TRACKING"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "#0056B3", border: "1px solid rgba(0,86,179,0.3)", padding: "4px 10px", background: "rgba(0,86,179,0.05)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage 2: AI Inpainting Text */}
            <div style={getBlockStyle(2)}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#FFC107", letterSpacing: "0.2em", marginBottom: "12px" }}>
                // TAHAP 02 — RECONSTRUCTION
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "40px", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "16px", lineHeight: 1.1 }}>
                AI INPAINTING<br />
                <span style={{ color: "#FFC107" }}>U-NET VAE V2</span>
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "24px" }}>
                Fitur kunci wajah yang terhalang sensor (masker, kacamata hitam) dibangun ulang secara anatomis oleh **U-Net VAE Nusantara**. VAE merekonstruksi hidung, mulut, dan garis rahang berdasarkan pola wajah ras Asia Tenggara untuk akurasi maksimal.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["U-NET DECODER", "LATENT SPACE VAE", "NUSANTARA DATASET"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "#FFC107", border: "1px solid rgba(255,193,7,0.3)", padding: "4px 10px", background: "rgba(255,193,7,0.05)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage 4: Smart City Map Text */}
            <div style={getBlockStyle(4)}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#0056B3", letterSpacing: "0.2em", marginBottom: "12px" }}>
                // TAHAP 04 — MONITORING GRID
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "40px", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "16px", lineHeight: 1.1 }}>
                SURVEILLANCE<br />
                <span style={{ color: "#0056B3" }}>NATIONAL GRID</span>
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "24px" }}>
                Sistem terintegrasi secara nasional dengan **512+ kamera CCTV** aktif di kota-kota besar Indonesia. Begitu DPO teridentifikasi dengan akurasi kecocokan tinggi, peringatan instan dikirim ke sistem komando PUSIKNAS POLRI.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["JAKARTA NODE", "SURABAYA NODE", "MAKASSAR NODE"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "#0056B3", border: "1px solid rgba(0,86,179,0.3)", padding: "4px 10px", background: "rgba(0,86,179,0.05)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ──── MIDDLE AREA: MASCOT + STICKY PANEL SCENE ──── */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "640px",
              height: "640px",
              transform: `translate(-50%, -50%) translateX(${mascotX}px)`,
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* concentrics orbit rings behind mascot */}
            {progress < 0.92 && (
              <>
                {[140, 200, 260].map((r, i) => (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      width: `${r * 2}px`,
                      height: `${r * 2}px`,
                      border: `1px solid ${
                        ["rgba(0,86,179,0.3)", "rgba(255,193,7,0.25)", "rgba(230,33,41,0.2)"][i]
                      }`,
                      borderRadius: "50%",
                      animation: `spin-orbit ${10 + i * 4}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                      transform: "rotateX(75deg)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                ))}
                {/* Radar Line Sweep */}
                <div style={{ position: "absolute", width: "320px", height: "320px", borderRadius: "50%", overflow: "hidden", pointerEvents: "none", zIndex: 3 }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "160px",
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(0,86,179,0.5), transparent)",
                      transformOrigin: "left center",
                      animation: "radar-sweep 4s linear infinite",
                    }}
                  />
                </div>
              </>
            )}

            {/* Glowing backdrop circle */}
            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,86,179,0.18) 0%, rgba(230,33,41,0.06) 50%, transparent 70%)",
                filter: "blur(20px)",
                animation: "glow-pulse 4s ease-in-out infinite alternate",
                zIndex: 1,
              }}
            />

            {/* ───── 3D MASCOT CONTAINER ───── */}
            <div
              style={{
                transform: `scale(${mascotScale})`,
                opacity: mascotScale,
                transformStyle: "preserve-3d",
                perspective: "1000px",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  transform: `rotateY(${mascotRotY % 360}deg) rotateX(-6deg)`,
                  transformStyle: "preserve-3d",
                  animation: "mascot-float 4.5s ease-in-out infinite",
                  filter: "drop-shadow(0 20px 50px rgba(0,86,179,0.55)) drop-shadow(0 0 20px rgba(230,33,41,0.25))",
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/images/maskot.svg"
                  alt="DISGUISE-ID Fox Mascot"
                  width={280}
                  height={330}
                  priority
                  style={{ objectFit: "contain", width: "280px", height: "auto" }}
                />

                {/* Shadow under mascot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "50%",
                    transform: "translateX(-50%) rotateX(85deg)",
                    width: "140px",
                    height: "30px",
                    background: "radial-gradient(ellipse, rgba(0,86,179,0.4) 0%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              </div>
            </div>

            {/* ───── PANEL 1: FACE DETECTION (MTCNN) ───── */}
            <div
              style={{
                position: "absolute",
                zIndex: 25,
                width: "230px",
                background: "rgba(8, 8, 16, 0.92)",
                border: "2px solid #0056B3",
                boxShadow: "0 0 25px rgba(0, 86, 179, 0.3), inset 0 0 10px rgba(0, 86, 179, 0.1)",
                padding: "12px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#fff",
                opacity: showPanel1 ? 1 : 0,
                transform: showPanel1
                  ? "translate(250px, -80px) scale(1)"
                  : progress >= 0.38
                  ? "translate(300px, -120px) scale(0.8)"
                  : "translate(0px, 20px) scale(0.1)",
                pointerEvents: showPanel1 ? "auto" : "none",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,86,179,0.3)", paddingBottom: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", color: "#0056B3", fontWeight: 900 }}>[MTCNN_FACE_SCAN]</span>
                <span style={{ width: "6px", height: "6px", background: "#E62129", borderRadius: "50%", animation: "ping-glow 1s infinite" }} />
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", marginBottom: "8px" }}>
                Face detection bounding box scanning RTSP Feed.
              </div>
              <div style={{ background: "rgba(0,86,179,0.1)", border: "1px solid rgba(0,86,179,0.2)", padding: "6px", fontSize: "10px" }}>
                <div style={{ color: "#0056B3", fontWeight: 700 }}>STATUS: FACE DETECTED</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>X: 142 Y: 89 W: 56 H: 56</div>
                <div style={{ color: "#FFC107", marginTop: "2px" }}>OCCLUSION: MASK (88%)</div>
              </div>
            </div>

            {/* ───── PANEL 2: VAE RECONSTRUCTION (INPAINTING) ───── */}
            <div
              style={{
                position: "absolute",
                zIndex: 25,
                width: "240px",
                background: "rgba(8, 8, 16, 0.92)",
                border: "2px solid #FFC107",
                boxShadow: "0 0 25px rgba(255, 193, 7, 0.25), inset 0 0 10px rgba(255, 193, 7, 0.1)",
                padding: "12px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#fff",
                opacity: showPanel2 ? 1 : 0,
                transform: showPanel2
                  ? "translate(260px, 90px) scale(1)"
                  : progress >= 0.60
                  ? "translate(310px, 140px) scale(0.8)"
                  : "translate(0px, 20px) scale(0.1)",
                pointerEvents: showPanel2 ? "auto" : "none",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,193,7,0.3)", paddingBottom: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", color: "#FFC107", fontWeight: 900 }}>[U-NET_VAE_INPAINT]</span>
                <span style={{ fontSize: "9px", color: "#FFC107" }} className="animate-pulse">LATENT</span>
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", marginBottom: "10px" }}>
                Reconstructing hidden occlusion areas dynamically.
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ flex: 1, height: "45px", background: "rgba(255,255,255,0.03)", border: "1px solid #333", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "8px", position: "relative" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#222", border: "1.5px solid #444", position: "relative" }}>
                    <div style={{ position: "absolute", bottom: 0, width: "100%", height: "50%", background: "#444" }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>MASKED</span>
                </div>
                <span style={{ color: "#FFC107", fontWeight: 900 }}>→</span>
                <div style={{ flex: 1, height: "45px", background: "rgba(0,86,179,0.05)", border: "1px solid #0056B3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "radial-gradient(circle, #0056B3 0%, transparent 80%)", border: "1.5px solid #0056B3" }} />
                  <span style={{ color: "#0056B3", marginTop: "2px", fontWeight: 700 }}>RECON</span>
                </div>
              </div>
              <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "94.74%", background: "#FFC107", animation: "progress-fill 2s linear infinite" }} />
              </div>
            </div>

            {/* ───── PANEL 3: 94.74% SSIM ACCURACY ───── */}
            <div
              style={{
                position: "absolute",
                zIndex: 25,
                width: "220px",
                background: "rgba(8, 8, 16, 0.92)",
                border: "2px solid #E62129",
                boxShadow: "0 0 25px rgba(230, 33, 41, 0.25), inset 0 0 10px rgba(230, 33, 41, 0.1)",
                padding: "12px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#fff",
                opacity: showPanel3 ? 1 : 0,
                transform: showPanel3
                  ? "translate(-360px, -40px) scale(1)"
                  : progress >= 0.80
                  ? "translate(-420px, -80px) scale(0.8)"
                  : "translate(0px, 20px) scale(0.1)",
                pointerEvents: showPanel3 ? "auto" : "none",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(230,33,41,0.3)", paddingBottom: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", color: "#E62129", fontWeight: 900 }}>[SSIM_ACCURACY]</span>
                <ShieldAlert size={12} color="#E62129" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, fontFamily: "var(--font-space-grotesk), sans-serif", color: "#fff", lineHeight: 1, display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "2px" }}>
                94.74<span style={{ fontSize: "16px", color: "#E62129" }}>%</span>
              </div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Structural Similarity Index
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "2px", fontSize: "9px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>LATENCY:</span><span style={{ color: "#FFC107", fontWeight: 700 }}>&lt;50ms</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>DPO MATCH:</span><span style={{ color: "#0056B3", fontWeight: 700 }}>96.4% ACC</span></div>
              </div>
            </div>

            {/* ───── PANEL 4: HOLOGRAPHIC INDONESIA MAP ───── */}
            <div
              style={{
                position: "absolute",
                zIndex: 25,
                width: "480px",
                height: "260px",
                background: "rgba(8, 8, 16, 0.9)",
                border: "2px solid #0056B3",
                boxShadow: "0 0 35px rgba(0, 86, 179, 0.4), inset 0 0 20px rgba(0, 86, 179, 0.15)",
                padding: "16px",
                left: "50%",
                transformOrigin: "top center",
                opacity: showPanel4 ? 1 : 0,
                transform: showPanel4
                  ? "translate(-50%, 120px) rotateX(55deg) rotateZ(-12deg) scale(1)"
                  : progress >= 0.92
                  ? "translate(-50%, 180px) rotateX(75deg) rotateZ(-12deg) scale(0.6)"
                  : "translate(-50%, 20px) rotateX(0deg) scale(0.1)",
                pointerEvents: showPanel4 ? "auto" : "none",
                transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden",
              }}
            >
              {/* Map Title Grid */}
              <div style={{ position: "absolute", top: "12px", left: "16px", display: "flex", gap: "8px", alignItems: "center", zIndex: 10, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px" }}>
                <Activity size={10} color="#E62129" className="animate-pulse" />
                <span style={{ color: "rgba(255,255,255,0.5)" }}>POLRI SURVEILLANCE GRID // ACTIVE: 512 CAMERAS</span>
              </div>

              {/* Holographic connection lines */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 50" preserveAspectRatio="none">
                {mapNodes.filter(n => n.active).map((from) =>
                  mapNodes.filter(n => n.active && n.id !== from.id).slice(0, 2).map((to) => (
                    <line
                      key={`${from.id}-${to.id}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#0056B3"
                      strokeWidth="0.25"
                      strokeOpacity={0.6}
                      strokeDasharray="0.8 0.8"
                    />
                  ))
                )}
              </svg>

              {/* Map Dotted nodes */}
              {mapNodes.map((node, i) => (
                <div
                  key={node.id}
                  style={{
                    position: "absolute",
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {node.active && (
                    <div
                      style={{
                        position: "absolute",
                        width: "16px",
                        height: "16px",
                        border: `1px solid ${node.dpo ? "#E62129" : "#0056B3"}`,
                        borderRadius: "50%",
                        animation: "ping-glow 1.5s infinite",
                        left: "-6px",
                        top: "-6px",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: node.dpo ? "#E62129" : node.active ? "#0056B3" : "#333",
                      borderRadius: "1px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "7px",
                      color: node.dpo ? "#E62129" : "#0056B3",
                      fontWeight: 700,
                    }}
                  >
                    {node.id}
                  </div>
                </div>
              ))}
            </div>

            {/* ───── STAGE 5: LOGO TRANSITION (CENTER) ───── */}
            <div
              style={{
                position: "absolute",
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${logoScale})`,
                opacity: logoScale,
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: progress >= 0.92 ? "auto" : "none",
              }}
            >
              {/* Massive Glowing Logo */}
              <div
                style={{
                  position: "relative",
                  width: "180px",
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "logo-glow-breath 3s ease-in-out infinite alternate",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle, rgba(0,86,179,0.3) 0%, rgba(230,33,41,0.1) 50%, transparent 70%)",
                    filter: "blur(20px)",
                    borderRadius: "50%",
                  }}
                />
                <Image
                  src="/images/logo.png"
                  alt="DISGUISE-ID"
                  width={140}
                  height={140}
                  style={{ objectFit: "contain", zIndex: 5 }}
                />
              </div>
            </div>
          </div>

          {/* ──── RIGHT BLOCK COLUMN (FOR STAGE 3 STATS) ──── */}
          <div
            style={{
              width: "38%",
              marginLeft: "auto",
              height: "450px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {/* Stage 3: SSIM Accuracy & Stats Text */}
            <div style={getBlockStyle(3)}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#E62129", letterSpacing: "0.2em", marginBottom: "12px" }}>
                // TAHAP 03 — METRICS
              </div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "40px", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "16px", lineHeight: 1.1 }}>
                RECONSTRUCTION<br />
                <span style={{ color: "#E62129" }}>METRICS & ACCURACY</span>
              </h2>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "28px" }}>
                AI Nusantara diuji secara ketat untuk mencegah deteksi salah. Menggunakan **SSIM** (Structural Similarity Index) sebagai parameter penilaian akurasi konstruksi kemiripan wajah yang direkonstruksi dengan wajah asli.
              </p>

              {/* Counters Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { value: "94.74%", label: "SSIM ACCURACY", color: "#FFC107" },
                  { value: "96.4%", label: "MATCH ACCURACY", color: "#E62129" },
                  { value: "<50ms", label: "LATENCY SPEED", color: "#0056B3" },
                  { value: "512", label: "CCTV CAMERAS", color: "#0056B3" },
                ].map((item) => (
                  <div key={item.label} style={{ borderLeft: `2px solid ${item.color}`, paddingLeft: "10px" }}>
                    <div style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff" }}>
                      {item.value}
                    </div>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px", letterSpacing: "0.1em" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ──── STAGE 5: CENTERED CTA TEXT BLOCK ──── */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "65%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
              zIndex: 30,
              pointerEvents: progress >= 0.92 ? "auto" : "none",
              opacity: progress >= 0.92 ? Math.min(1, (progress - 0.92) * 12) : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "24px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              DISGUISE<span style={{ color: "#0056B3" }}>-ID</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "32px",
              }}
            >
              BONGKAR PENYAMARAN • IDENTIFIKASI DPO • REAL-TIME AI
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "40px" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fff",
                  color: "#080810",
                  padding: "16px 36px",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 900,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                }}
              >
                COMMAND CENTER
                <ArrowRight size={14} />
              </Link>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  background: "transparent",
                  color: "#fff",
                  padding: "14px 36px",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 900,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                <Shield size={14} />
                REQUEST DEMO
              </button>
            </div>

            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              © 2026 DISGUISE-ID — INTEGRASI PUSIKNAS POLRI — ALL RIGHTS RESERVED
            </div>
          </div>
        </div>

        {/* ── SCROLL HINT (BOTTOM CENTER) ── */}
        {progress < 0.9 && (
          <div
            style={{
              position: "absolute",
              bottom: "28px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "9px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em",
              animation: "bounce-hint 2s infinite",
            }}
          >
            <ArrowDown size={14} />
            SCROLL UNTUK DETEKSI AI
          </div>
        )}
      </div>

      {/* ── CSS KEYFRAMES INJECTED INLINE ── */}
      <style>{`
        @keyframes spin-orbit {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          from { opacity: 0.6; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.08); }
        }
        @keyframes mascot-float {
          0%, 100% { transform: rotateY(var(--ry, 0deg)) rotateX(-6deg) translateY(0px); }
          50% { transform: rotateY(var(--ry, 0deg)) rotateX(-6deg) translateY(-14px); }
        }
        @keyframes logo-glow-breath {
          from { filter: drop-shadow(0 0 10px rgba(0,86,179,0.5)); transform: scale(1); }
          to { filter: drop-shadow(0 0 35px rgba(230,33,41,0.7)); transform: scale(1.05); }
        }
        @keyframes ping-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }
        @keyframes bounce-hint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 94.74%; }
        }
      `}</style>
    </div>
  );
}

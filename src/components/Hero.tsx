"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Eye, Cpu, Database, ArrowDown } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import HeroMascot2D from "./HeroMascot2D";

const features = [
  { icon: Eye, label: "Live CCTV Scan", color: "#0056B3" },
  { icon: Cpu, label: "U-Net VAE Inpainting", color: "#FFC107" },
  { icon: Database, label: "PUSIKNAS POLRI Match", color: "#E62129" },
];

const stats = [
  { val: "94.74%", label: "SSIM ACCURACY" },
  { val: "<50ms", label: "LATENCY" },
  { val: "96.4%", label: "MATCH RATE" },
];

// Stagger children animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const spotlightX = useSpring(useTransform(mouseX, (x) => x - 300), { stiffness: 100, damping: 25 });
  const spotlightY = useSpring(useTransform(mouseY, (y) => y - 300), { stiffness: 100, damping: 25 });

  return (
    <section
      id="home"
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

      {/* ── Animated scan line ── */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "120vh" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0,86,179,0.6) 30%, rgba(230,33,41,0.4) 70%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Left blue glow ── */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.22, 0.3, 0.22] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.25, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
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

      {/* ── Dynamic Mouse Spotlight ── */}
      {mounted && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(0,86,179,0.15) 0%, transparent 60%)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 1,
            x: spotlightX,
            y: spotlightY,
          }}
        />
      )}

      {/* ── Main content ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "100px 32px 80px",
        }}
      >
        {/* ──── LEFT COLUMN — Text ──── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status chip */}
          <motion.div variants={itemVariants}>
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
          </motion.div>

          {/* Main headline with glitch */}
          <motion.div variants={itemVariants}>
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
              <span
                style={{ display: "block", color: "#ffffff" }}
              >
                BONGKAR
              </span>
              <span
                style={{
                  display: "block",
                  WebkitTextStroke: "2px #0056B3",
                  color: "transparent",
                }}
              >
                PENYAMARAN
              </span>
              <span style={{ display: "block", color: "#E62129", position: "relative" }}>
                WAJAH AI
                <span
                  style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    color: "#E62129",
                    background: "#080810",
                    animation: "cyber-glitch 3s infinite linear alternate-reverse",
                    zIndex: 2,
                  }}
                  aria-hidden="true"
                >
                  WAJAH AI
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
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
          </motion.div>

          {/* Feature chips */}
          <motion.div variants={itemVariants}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
              {features.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.04, boxShadow: `0 0 16px ${color}40` }}
                  transition={{ duration: 0.2 }}
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
                    cursor: "default",
                  }}
                >
                  <Icon size={13} />
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "48px" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(230,33,41,0.5)" }}
                whileTap={{ scale: 0.97 }}
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
                  transition: "all 0.2s",
                }}
              >
                LIHAT DEMO SISTEM
                <ArrowRight size={16} />
              </motion.button>
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.7)" }}
                whileTap={{ scale: 0.97 }}
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
                  transition: "all 0.2s",
                }}
              >
                COMMAND CENTER
              </motion.a>
            </div>
          </motion.div>

          {/* SSIM accuracy badge */}
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: "inline-flex",
                gap: "24px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "24px",
              }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ──── RIGHT COLUMN — Mascot 3D ──── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Decorative corner brackets */}
          <div style={{ position: "absolute", inset: "20px", pointerEvents: "none" }}>
            {/* TL */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "30px", height: "30px", borderTop: "2px solid rgba(0,86,179,0.4)", borderLeft: "2px solid rgba(0,86,179,0.4)" }} />
            {/* TR */}
            <div style={{ position: "absolute", top: 0, right: 0, width: "30px", height: "30px", borderTop: "2px solid rgba(0,86,179,0.4)", borderRight: "2px solid rgba(0,86,179,0.4)" }} />
            {/* BL */}
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "30px", height: "30px", borderBottom: "2px solid rgba(230,33,41,0.4)", borderLeft: "2px solid rgba(230,33,41,0.4)" }} />
            {/* BR */}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "30px", height: "30px", borderBottom: "2px solid rgba(230,33,41,0.4)", borderRight: "2px solid rgba(230,33,41,0.4)" }} />
          </div>
          {/* HUD label */}
          <div style={{ position: "absolute", top: "24px", left: "32px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(0,86,179,0.5)", letterSpacing: "0.2em" }}>
            SUBJECT_SCAN_3D
          </div>
          {mounted && <HeroMascot2D scrollY={scrollY} />}
        </motion.div>
      </div>

      {/* ── HUD top-right ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
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
        <div style={{ color: "rgba(230,33,41,0.65)", animation: "hud-blink 1.2s step-end infinite" }}>SCANNING...</div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
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
      </motion.div>

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
        @keyframes cyber-glitch {
          0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(30% 0 60% 0); transform: translate(-2px, -2px); }
          60% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 2px); }
          80% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
          100% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -2px); }
        }
      `}</style>
    </section>
  );
}

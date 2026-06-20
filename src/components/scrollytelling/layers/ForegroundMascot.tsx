"use client";

import { useMascotStore } from "@/store/useMascotStore";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";

/* ─── Hologram Panel Definitions per FSM State ─── */
const HOLOGRAM_PANELS: Record<string, { title: string; sub: string; color: string; icon: string } | null> = {
  IDLE: null,
  PROBLEM: {
    title: "CHALLENGE",
    sub: "Identity disguised",
    color: "#E62129",
    icon: "⚠️",
  },
  SCANNING: {
    title: "CCTV ONLINE",
    sub: "512 cameras active",
    color: "#0056B3",
    icon: "📡",
  },
  ANALYZING: {
    title: "MTCNN DETECT",
    sub: "Face extraction < 12ms",
    color: "#0056B3",
    icon: "🔍",
  },
  RECONSTRUCTING: {
    title: "VAE V2 ACTIVE",
    sub: "SSIM target: 94.74%",
    color: "#FFC107",
    icon: "🧠",
  },
  MATCH_FOUND: {
    title: "94.74% SSIM",
    sub: "TARGET IDENTIFIED",
    color: "#E62129",
    icon: "✅",
  },
  REPORTING: {
    title: "ALERT SENT",
    sub: "Mobile units notified",
    color: "#0056B3",
    icon: "📱",
  },
};

/* ─── Mascot X/Y offset per state ─── */
const MASCOT_POSITIONS: Record<string, { x: number; y: number; scale: number; rotate: number }> = {
  IDLE:          { x: 0,    y: 0,   scale: 0.7,    rotate: 0  },
  PROBLEM:       { x: -20,  y: 10,  scale: 0.65,  rotate: 5  },
  SCANNING:      { x: 0,    y: -10, scale: 0.68, rotate: 0  },
  ANALYZING:     { x: 10,   y: 0,   scale: 0.7,    rotate: -2 },
  RECONSTRUCTING:{ x: 15,   y: -5,  scale: 0.75, rotate: 0  },
  MATCH_FOUND:   { x: 0,    y: -30, scale: 0.9,  rotate: 0  },
  REPORTING:     { x: -30,  y: 0,   scale: 0.65,  rotate: 0  },
};

/* ─── Particle config ─── */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 1.5 + (i % 3),
  color: ["#0056B3", "#E62129", "#FFC107", "#00d4ff"][i % 4],
  delay: i * 0.5,
  duration: 4 + (i % 4),
  angle: (i / 12) * 360,
  radius: 110 + (i % 3) * 20,
}));

export default function ForegroundMascot() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const eyeLeftRef = useRef<HTMLDivElement>(null);
  const eyeRightRef = useRef<HTMLDivElement>(null);

  const currentState = useMascotStore((s) => s.currentState);
  const scrollProgress = useMascotStore((s) => s.scrollProgress);

  const panel = HOLOGRAM_PANELS[currentState];
  const pos = MASCOT_POSITIONS[currentState] ?? MASCOT_POSITIONS.IDLE;

  /* ── Mascot GSAP positional animation on state change ── */
  useEffect(() => {
    if (!mascotRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(mascotRef.current, {
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        rotation: pos.rotate,
        duration: 0.7,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, [currentState, pos.x, pos.y, pos.scale, pos.rotate]);

  /* ── Eye color / squint on state change ── */
  useEffect(() => {
    if (!eyeLeftRef.current || !eyeRightRef.current) return;
    const isProblem = currentState === "PROBLEM";
    const isMatch = currentState === "MATCH_FOUND";
    const isRecon = currentState === "RECONSTRUCTING";

    const color = isProblem ? "#E62129" : "#0056B3";
    const scaleY = isProblem ? 0.2 : isRecon ? 0.15 : isMatch ? 1.4 : 1;

    [eyeLeftRef.current, eyeRightRef.current].forEach((el) => {
      el.style.background = color;
      el.style.boxShadow = `0 0 10px ${color}`;
      el.style.transform = `scaleY(${scaleY})`;
    });
  }, [currentState]);

  /* ── Panel slide-in when panel changes ── */
  useEffect(() => {
    if (!panelRef.current || !panel) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, x: 30, scale: 0.85 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }, [currentState, panel]);

  /* ── Parallax Y on scroll (subtle, no RAF/setState) ── */
  const parallaxY = scrollProgress * 80;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/*
       * ─── SPATIAL ZONE: right 40% of viewport ───
       * Mascot anchored to right side, vertically centered
       */}
      <div
        className="absolute"
        style={{
          right: "4vw",
          top: "50%",
          transform: `translateY(calc(-50% + ${parallaxY}px))`,
          width: "clamp(180px, 22vw, 300px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Hologram Panel (above mascot) ── */}
        {panel && (
          <div
            ref={panelRef}
            style={{
              marginBottom: "16px",
              background: "rgba(8,8,20,0.85)",
              border: `1px solid ${panel.color}60`,
              backdropFilter: "blur(20px)",
              padding: "12px 20px",
              minWidth: "220px",
              position: "relative",
              boxShadow: `0 0 24px ${panel.color}20, inset 0 0 20px ${panel.color}05`,
            }}
            className="pointer-events-auto"
          >
            {/* Corner decorations */}
            <div style={{ position: "absolute", top: -1, left: -1, width: 8, height: 8, borderTop: `2px solid ${panel.color}`, borderLeft: `2px solid ${panel.color}` }} />
            <div style={{ position: "absolute", top: -1, right: -1, width: 8, height: 8, borderTop: `2px solid ${panel.color}`, borderRight: `2px solid ${panel.color}` }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 8, height: 8, borderBottom: `2px solid ${panel.color}`, borderLeft: `2px solid ${panel.color}` }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderBottom: `2px solid ${panel.color}`, borderRight: `2px solid ${panel.color}` }} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "16px" }}>{panel.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 900,
                  fontSize: "14px",
                  color: panel.color,
                  letterSpacing: "0.05em",
                }}
              >
                {panel.title}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {panel.sub}
            </div>

            {/* Hologram scan line */}
            <div
              className="mascot-panel-scanline"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${panel.color}80, transparent)`,
                animation: "panel-scan 2s linear infinite",
              }}
            />
          </div>
        )}

        {/* ── Mascot container ── */}
        <div
          ref={mascotRef}
          className="relative will-change-transform pointer-events-auto cursor-pointer"
          style={{ animation: "mascot-idle-float 4s ease-in-out infinite" }}
        >
          {/* Ambient glow halo */}
          <div
            style={{
              position: "absolute",
              inset: "-20px",
              borderRadius: "50%",
              background:
                currentState === "MATCH_FOUND"
                  ? "radial-gradient(circle, rgba(230,33,41,0.25) 0%, rgba(0,86,179,0.1) 60%, transparent 75%)"
                  : currentState === "RECONSTRUCTING"
                  ? "radial-gradient(circle, rgba(255,193,7,0.2) 0%, rgba(0,86,179,0.1) 60%, transparent 75%)"
                  : "radial-gradient(circle, rgba(0,86,179,0.18) 0%, rgba(230,33,41,0.06) 60%, transparent 75%)",
              filter: "blur(20px)",
              transition: "background 0.8s ease",
              animation: "mascot-glow-pulse 3s ease-in-out infinite alternate",
              pointerEvents: "none",
            }}
          />

          {/* Orbit ring */}
          <div
            style={{
              position: "absolute",
              inset: "-20px",
              borderRadius: "50%",
              border: "1px solid rgba(0,86,179,0.2)",
              animation: "ring-spin 12s linear infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-30px",
              borderRadius: "50%",
              border: "1px dashed rgba(255,193,7,0.12)",
              animation: "ring-spin 18s linear infinite reverse",
              pointerEvents: "none",
            }}
          />

          {/* ── Particles ── */}
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                borderRadius: "50%",
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                animation: `particle-orbit ${p.duration}s linear infinite`,
                animationDelay: `-${p.delay}s`,
                transform: `rotate(${p.angle}deg) translateX(${p.radius}px)`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Mascot SVG */}
          <Image
            src="/images/maskot.svg"
            alt="DISGUISE-ID AI Mascot"
            width={260}
            height={300}
            priority
            style={{
              objectFit: "contain",
              width: "clamp(160px, 20vw, 260px)",
              height: "auto",
              filter:
                currentState === "MATCH_FOUND"
                  ? "drop-shadow(0 0 40px rgba(230,33,41,0.6)) drop-shadow(0 20px 60px rgba(0,86,179,0.3))"
                  : currentState === "RECONSTRUCTING"
                  ? "drop-shadow(0 0 40px rgba(255,193,7,0.4)) drop-shadow(0 20px 60px rgba(0,86,179,0.3))"
                  : "drop-shadow(0 20px 60px rgba(0,86,179,0.4)) drop-shadow(0 0 30px rgba(0,86,179,0.15))",
              transition: "filter 0.8s ease",
              animation: "mascot-hologram 6s ease-in-out infinite",
            }}
          />

          {/* ── Eye blink overlay ── */}
          <div
            style={{
              position: "absolute",
              top: "41%",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "clamp(24px, 5%, 40px)",
              pointerEvents: "none",
            }}
          >
            {[eyeLeftRef, eyeRightRef].map((ref, i) => (
              <div
                key={i}
                ref={ref}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#0056B3",
                  boxShadow: "0 0 10px #0056B3",
                  transformOrigin: "center",
                  transition: "all 0.2s ease",
                  mixBlendMode: "screen",
                  animation: "eye-blink 4s ease-in-out infinite",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* ── State badge (IDLE only: hover tooltip) ── */}
          {currentState === "IDLE" && (
            <div
              style={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(8,8,16,0.9)",
                border: "1px solid rgba(0,86,179,0.4)",
                padding: "4px 14px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "9px",
                color: "#0056B3",
                letterSpacing: "0.15em",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  background: "#0056B3",
                  borderRadius: "50%",
                  animation: "ping-dot 1.5s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              AI READY
            </div>
          )}
        </div>
      </div>

      {/* ── CSS Keyframes ── */}
      <style>{`
        /* Idle floating bob */
        @keyframes mascot-idle-float {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50%       { transform: translateY(-18px) rotate(0.5deg); }
        }

        /* Hologram flicker on the SVG */
        @keyframes mascot-hologram {
          0%, 92%, 100% { opacity: 1; filter: inherit; }
          93%  { opacity: 0.75; filter: inherit brightness(1.4) hue-rotate(15deg); }
          94%  { opacity: 1; filter: inherit; }
          96%  { opacity: 0.8; filter: inherit brightness(0.8); }
          97%  { opacity: 1; filter: inherit; }
        }

        /* Glow halo pulse */
        @keyframes mascot-glow-pulse {
          from { opacity: 0.7; transform: scale(0.95); }
          to   { opacity: 1;   transform: scale(1.05); }
        }

        /* Eye blink */
        @keyframes eye-blink {
          0%, 88%, 100% { transform: scaleY(1); }
          90%            { transform: scaleY(0.06); }
          92%            { transform: scaleY(1); }
          94%            { transform: scaleY(0.06); }
          96%            { transform: scaleY(1); }
        }

        /* Orbit rings */
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Digital particles orbit */
        @keyframes particle-orbit {
          from { transform: rotate(0deg) translateX(var(--r, 160px)) scale(1); }
          50%  { transform: rotate(180deg) translateX(var(--r, 160px)) scale(1.5); }
          to   { transform: rotate(360deg) translateX(var(--r, 160px)) scale(1); }
        }

        /* Hologram panel scan line sweep */
        @keyframes panel-scan {
          0%   { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0.3; }
        }

        /* Status dot ping */
        @keyframes ping-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

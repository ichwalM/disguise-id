"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface MascotSceneProps {
  scrollY?: number;
}

export default function MascotScene({ scrollY = 0 }: MascotSceneProps) {
  const mascotRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-8);
  const [hover, setHover] = useState(false);

  // Auto-rotate + scroll influence
  useEffect(() => {
    let raf: number;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      // Slow auto-rotate on Y, scroll influences the angle
      setRotY(elapsed * 18 + scrollY * 0.04);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [scrollY]);

  // Mouse parallax
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setRotX(-8 + dy * -12);
    setRotY((prev) => prev + dx * 2);
  };

  const onMouseLeave = () => {
    setRotX(-8);
  };

  // Particle data
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const radius = 180 + (i % 3) * 40;
    const size = 3 + (i % 4);
    const colors = ["#0056B3", "#E62129", "#FFC107", "#00d4ff"];
    return { angle, radius, size, color: colors[i % colors.length], delay: i * 0.3 };
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
        perspectiveOrigin: "center center",
        position: "relative",
      }}
    >
      {/* Orbit rings — CSS 3D */}
      {[200, 260, 320].map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            width: `${r * 2}px`,
            height: `${r * 2}px`,
            border: `1px solid ${["rgba(0,86,179,0.4)", "rgba(255,193,7,0.3)", "rgba(230,33,41,0.3)"][i]}`,
            borderRadius: "50%",
            animation: `orbit-spin ${8 + i * 3}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
            transform: `rotateX(${70 + i * 5}deg)`,
          }}
        />
      ))}

      {/* Floating particles around the orbit */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: "50%",
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-orbit ${6 + (i % 4)}s linear infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.angle}deg) translateX(${p.radius}px)`,
          }}
        />
      ))}

      {/* Scan line that sweeps */}
      <div
        style={{
          position: "absolute",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "170px",
            height: "2px",
            background: "linear-gradient(90deg, rgba(230,33,41,0.8), transparent)",
            transformOrigin: "left center",
            animation: "radar-sweep 3s linear infinite",
          }}
        />
      </div>

      {/* Glow backdrop */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,86,179,0.2) 0%, rgba(230,33,41,0.1) 50%, transparent 70%)",
          filter: "blur(30px)",
          animation: "glow-pulse 3s ease-in-out infinite alternate",
        }}
      />

      {/* Hexagon grid bg */}
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          opacity: 0.06,
          backgroundImage: `
            repeating-linear-gradient(0deg, #0056B3 0, #0056B3 1px, transparent 0, transparent 50%),
            repeating-linear-gradient(60deg, #0056B3 0, #0056B3 1px, transparent 0, transparent 50%),
            repeating-linear-gradient(120deg, #0056B3 0, #0056B3 1px, transparent 0, transparent 50%)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Mascot — 3D rotating */}
      <div
        ref={mascotRef}
        style={{
          position: "relative",
          zIndex: 10,
          transform: `
            rotateY(${rotY % 360}deg) 
            rotateX(${rotX}deg)
          `,
          transformStyle: "preserve-3d",
          transition: hover ? "none" : "transform 0.1s ease-out",
          filter: "drop-shadow(0 20px 60px rgba(0,86,179,0.6)) drop-shadow(0 0 30px rgba(230,33,41,0.3))",
          animation: "mascot-float 4s ease-in-out infinite",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src="/images/maskot.svg"
          alt="DISGUISE-ID Mascot — Fox AI Agent"
          width={380}
          height={440}
          priority
          style={{
            objectFit: "contain",
            width: "100%",
            height: "auto",
            maxWidth: "380px",
          }}
        />

        {/* Shadow underneath mascot */}
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "50%",
            transform: "translateX(-50%) rotateX(80deg)",
            width: "200px",
            height: "40px",
            background: "radial-gradient(ellipse, rgba(0,86,179,0.5) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* HUD labels floating around */}
      {[
        { label: "MTCNN", sub: "Face Detection", angle: -40, dist: 240, color: "#0056B3" },
        { label: "VAE V2", sub: "Inpainting", angle: 30, dist: 240, color: "#FFC107" },
        { label: "94.74%", sub: "SSIM Accuracy", angle: -140, dist: 220, color: "#E62129" },
      ].map((hud) => {
        const rad = (hud.angle * Math.PI) / 180;
        const x = Math.cos(rad) * hud.dist;
        const y = Math.sin(rad) * hud.dist * 0.4;
        return (
          <div
            key={hud.label}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                border: `1px solid ${hud.color}60`,
                background: `${hud.color}15`,
                backdropFilter: "blur(8px)",
                padding: "6px 12px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 900,
                  fontSize: "14px",
                  color: hud.color,
                  lineHeight: 1,
                }}
              >
                {hud.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                  marginTop: "2px",
                }}
              >
                {hud.sub}
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS Keyframes injected inline */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotateX(70deg) rotateZ(0deg); }
          to { transform: rotateX(70deg) rotateZ(360deg); }
        }
        @keyframes particle-orbit {
          from { transform: rotate(0deg) translateX(200px); }
          to { transform: rotate(360deg) translateX(200px); }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          from { opacity: 0.6; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
        @keyframes mascot-float {
          0%, 100% { transform: rotateY(var(--ry, 0deg)) rotateX(-8deg) translateY(0px); }
          50% { transform: rotateY(var(--ry, 0deg)) rotateX(-8deg) translateY(-16px); }
        }
      `}</style>
    </div>
  );
}

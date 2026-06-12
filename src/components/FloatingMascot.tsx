"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Cpu, Terminal } from "lucide-react";

export default function FloatingMascot() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [rotY, setRotY] = useState(0);

  // Scroll tracking & Mobile detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
      setScrollPct(pct);

      // Fade in floating mascot once user scrolls past hero section (>300px)
      if (currentScroll > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    // Initial calls
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mascot Y-rotation animation loop (combines time + scroll position)
  useEffect(() => {
    if (!visible) return;
    let raf: number;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      // Scroll moves the rotation, and a slow auto-spin keeps it alive
      setRotY(elapsed * 15 + scrollY * 0.15);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [visible, scrollY]);

  if (isMobile) return null; // Hide on mobile screens to avoid blocking text

  // SVG Progress Ring calculations
  const radius = 70;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPct / 100) * circumference;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: "180px",
        height: "180px",
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.8)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: visible ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Interactive Tooltip Card (Reveals on Hover) */}
      <div
        style={{
          position: "absolute",
          bottom: "190px",
          right: "0",
          width: "280px",
          background: "rgba(8, 8, 16, 0.95)",
          border: "2px solid #0056B3",
          boxShadow: hovered 
            ? "0 0 30px rgba(0, 86, 179, 0.4), inset 0 0 15px rgba(0, 86, 179, 0.2)"
            : "0 10px 30px rgba(0,0,0,0.5)",
          padding: "16px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0) scale(1)" : "translateY(15px) scale(0.9)",
          transformOrigin: "bottom right",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "#fff",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(0,86,179,0.3)", paddingBottom: "8px", marginBottom: "8px" }}>
          <Cpu size={14} color="#FFC107" className="animate-pulse" />
          <span style={{ fontSize: "10px", fontWeight: 900, color: "#0056B3", letterSpacing: "0.1em" }}>
            DISGUISE-ID COMPANION
          </span>
        </div>

        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5", marginBottom: "12px" }}>
          Saya mendampingi penyelidikan Anda. AI sedang memantau <span style={{ color: "#FFC107", fontWeight: 700 }}>512 kamera</span> CCTV secara real-time.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "10px", background: "rgba(255,255,255,0.02)", padding: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>PROGRESS:</span>
            <span style={{ color: "#0056B3", fontWeight: 700 }}>{Math.round(scrollPct)}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>RECON_ACC:</span>
            <span style={{ color: "#E62129", fontWeight: 700 }}>94.74% SSIM</span>
          </div>
        </div>

        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#E62129",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "8px 12px",
            marginTop: "12px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#b8161c")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E62129")}
        >
          <Terminal size={12} />
          BUKA COMMAND CENTER
        </Link>
      </div>

      {/* Futuristic Orbit Elements */}
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
        
        {/* Glow backdrop */}
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: hovered 
              ? "radial-gradient(circle, rgba(230,33,41,0.25) 0%, rgba(0,86,179,0.15) 60%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,86,179,0.2) 0%, rgba(230,33,41,0.05) 60%, transparent 70%)",
            filter: "blur(15px)",
            transition: "all 0.3s ease",
            transform: hovered ? "scale(1.2)" : "scale(1)",
            zIndex: 1,
          }}
        />

        {/* Circular Scroll Progress Bar */}
        <svg
          style={{
            position: "absolute",
            width: "160px",
            height: "160px",
            transform: "rotate(-90deg)",
            zIndex: 2,
          }}
        >
          {/* Background Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Indicator */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={hovered ? "#E62129" : "#0056B3"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Orbit Rings (Outer Spinning Dashed Circle) */}
        <div
          style={{
            position: "absolute",
            width: "135px",
            height: "135px",
            border: "1px dashed rgba(0,86,179,0.25)",
            borderRadius: "50%",
            animation: "floating-spin 12s linear infinite",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "125px",
            height: "125px",
            border: "1px dashed rgba(255,193,7,0.15)",
            borderRadius: "50%",
            animation: "floating-spin-reverse 8s linear infinite",
            zIndex: 2,
          }}
        />

        {/* Scanning Radar Line */}
        <div
          style={{
            position: "absolute",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "65px",
              height: "1px",
              background: "linear-gradient(90deg, rgba(230,33,41,0.6), transparent)",
              transformOrigin: "left center",
              animation: "floating-radar 4s linear infinite",
            }}
          />
        </div>

        {/* Floating Particles */}
        {[0, 90, 180, 270].map((angle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              background: i % 2 === 0 ? "#E62129" : "#0056B3",
              borderRadius: "50%",
              boxShadow: `0 0 8px ${i % 2 === 0 ? "#E62129" : "#0056B3"}`,
              transform: `rotate(${angle + scrollY * 0.05}deg) translateX(70px)`,
              transition: "transform 0.1s ease-out",
              zIndex: 3,
            }}
          />
        ))}

        {/* Mascot Wrapper with 3D rotation */}
        <Link
          href="/dashboard"
          style={{
            position: "relative",
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            perspective: "500px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              transform: `rotateY(${rotY % 360}deg) rotateX(-5deg)`,
              transformStyle: "preserve-3d",
              filter: hovered 
                ? "drop-shadow(0 10px 25px rgba(230,33,41,0.8)) drop-shadow(0 0 15px rgba(0,86,179,0.4))"
                : "drop-shadow(0 5px 15px rgba(0,86,179,0.5))",
              animation: "floating-mascot-bob 3s ease-in-out infinite",
              transition: "filter 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src="/images/maskot.svg"
              alt="Mascot Companion"
              width={75}
              height={85}
              priority
              style={{
                objectFit: "contain",
                width: "75px",
                height: "auto",
              }}
            />
          </div>
        </Link>
      </div>

      {/* Status indicator pill at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          background: "rgba(8, 8, 16, 0.95)",
          border: `1px solid ${hovered ? "#E62129" : "#0056B3"}`,
          padding: "3px 10px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "8px",
          color: "#fff",
          zIndex: 20,
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          transition: "border-color 0.3s ease",
          letterSpacing: "0.05em",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            background: hovered ? "#E62129" : "#0056B3",
            borderRadius: "50%",
            display: "inline-block",
            animation: "floating-ping 1.5s ease-in-out infinite",
          }}
        />
        {hovered ? "DPO SCAN" : "SYS ACTIVE"}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floating-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floating-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes floating-radar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floating-mascot-bob {
          0%, 100% { transform: rotateY(var(--ry, 0deg)) rotateX(-5deg) translateY(0px); }
          50% { transform: rotateY(var(--ry, 0deg)) rotateX(-5deg) translateY(-8px); }
        }
        @keyframes floating-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

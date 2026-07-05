"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroMascot2DProps {
  scrollY?: number;
}

export default function HeroMascot2D({ scrollY = 0 }: HeroMascot2DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      
      {/* Glow backdrop */}
      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,86,179,0.3) 0%, rgba(230,33,41,0.1) 50%, transparent 70%)",
          filter: "blur(20px)",
          zIndex: 1,
          animation: "hero-glow-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Outer Orbit Ring */}
      <div
        style={{
          position: "absolute",
          width: "460px",
          height: "460px",
          border: "2px dashed rgba(0,86,179,0.3)",
          borderRadius: "50%",
          animation: "floating-spin 20s linear infinite",
          zIndex: 2,
        }}
      />
      
      {/* Inner Orbit Ring */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          border: "2px dashed rgba(255,193,7,0.2)",
          borderRadius: "50%",
          animation: "floating-spin-reverse 15s linear infinite",
          zIndex: 2,
        }}
      />

      {/* Scanning Radar Line */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
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
            width: "210px",
            height: "2px",
            background: "linear-gradient(90deg, rgba(230,33,41,0.6), transparent)",
            transformOrigin: "left center",
            animation: "floating-radar 6s linear infinite",
          }}
        />
      </div>

      {/* Floating Particles */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "5px",
            height: "5px",
            background: i % 2 === 0 ? "#E62129" : "#0056B3",
            borderRadius: "50%",
            boxShadow: `0 0 10px ${i % 2 === 0 ? "#E62129" : "#0056B3"}`,
            transform: `rotate(${angle + scrollY * 0.05}deg) translateX(230px)`,
            transition: "transform 0.1s ease-out",
            zIndex: 3,
          }}
        />
      ))}

      {/* Mascot Image with Float Animation */}
      <div
        style={{
          position: "relative",
          width: "360px",
          height: "360px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6)) drop-shadow(0 0 25px rgba(0,86,179,0.3))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src="/images/MASKOT.png"
            alt="DISGUISE-ID Hero Mascot"
            width={360}
            height={420}
            priority
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes hero-glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
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
      `}</style>
    </div>
  );
}

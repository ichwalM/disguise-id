"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeroMascot2DProps {
  scrollY?: number;
}

export default function HeroMascot2D({ scrollY = 0 }: HeroMascot2DProps) {
  const [mounted, setMounted] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), { stiffness: 150, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 150, damping: 30 });

  if (!mounted) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", perspective: "1200px" }}>
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow backdrop (Back layer) */}
        <div
          style={{
            position: "absolute",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,86,179,0.4) 0%, rgba(230,33,41,0.15) 50%, transparent 70%)",
            filter: "blur(20px)",
            transform: "translateZ(-50px)",
            animation: "hero-glow-pulse 4s ease-in-out infinite",
          }}
        />

        {/* Outer Orbit Ring */}
        <div
          style={{
            position: "absolute",
            width: "460px",
            height: "460px",
            border: "2px dashed rgba(0,86,179,0.4)",
            borderRadius: "50%",
            transform: "translateZ(20px)",
            animation: "floating-spin 20s linear infinite",
          }}
        />
        
        {/* Inner Orbit Ring */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            border: "2px dashed rgba(255,193,7,0.3)",
            borderRadius: "50%",
            transform: "translateZ(40px)",
            animation: "floating-spin-reverse 15s linear infinite",
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
            transform: "translateZ(60px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "210px",
              height: "2px",
              background: "linear-gradient(90deg, rgba(230,33,41,0.8), transparent)",
              transformOrigin: "left center",
              animation: "floating-radar 6s linear infinite",
            }}
          />
        </div>

        {/* Floating Particles (Mid layer) */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              background: i % 2 === 0 ? "#E62129" : "#0056B3",
              borderRadius: "50%",
              boxShadow: `0 0 12px ${i % 2 === 0 ? "#E62129" : "#0056B3"}`,
              transform: `rotate(${angle + scrollY * 0.05}deg) translateX(230px) translateZ(80px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
        ))}

        {/* Mascot Image with Float Animation (Front layer) */}
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateZ(120px)",
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
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes floating-spin {
          from { transform: translateZ(20px) rotate(0deg); }
          to { transform: translateZ(20px) rotate(360deg); }
        }
        @keyframes floating-spin-reverse {
          from { transform: translateZ(40px) rotate(360deg); }
          to { transform: translateZ(40px) rotate(0deg); }
        }
        @keyframes floating-radar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

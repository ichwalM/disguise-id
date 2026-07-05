"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Camera, Clock, Target } from "lucide-react";

const counters = [
  { end: 94.74, suffix: "%", label: "SSIM ACCURACY", unit: "VAE Nusantara V2", color: "#FFC107", icon: TrendingUp, desc: "Akurasi rekonstruksi wajah tertinggi pada dataset Asia Tenggara" },
  { end: 512, suffix: "+", label: "CCTV CAMERAS", unit: "node aktif", color: "#0056B3", icon: Camera, desc: "Kamera aktif yang terhubung ke surveillance grid nasional" },
  { end: 50, suffix: "ms", label: "LATENCY", unit: "avg detection", color: "#0056B3", icon: Clock, desc: "Waktu rata-rata deteksi dan rekonstruksi per frame video" },
  { end: 96.4, suffix: "%", label: "MATCH ACCURACY", unit: "DPO identification", color: "#E62129", icon: Target, desc: "Tingkat keberhasilan pencocokan identitas DPO nasional" },
];

const techStack = ["PyTorch", "FastAPI", "MTCNN", "ArcFace", "U-Net VAE V2", "Firebase FCM", "PUSIKNAS POLRI"];

function useCounter(end: number, started: boolean, duration = 2200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(parseFloat((eased * end).toFixed(end % 1 !== 0 ? 2 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, started, duration]);
  return value;
}

function Counter({ data, started, index }: { data: (typeof counters)[0]; started: boolean; index: number }) {
  const val = useCounter(data.end, started);
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 60px ${data.color}20, 0 0 0 1px ${data.color}30`,
        borderColor: `${data.color}60`,
      }}
      style={{
        padding: "40px 32px",
        border: `1px solid rgba(255,255,255,0.06)`,
        background: "rgba(255,255,255,0.02)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "all 0.3s ease",
      }}
    >
      {/* Bottom glow bar */}
      <motion.div
        animate={started ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, delay: index * 0.15 + 0.3 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: data.color,
          transformOrigin: "left",
          opacity: 0.7,
        }}
      />

      {/* Side glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: `linear-gradient(180deg, transparent, ${data.color}50, transparent)`,
        }}
      />

      {/* Shimmer */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 + 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "30%",
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${data.color}08, transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            border: `1px solid ${data.color}40`,
            background: `${data.color}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} color={data.color} />
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "8px",
            color: `${data.color}60`,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          LIVE
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(42px, 5vw, 60px)",
          color: data.color,
          lineHeight: 1,
          marginBottom: "8px",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {val.toLocaleString()}{data.suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 700,
          fontSize: "11px",
          color: "#fff",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {data.label}
      </div>

      {/* Unit */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.1em",
          marginBottom: "16px",
        }}
      >
        {data.unit}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.6,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: "12px",
        }}
      >
        {data.desc}
      </div>
    </motion.div>
  );
}

export default function SectionStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{ backgroundColor: "#030308", position: "relative", overflow: "hidden" }}
      className="py-16 md:py-32"
      id="statistics"
    >
      {/* Bg watermark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 900,
            fontSize: "20vw",
            color: "rgba(255,255,255,0.012)",
            textTransform: "uppercase",
            letterSpacing: "-0.05em",
          }}
        >
          STATS
        </motion.span>
      </div>

      {/* Horizontal scan line */}
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "40%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,86,179,0.3), transparent)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#0056B3",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            // PERFORMA SISTEM
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.03em",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            DATA DAN <span style={{ color: "#FFC107" }}>AKURASI</span>
          </h2>
        </motion.div>

        {/* Counter grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {counters.map((c, i) => (
            <Counter key={c.label} data={c} started={isInView} index={i} />
          ))}
        </div>

        {/* Tech stack ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            marginTop: "56px",
            padding: "24px",
            border: "1px solid rgba(0,86,179,0.2)",
            background: "rgba(0,86,179,0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Scanning bar */}
          <motion.div
            animate={{ x: ["-100%", "110%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "20%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(0,86,179,0.08), transparent)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 32px", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(0,86,179,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>TECH STACK:</span>
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.08 }}
                whileHover={{ color: "#0056B3" }}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "rgba(0,86,179,0.6)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "default",
                  transition: "color 0.2s",
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

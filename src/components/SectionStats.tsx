"use client";

import { useRef, useEffect, useState } from "react";

const counters = [
  { end: 94.74, suffix: "%", label: "SSIM ACCURACY", unit: "VAE Nusantara V2", color: "#FFC107" },
  { end: 512, suffix: "+", label: "CCTV CAMERAS", unit: "node aktif", color: "#0056B3" },
  { end: 50, suffix: "ms", label: "LATENCY", unit: "avg detection", color: "#0056B3" },
  { end: 96.4, suffix: "%", label: "MATCH ACCURACY", unit: "DPO identification", color: "#E62129" },
];

function useCounter(end: number, started: boolean, duration = 2000) {
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

function Counter({ data, started }: { data: (typeof counters)[0]; started: boolean }) {
  const val = useCounter(data.end, started);
  return (
    <div
      style={{
        padding: "40px 32px",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: data.color,
          opacity: 0.6,
        }}
      />
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
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 700,
          fontSize: "11px",
          color: "#fff",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        {data.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.1em",
        }}
      >
        {data.unit}
      </div>
    </div>
  );
}

export default function SectionStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ backgroundColor: "#030308", padding: "128px 0", position: "relative", overflow: "hidden" }}
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
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 900,
            fontSize: "20vw",
            color: "rgba(255,255,255,0.015)",
            textTransform: "uppercase",
            letterSpacing: "-0.05em",
          }}
        >
          STATS
        </span>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
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
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {counters.map((c) => (
            <Counter key={c.label} data={c} started={started} />
          ))}
        </div>

        {/* Tech stack note */}
        <div
          style={{
            marginTop: "48px",
            padding: "24px",
            border: "1px solid rgba(0,86,179,0.2)",
            background: "rgba(0,86,179,0.05)",
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {["PyTorch", "FastAPI", "MTCNN", "ArcFace", "U-Net VAE V2", "Firebase FCM", "PUSIKNAS POLRI"].map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "rgba(0,86,179,0.8)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

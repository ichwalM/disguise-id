"use client";

import { ArrowRight, Shield, Cpu, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const badges = [
  { icon: Zap, label: "REAL-TIME AI", color: "#FFC107" },
  { icon: Shield, label: "PUSIKNAS POLRI", color: "#0056B3" },
  { icon: Lock, label: "ENCRYPTED", color: "#E62129" },
  { icon: Cpu, label: "U-NET VAE V2", color: "#FFC107" },
];

export default function SectionCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(135deg, #0056B3 0%, #003d82 50%, #001f42 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      className="py-16 md:py-32"
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated scanlines */}
      <motion.div
        animate={{ y: ["-100%", "120%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Red glow top-right */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-5%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(230,33,41,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom-left gold glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,193,7,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          // SIAP DIIMPLEMENTASIKAN
        </motion.div>

        {/* Hero text */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(60px, 10vw, 120px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          DISGUISE
          <span style={{ color: "#FFC107" }}>-ID</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          BONGKAR PENYAMARAN • IDENTIFIKASI DPO • REAL-TIME AI
        </motion.p>

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}
        >
          {badges.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: `1px solid ${color}50`,
                background: `${color}15`,
                padding: "6px 14px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10px",
                color,
                letterSpacing: "0.1em",
                cursor: "default",
              }}
            >
              <Icon size={12} />
              {label}
            </motion.div>
          ))}
        </motion.div>

        {/* Problem → Solution strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            border: "1px solid rgba(255,255,255,0.15)",
            marginBottom: "48px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(230,33,41,0.3)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#fff",
              letterSpacing: "0.1em",
            }}
          >
            MASKER / PENYAMARAN
          </div>
          <motion.div
            animate={{ background: ["rgba(255,255,255,0.08)", "rgba(255,193,7,0.15)", "rgba(255,255,255,0.08)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Cpu size={16} color="#FFC107" />
          </motion.div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(0,86,179,0.3)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#fff",
              letterSpacing: "0.1em",
            }}
          >
            WAJAH TERIDENTIFIKASI ✓
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "64px",
          }}
        >
          <Link
            href="/dashboard"
            style={{ textDecoration: "none" }}
          >
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#fff",
                color: "#0056B3",
                padding: "18px 44px",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              MASUK COMMAND CENTER
              <ArrowRight size={18} />
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.8)", boxShadow: "0 0 24px rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "transparent",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.4)",
              padding: "18px 44px",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          >
            <Shield size={18} />
            REQUEST DEMO
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          © 2026 DISGUISE-ID — AI FACE RECONSTRUCTION & DPO IDENTIFICATION SYSTEM — ALL RIGHTS RESERVED
        </motion.div>
      </div>
    </section>
  );
}

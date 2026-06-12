"use client";

import { ArrowRight, Shield, Cpu } from "lucide-react";
import Link from "next/link";

export default function SectionCTA() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0056B3 0%, #003d82 50%, #001f42 100%)",
        padding: "128px 0",
        position: "relative",
        overflow: "hidden",
      }}
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
      {/* Red glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(230,33,41,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
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
        <div
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
        </div>

        <h2
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
        </h2>

        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          BONGKAR PENYAMARAN • IDENTIFIKASI DPO • REAL-TIME AI
        </p>

        {/* Problem → Solution strip */}
        <div
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
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Cpu size={16} color="#FFC107" />
          </div>
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
        </div>

        <div
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              color: "#0056B3",
              padding: "18px 40px",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            MASUK COMMAND CENTER
            <ArrowRight size={18} />
          </Link>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "transparent",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.4)",
              padding: "18px 40px",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            <Shield size={18} />
            REQUEST DEMO
          </button>
        </div>

        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          © 2026 DISGUISE-ID — AI FACE RECONSTRUCTION & DPO IDENTIFICATION SYSTEM — ALL RIGHTS RESERVED
        </div>
      </div>
    </section>
  );
}

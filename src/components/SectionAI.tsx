"use client";

import { useRef, useEffect, useState } from "react";
import { Check, Clock, AlertTriangle } from "lucide-react";

const pipeline = [
  { label: "CCTV Frame Captured", status: "done" },
  { label: "MTCNN Face Detection", status: "done" },
  { label: "Occlusion Detection (Masker/Kacamata)", status: "done" },
  { label: "U-Net VAE Inpainting (vae_nusantara_best_v2.pth)", status: "active" },
  { label: "ArcFace Embedding Extraction", status: "pending" },
  { label: "PUSIKNAS POLRI DB Matching", status: "pending" },
  { label: "Similarity Score + Alert Output", status: "pending" },
];

const reconstructStages = [
  { label: "INPUT ASLI", sublabel: "Wajah dengan masker", color: "#333" },
  { label: "AI INPAINTING", sublabel: "VAE sedang bekerja...", color: "#FFC107" },
  { label: "HASIL REKONSTRUKSI", sublabel: "SSIM 94.74%", color: "#0056B3" },
];

export default function SectionAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setStageIdx((p) => (p + 1) % 3), 2000);
    return () => clearInterval(interval);
  }, [visible]);

  const card = (content: React.ReactNode) => (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(0, 86, 179, 0.08) 0%, rgba(0, 86, 179, 0.04) 100%), rgba(8, 8, 16, 0.6)`,
        border: "1px solid rgba(0, 86, 179, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: `
          0 4px 16px rgba(0, 86, 179, 0.1),
          0 8px 32px rgba(0, 86, 179, 0.05),
          inset 0 0 20px rgba(0, 86, 179, 0.05)
        `,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `
          0 8px 32px rgba(0, 86, 179, 0.2),
          0 12px 48px rgba(0, 86, 179, 0.1),
          inset 0 0 20px rgba(0, 86, 179, 0.1)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `
          0 4px 16px rgba(0, 86, 179, 0.1),
          0 8px 32px rgba(0, 86, 179, 0.05),
          inset 0 0 20px rgba(0, 86, 179, 0.05)
        `;
      }}
    >
      {content}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "#06060f",
        backgroundImage: `linear-gradient(135deg, rgba(255, 193, 7, 0.02) 0%, transparent 100%)`,
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue glow center */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0,86,179,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
        {/* Section label */}
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "#E62129",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          // AI ENGINE — U-NET VAE NUSANTARA
        </div>
        <h2
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#fff",
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: "64px",
          }}
        >
          REKONSTRUKSI<br />
          <span style={{ color: "#0056B3" }}>WAJAH TERSEMBUNYI</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-50px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {/* Reconstruction visualizer */}
            {card(
              <>
                <div
                  style={{
                    background: "rgba(0,86,179,0.1)",
                    borderBottom: "1px solid rgba(0,86,179,0.2)",
                    padding: "10px 16px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "#0056B3",
                    letterSpacing: "0.2em",
                  }}
                >
                  VAE_NUSANTARA_BEST_V2.PTH — INPAINTING
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {reconstructStages.map((s, i) => (
                      <div
                        key={s.label}
                        style={{
                          flex: 1,
                          height: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${i <= stageIdx ? s.color : "#1a1a2e"}`,
                          background: i === stageIdx ? `${s.color}15` : "transparent",
                          transition: "all 0.6s ease",
                          gap: "6px",
                        }}
                      >
                        {/* Face mockup */}
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: `2px solid ${i <= stageIdx ? s.color : "#333"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Simulated face */}
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: i === 0
                                ? "linear-gradient(180deg, #222 0%, #222 50%, #111 50%)" // masked
                                : `radial-gradient(circle, ${s.color}30 0%, transparent 70%)`,
                            }}
                          />
                          {i === 0 && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "50%",
                                background: "#333",
                                borderTop: "2px solid #555",
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontSize: "9px",
                            color: i <= stageIdx ? s.color : "#333",
                            letterSpacing: "0.05em",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "3px", background: "#1a1a2e", marginBottom: "10px" }}>
                    <div
                      style={{
                        height: "100%",
                        background: reconstructStages[stageIdx].color,
                        width: `${((stageIdx + 1) / 3) * 100}%`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: reconstructStages[stageIdx].color,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {reconstructStages[stageIdx].sublabel}
                  </div>
                </div>
              </>
            )}

            {/* Match result */}
            <div
              style={{
                marginTop: "16px",
                border: "2px solid rgba(230,33,41,0.6)",
                background: "rgba(230,33,41,0.08)",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#E62129",
                  letterSpacing: "0.2em",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                }}
              >
                <AlertTriangle size={14} />
                DPO TERIDENTIFIKASI
              </div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 900,
                  fontSize: "72px",
                  color: "#fff",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                96.4%
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  ["CONFIDENCE", "96.4%"],
                  ["TARGET ID", "DPO-2026-992"],
                  ["LOKASI", "POS 3 MAKASSAR"],
                  ["TIMESTAMP", "10:45:22 WITA"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>{k}</span>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: pipeline */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(50px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            {/* Pipeline */}
            {card(
              <>
                <div
                  style={{
                    background: "rgba(0,86,179,0.1)",
                    borderBottom: "1px solid rgba(0,86,179,0.2)",
                    padding: "10px 16px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "#0056B3",
                    letterSpacing: "0.2em",
                  }}
                >
                  DETECTION PIPELINE
                </div>
                <div>
                  {pipeline.map((step, i) => (
                    <div
                      key={step.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : "translateX(20px)",
                        transition: `opacity 0.5s ease ${0.3 + i * 0.08}s, transform 0.5s ease ${0.3 + i * 0.08}s`,
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${step.status === "done" ? "#0056B3" : step.status === "active" ? "#FFC107" : "#2a2a3a"}`,
                        }}
                      >
                        {step.status === "done" && <Check size={12} color="#0056B3" />}
                        {step.status === "active" && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              background: "#FFC107",
                              borderRadius: "50%",
                              animation: "ping 1s infinite",
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "11px",
                          fontWeight: step.status === "pending" ? 400 : 700,
                          color: step.status === "done" ? "#fff" : step.status === "active" ? "#FFC107" : "#333",
                        }}
                      >
                        {step.label}
                      </span>
                      {step.status === "active" && (
                        <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              style={{
                                width: "5px",
                                height: "5px",
                                background: "#FFC107",
                                borderRadius: "50%",
                                animation: `bounce 1s infinite ${d * 0.15}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Decision table */}
            <div style={{ marginTop: "16px" }}>
              {card(
                <>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      padding: "10px 16px",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    DECISION ENGINE
                  </div>
                  {[
                    { score: "≥ 90%", result: "TARGET TERIDENTIFIKASI", color: "#E62129" },
                    { score: "70–89%", result: "BUTUH VERIFIKASI MANUAL", color: "#FFC107" },
                    { score: "< 70%", result: "TIDAK COCOK", color: "#444" },
                  ].map((row) => (
                    <div
                      key={row.score}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          padding: "12px 16px",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.5)",
                          borderRight: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {row.score}
                      </div>
                      <div
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: row.color,
                        }}
                      >
                        {row.result}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

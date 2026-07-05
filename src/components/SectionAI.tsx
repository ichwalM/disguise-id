"use client";

import { useRef, useEffect, useState } from "react";
import { Check, AlertTriangle, Zap } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const pipeline = [
  { label: "CCTV Frame Captured", status: "done", time: "0ms" },
  { label: "MTCNN Face Detection", status: "done", time: "12ms" },
  { label: "Occlusion Detection (Masker/Kacamata)", status: "done", time: "18ms" },
  { label: "U-Net VAE Inpainting (vae_nusantara_best_v2.pth)", status: "active", time: "..." },
  { label: "ArcFace Embedding Extraction", status: "pending", time: "—" },
  { label: "PUSIKNAS POLRI DB Matching", status: "pending", time: "—" },
  { label: "Similarity Score + Alert Output", status: "pending", time: "—" },
];

const reconstructStages = [
  { label: "INPUT ASLI", sublabel: "Wajah dengan masker", color: "#555", bg: "#1a1a1a" },
  { label: "AI INPAINTING", sublabel: "VAE sedang bekerja...", color: "#FFC107", bg: "#FFC10710" },
  { label: "REKONSTRUKSI", sublabel: "SSIM 94.74%", color: "#0056B3", bg: "#0056B310" },
];

const matchData = [
  ["CONFIDENCE", "96.4%"],
  ["TARGET ID", "DPO-2026-992"],
  ["LOKASI", "POS 3 MAKASSAR"],
  ["TIMESTAMP", "10:45:22 WITA"],
];

const decisionRows = [
  { score: "≥ 90%", result: "TARGET TERIDENTIFIKASI", color: "#E62129" },
  { score: "70–89%", result: "BUTUH VERIFIKASI MANUAL", color: "#FFC107" },
  { score: "< 70%", result: "TIDAK COCOK", color: "#444" },
];

export default function SectionAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [stageIdx, setStageIdx] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => setStageIdx((p) => (p + 1) % 3), 2200);
    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => setPipelineStep((p) => Math.min(p + 1, pipeline.length - 1)), 600);
    return () => clearInterval(interval);
  }, [isInView]);

  const card = (content: React.ReactNode, accent = "#0056B3") => (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(${accent === "#0056B3" ? "0,86,179" : "255,255,255"},0.15)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", overflow: "hidden" }}>
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      </div>
      {content}
    </div>
  );

  return (
    <section
      id="ai-engine"
      ref={sectionRef}
      style={{ backgroundColor: "#06060f", position: "relative", overflow: "hidden" }}
      className="py-16 md:py-32"
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

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Visualizer + Match */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>VAE_NUSANTARA_BEST_V2.PTH — INPAINTING</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ color: "#E62129", fontSize: "9px" }}
                  >
                    ● LIVE
                  </motion.span>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {reconstructStages.map((s, i) => (
                      <motion.div
                        key={s.label}
                        animate={{
                          borderColor: i <= stageIdx ? s.color : "#1a1a2e",
                          background: i === stageIdx ? `${s.color}15` : "rgba(0,0,0,0)",
                        }}
                        transition={{ duration: 0.6 }}
                        style={{
                          flex: 1,
                          height: "110px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${i <= stageIdx ? s.color : "#1a1a2e"}`,
                          gap: "8px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Active scan line */}
                        {i === stageIdx && (
                          <motion.div
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              height: "2px",
                              background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                              pointerEvents: "none",
                            }}
                          />
                        )}

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
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: i === 0
                                ? "linear-gradient(180deg, #222 0%, #222 50%, #111 50%)"
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
                            fontSize: "8px",
                            color: i <= stageIdx ? s.color : "#333",
                            letterSpacing: "0.05em",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}
                        >
                          {s.label}
                        </div>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "8px", color: i === stageIdx ? s.color : "rgba(255,255,255,0.2)", textAlign: "center" }}>
                          {s.sublabel}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: "3px", background: "#1a1a2e", marginBottom: "10px", position: "relative", overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${((stageIdx + 1) / 3) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      style={{
                        height: "100%",
                        background: reconstructStages[stageIdx].color,
                        position: "relative",
                      }}
                    >
                      <motion.div
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", top: 0, right: 0, width: "30%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                      />
                    </motion.div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: reconstructStages[stageIdx].color,
                      letterSpacing: "0.1em",
                    }}
                  >
                    STAGE {stageIdx + 1}/3 — {reconstructStages[stageIdx].sublabel.toUpperCase()}
                  </div>
                </div>
              </>
            )}

            {/* Match result */}
            <motion.div
              animate={isInView ? { borderColor: "rgba(230,33,41,0.8)", boxShadow: ["0 0 0 rgba(230,33,41,0)", "0 0 30px rgba(230,33,41,0.15)", "0 0 0 rgba(230,33,41,0)"] } : {}}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              style={{
                marginTop: "16px",
                border: "2px solid rgba(230,33,41,0.6)",
                background: "rgba(230,33,41,0.06)",
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
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <AlertTriangle size={14} />
                </motion.div>
                DPO TERIDENTIFIKASI
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
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
              </motion.div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {matchData.map(([k, v]) => (
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
            </motion.div>
          </motion.div>

          {/* Right: Pipeline + Decision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>DETECTION PIPELINE</span>
                  <span style={{ color: "#FFC107" }}>{pipeline.filter(p => p.status === "done").length}/{pipeline.length}</span>
                </div>
                <div>
                  {pipeline.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: step.status === "active" ? "rgba(255,193,7,0.04)" : "transparent",
                      }}
                    >
                      <motion.div
                        animate={step.status === "active" ? { boxShadow: ["0 0 0 rgba(255,193,7,0)", "0 0 12px rgba(255,193,7,0.5)", "0 0 0 rgba(255,193,7,0)"] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          width: "22px",
                          height: "22px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${step.status === "done" ? "#0056B3" : step.status === "active" ? "#FFC107" : "#2a2a3a"}`,
                          background: step.status === "done" ? "rgba(0,86,179,0.15)" : "transparent",
                        }}
                      >
                        {step.status === "done" && <Check size={12} color="#0056B3" />}
                        {step.status === "active" && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            style={{ width: "8px", height: "8px", background: "#FFC107", borderRadius: "50%", display: "block" }}
                          />
                        )}
                      </motion.div>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "11px",
                          fontWeight: step.status === "pending" ? 400 : 700,
                          color: step.status === "done" ? "#fff" : step.status === "active" ? "#FFC107" : "#333",
                          flex: 1,
                        }}
                      >
                        {step.label}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "9px",
                        color: step.status === "done" ? "rgba(0,86,179,0.7)" : "rgba(255,255,255,0.15)",
                        letterSpacing: "0.05em",
                      }}>
                        {step.time}
                      </span>
                      {step.status === "active" && (
                        <div style={{ display: "flex", gap: "3px" }}>
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              animate={{ opacity: [1, 0.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                              style={{ width: "4px", height: "4px", background: "#FFC107", borderRadius: "50%", display: "block" }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
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
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Zap size={11} />
                    DECISION ENGINE
                  </div>
                  {decisionRows.map((row, i) => (
                    <motion.div
                      key={row.score}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ background: `${row.color}10` }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.2s",
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
                      {i === 0 && (
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ marginLeft: "auto", marginRight: "16px", width: "6px", height: "6px", background: "#E62129", borderRadius: "50%" }}
                        />
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

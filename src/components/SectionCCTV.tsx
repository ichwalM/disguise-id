"use client";

import { useRef } from "react";
import { ScanLine, Cpu, ShieldAlert, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Live Feed Scan",
    sub: "Real-time CCTV Video Processing",
    desc: "Sistem menerima stream video langsung dari kamera CCTV area publik. Setiap frame dianalisis oleh AI dalam waktu kurang dari 50ms untuk mendeteksi keberadaan wajah manusia — termasuk yang menggunakan masker atau pelindung wajah.",
    icon: ScanLine,
    color: "#0056B3",
    tags: ["RTSP Stream", "4K Input", "Edge Processing", "<50ms Latency"],
    code: `> FRAME_CAPTURE: OK\n> FACE_DETECT: 1 target\n> OCCLUSION: MASKER\n> PASS_TO_VAE: true`,
  },
  {
    id: "02",
    title: "AI Inpainting — U-Net VAE",
    sub: "Rekonstruksi Wajah Tersembunyi",
    desc: "Otak AI kami (Universal U-Net Variational Autoencoder) 'melukis ulang' bagian wajah yang tertutup masker, kacamata hitam, atau pelindung fisik lainnya. Model dilatih khusus pada dataset wajah ras Asia Tenggara untuk akurasi anatomi maksimal.",
    icon: Cpu,
    color: "#FFC107",
    tags: ["U-Net VAE V2", "vae_nusantara_best_v2.pth", "SSIM 94.74%", "PyTorch"],
    code: `> MODEL: vae_nusantara_best_v2\n> INPAINT: processing...\n> SSIM_SCORE: 94.74%\n> CONFIDENCE: HIGH`,
  },
  {
    id: "03",
    title: "Database Matching",
    sub: "Pencocokan Identitas DPO Nasional",
    desc: "Wajah hasil rekonstruksi dicocokkan dengan database DPO Nasional yang bersumber dari PUSIKNAS POLRI menggunakan teknologi ArcFace embedding. Sistem menghasilkan similarity score real-time dan langsung mengirimkan alert ke petugas lapangan.",
    icon: ShieldAlert,
    color: "#E62129",
    tags: ["ArcFace Embed", "PUSIKNAS POLRI", "Firebase Alert", ">90% = MATCH"],
    code: `> DPO_DB: 20,000 records\n> EMBED_SIM: 96.4%\n> STATUS: MATCH_FOUND\n> ALERT: SENT_TO_FIELD`,
  },
];

export default function SectionCCTV() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="technology"
      ref={sectionRef}
      style={{ backgroundColor: "#0a0a14", padding: "128px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,86,179,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(0,86,179,0.06) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,86,179,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "80px" }}
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
            // CARA KERJA SISTEM
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            BAGAIMANA AI<br />
            <span style={{ color: "#0056B3" }}>MEMBONGKAR</span><br />
            PENYAMARAN
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative" }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.18 }}
                    style={{
                      position: "absolute",
                      left: "38px",
                      top: "100%",
                      width: "2px",
                      height: "1px",
                      minHeight: "32px",
                      background: `linear-gradient(180deg, ${step.color}60, ${steps[i + 1].color}30)`,
                      transformOrigin: "top",
                      zIndex: 2,
                    }}
                  />
                )}

                <motion.div
                  whileHover={{ borderLeftColor: step.color, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col lg:grid lg:grid-cols-[auto_1fr_auto] gap-8 lg:gap-8 lg:items-start"
                  style={{
                    borderLeft: `4px solid ${step.color}80`,
                    background: "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(4px)",
                    padding: "36px",
                    marginBottom: i < steps.length - 1 ? "32px" : "0",
                    position: "relative",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `rgba(${step.color === "#0056B3" ? "0,86,179" : step.color === "#FFC107" ? "255,193,7" : "230,33,41"},0.06)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  {/* Icon + Number */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <motion.div
                      whileHover={{ boxShadow: `0 0 20px ${step.color}60` }}
                      style={{
                        width: "52px",
                        height: "52px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${step.color}`,
                        color: step.color,
                        background: `${step.color}10`,
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      <Icon size={22} />
                    </motion.div>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: step.color,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {step.id}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.2em",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      {step.sub}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#fff",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.75,
                        maxWidth: "560px",
                        marginBottom: "16px",
                      }}
                    >
                      {step.desc}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            padding: "4px 10px",
                            border: `1px solid ${step.color}40`,
                            color: step.color,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Terminal code block */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.18 }}
                    className="hidden lg:block code-panel"
                    style={{
                      flexShrink: 0,
                      width: "240px",
                      background: "#06060f",
                      border: `1px solid ${step.color}25`,
                      padding: "16px",
                    }}
                  >
                    <div style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: `${step.color}`,
                      lineHeight: 1.9,
                      whiteSpace: "pre",
                    }}>
                      {step.code}
                    </div>
                  </motion.div>

                  {/* Bg number */}
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 900,
                      fontSize: "100px",
                      color: `${step.color}06`,
                      lineHeight: 1,
                      userSelect: "none",
                      flexShrink: 0,
                      position: "absolute",
                      right: "24px",
                      bottom: "8px",
                    }}
                  >
                    {step.id}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: "56px", display: "flex", justifyContent: "center" }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 32px",
            border: "1px solid rgba(0,86,179,0.3)",
            background: "rgba(0,86,179,0.05)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.15em",
          }}>
            <span style={{ color: "#0056B3" }}>PIPELINE SELESAI</span>
            <ArrowRight size={14} color="#0056B3" />
            <span>ALERT DIKIRIM KE PETUGAS LAPANGAN</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

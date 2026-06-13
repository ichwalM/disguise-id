"use client";

import { useRef, useEffect } from "react";
import { ScanLine, Cpu, ShieldAlert } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Live Feed Scan",
    sub: "Real-time CCTV Video Processing",
    desc: "Sistem menerima stream video langsung dari kamera CCTV area publik. Setiap frame dianalisis oleh AI dalam waktu kurang dari 50ms untuk mendeteksi keberadaan wajah manusia — termasuk yang menggunakan masker atau pelindung wajah.",
    icon: ScanLine,
    color: "#0056B3",
    tags: ["RTSP Stream", "4K Input", "Edge Processing", "<50ms Latency"],
  },
  {
    id: "02",
    title: "AI Inpainting — U-Net VAE Nusantara",
    sub: "Rekonstruksi Wajah Tersembunyi",
    desc: "Otak AI kami (Universal U-Net Variational Autoencoder) 'melukis ulang' bagian wajah yang tertutup masker, kacamata hitam, atau pelindung fisik lainnya. Model dilatih khusus pada dataset wajah ras Asia Tenggara (Nusantara) untuk akurasi rekonstruksi anatomi maksimal.",
    icon: Cpu,
    color: "#FFC107",
    tags: ["U-Net VAE V2", "vae_nusantara_best_v2.pth", "SSIM 94.74%", "PyTorch"],
  },
  {
    id: "03",
    title: "Database Matching — PUSIKNAS POLRI",
    sub: "Pencocokan Identitas DPO Nasional",
    desc: "Wajah hasil rekonstruksi dicocokkan dengan database DPO Nasional yang bersumber dari PUSIKNAS POLRI menggunakan teknologi ArcFace embedding. Sistem menghasilkan similarity score real-time dan langsung mengirimkan alert ke petugas lapangan.",
    icon: ShieldAlert,
    color: "#E62129",
    tags: ["ArcFace Embed", "PUSIKNAS POLRI", "Firebase Alert", ">90% = MATCH"],
  },
];

export default function SectionCCTV() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );
    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="technology"
      style={{
        backgroundColor: "#0a0a14",
        backgroundImage: `linear-gradient(135deg, rgba(0, 86, 179, 0.02) 0%, transparent 100%)`,
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
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

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "80px" }}>
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
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                ref={(el) => { itemsRef.current[i] = el; }}
                style={{
                  opacity: 0,
                  transform: "translateY(40px)",
                  transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
                  borderLeft: `4px solid ${step.color}`,
                  background: `linear-gradient(135deg, rgba(0, 86, 179, 0.08) 0%, rgba(0, 86, 179, 0.04) 100%), rgba(8, 8, 16, 0.6)`,
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 86, 179, 0.2)",
                  boxShadow: `
                    0 4px 16px rgba(0, 86, 179, 0.1),
                    0 8px 32px rgba(0, 86, 179, 0.05),
                    inset 0 0 20px rgba(0, 86, 179, 0.05)
                  `,
                  padding: "32px",
                  display: "flex",
                  gap: "32px",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  animation: `card-slide-up-cctvd 0.6s ease-out ${i * 0.1}s both`,
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
                {/* Icon + Number */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${step.color}`,
                      color: step.color,
                    }}
                  >
                    <Icon size={22} />
                  </div>
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
                      maxWidth: "640px",
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

                {/* Bg number */}
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900,
                    fontSize: "100px",
                    color: `${step.color}08`,
                    lineHeight: 1,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {step.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes card-slide-up-cctvd {
          from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { Bell, MapPin, Shield, CheckCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "🚨 TARGET DITEMUKAN",
    subtitle: "Confidence: 96.4% · Pos 3 Makassar",
    time: "Baru saja",
    color: "#E62129",
  },
  {
    id: 2,
    type: "processing",
    title: "🔄 AI REKONSTRUKSI",
    subtitle: "VAE V2 sedang bekerja — ETA: 2s",
    time: "2 detik lalu",
    color: "#FFC107",
  },
  {
    id: 3,
    type: "verified",
    title: "✅ TERVERIFIKASI",
    subtitle: "DPO-2026-992 · ArcFace 94.74%",
    time: "5 menit lalu",
    color: "#0056B3",
  },
];

const appTabs = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "🚨", label: "Alert" },
  { icon: "🕒", label: "Timeline" },
  { icon: "📂", label: "Evidence" },
  { icon: "📍", label: "Map" },
];

export default function SectionMobile() {
  return (
    <section
      className="relative w-full h-full flex items-center"
      style={{ zIndex: 1 }}
    >
      <div
        className="w-full max-w-[1400px] mx-auto px-8 lg:px-16"
        style={{ paddingTop: "80px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left: Content */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "#0056B3",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              // SECTION 08 — MOBILE INTEGRATION
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#fff",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              FIELD OPS
              <br />
              <span style={{ color: "#0056B3" }}>MOBILE APP</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
                maxWidth: "420px",
                marginBottom: "32px",
              }}
            >
              Petugas lapangan menerima notifikasi real-time lengkap dengan
              foto rekonstruksi, koordinat GPS, dan tingkat kepercayaan AI.{" "}
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>
                Respons kurang dari 3 detik.
              </strong>
            </p>

            {/* Feature list */}
            {[
              { icon: Bell, label: "Push Notification — Firebase FCM", color: "#FFC107" },
              { icon: MapPin, label: "GPS Tracking — Google Maps", color: "#E62129" },
              { icon: Shield, label: "End-to-End Encrypted", color: "#0056B3" },
              { icon: CheckCircle, label: "Verify / Reject Action", color: "#0056B3" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    border: `1px solid ${color}40`,
                    background: `${color}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color={color} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Phone Mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "260px",
                background: "rgba(8,8,16,0.95)",
                border: "1px solid rgba(0,86,179,0.3)",
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 0 60px rgba(0,86,179,0.2), 0 0 120px rgba(0,86,179,0.05)",
                position: "relative",
              }}
            >
              {/* Status bar */}
              <div
                style={{
                  padding: "12px 20px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <span>10:45</span>
                <span>DISGUISE-ID</span>
                <span>⚡5G</span>
              </div>

              {/* Notch */}
              <div
                style={{
                  width: "80px",
                  height: "6px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "3px",
                  margin: "0 auto 12px",
                }}
              />

              {/* Alert card — featured */}
              <div
                style={{
                  margin: "0 12px 10px",
                  background: "rgba(230,33,41,0.12)",
                  border: "1px solid rgba(230,33,41,0.4)",
                  borderRadius: "12px",
                  padding: "14px",
                  animation: "mobile-alert-pulse 3s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#E62129",
                      borderRadius: "50%",
                      animation: "mobile-ping 1.2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "10px",
                      color: "#E62129",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    🚨 TARGET FOUND
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {/* Face placeholder */}
                  <div
                    style={{
                      aspectRatio: "1",
                      background: "rgba(230,33,41,0.1)",
                      border: "1px solid rgba(230,33,41,0.3)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                    }}
                  >
                    👤
                  </div>
                  <div>
                    {[
                      ["CONF", "96.4%"],
                      ["ID", "DPO-992"],
                      ["LOC", "MKS-03"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                        <span style={{ color: "#E62129", fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "10px" }}>
                  <div
                    style={{
                      background: "rgba(0,86,179,0.4)",
                      borderRadius: "6px",
                      padding: "6px",
                      textAlign: "center",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "9px",
                      color: "#fff",
                    }}
                  >
                    ✓ CONFIRM
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "6px",
                      textAlign: "center",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    ✗ REJECT
                  </div>
                </div>
              </div>

              {/* Notifications list */}
              <div style={{ margin: "0 12px", marginBottom: "8px" }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        background: notif.color,
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: "5px",
                        boxShadow: `0 0 6px ${notif.color}`,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "9px",
                          color: "#fff",
                          fontWeight: 700,
                          marginBottom: "2px",
                        }}
                      >
                        {notif.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "8px",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        {notif.subtitle}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "7px",
                        color: "rgba(255,255,255,0.2)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notif.time}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  padding: "10px 8px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(8,8,16,0.9)",
                }}
              >
                {appTabs.map((tab, i) => (
                  <div
                    key={tab.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      opacity: i === 1 ? 1 : 0.4,
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "6px",
                        color: i === 1 ? "#E62129" : "rgba(255,255,255,0.4)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mobile-alert-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230,33,41,0.15); }
          50% { box-shadow: 0 0 20px 4px rgba(230,33,41,0.25); }
        }
        @keyframes mobile-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}

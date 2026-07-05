"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Wifi, AlertCircle, Radio } from "lucide-react";

const nodes = [
  { id: "MKS", city: "Makassar", x: 68, y: 60, active: true, dpo: true },
  { id: "JKT", city: "Jakarta", x: 38, y: 52, active: true, dpo: false },
  { id: "SBY", city: "Surabaya", x: 52, y: 58, active: true, dpo: false },
  { id: "MDN", city: "Medan", x: 22, y: 28, active: true, dpo: false },
  { id: "BDG", city: "Bandung", x: 40, y: 55, active: false, dpo: false },
  { id: "PLB", city: "Palembang", x: 33, y: 54, active: true, dpo: false },
  { id: "MND", city: "Manado", x: 79, y: 38, active: true, dpo: false },
  { id: "BLI", city: "Bali", x: 60, y: 65, active: true, dpo: false },
];

const connections = nodes
  .filter((n) => n.active)
  .flatMap((from) =>
    nodes
      .filter((n) => n.active && n.id !== from.id)
      .slice(0, 2)
      .map((to) => ({ from, to, key: `${from.id}-${to.id}` }))
  );

export default function SectionMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [pulseIdx, setPulseIdx] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % nodes.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isInView]);

  const activeCount = nodes.filter((n) => n.active).length;

  return (
    <section ref={sectionRef} style={{ backgroundColor: "#080810", position: "relative", overflow: "hidden" }} className="py-16 md:py-32" id="coverage">
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(0,86,179,0.25) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.05,
        }}
      />

      {/* Ambient glow left */}
      <div style={{ position: "absolute", top: "30%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,86,179,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "#0056B3",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}>
            // SECTION 07 — SMART CITY NETWORK
          </div>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 7vw, 80px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: "64px",
          }}>
            NATIONAL<br />
            <span style={{ color: "#0056B3" }}>COVERAGE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                position: "relative",
                border: "1px solid rgba(0,86,179,0.2)",
                background: "linear-gradient(135deg, rgba(0,86,179,0.04) 0%, rgba(0,0,0,0) 60%)",
                aspectRatio: "2/1",
                overflow: "hidden",
              }}
            >
              {/* Corner decorations */}
              {[["top:0;left:0", "borderTop:2px solid rgba(0,86,179,0.5);borderLeft:2px solid rgba(0,86,179,0.5)"],
                ["top:0;right:0", "borderTop:2px solid rgba(0,86,179,0.5);borderRight:2px solid rgba(0,86,179,0.5)"],
                ["bottom:0;left:0", "borderBottom:2px solid rgba(230,33,41,0.4);borderLeft:2px solid rgba(230,33,41,0.4)"],
                ["bottom:0;right:0", "borderBottom:2px solid rgba(230,33,41,0.4);borderRight:2px solid rgba(230,33,41,0.4)"],
              ].map(([pos, brd], i) => {
                const posObj: Record<string, string> = {};
                pos.split(";").forEach(p => { const [k, v] = p.split(":"); posObj[k] = v; });
                const brdObj: Record<string, string> = {};
                brd.split(";").forEach(p => { const [k, v] = p.split(":"); brdObj[k] = v; });
                return (
                  <div key={i} style={{ position: "absolute", width: "24px", height: "24px", ...posObj as any, ...brdObj as any }} />
                );
              })}

              {/* Map label */}
              <div style={{
                position: "absolute",
                top: "12px",
                left: "16px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "9px",
                color: "rgba(0,86,179,0.6)",
                letterSpacing: "0.2em",
                zIndex: 5,
              }}>
                INDONESIA SURVEILLANCE GRID
              </div>

              {/* Scanning sweep */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "200px",
                  height: "200px",
                  transform: "translate(-50%, -50%)",
                  background: "conic-gradient(from 0deg, rgba(0,86,179,0.06) 0deg, transparent 60deg)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              {/* SVG connections */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 50" preserveAspectRatio="none">
                {connections.map(({ from, to, key }) => (
                  <motion.line
                    key={key}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke="#0056B3"
                    strokeWidth="0.15"
                    strokeOpacity={0.3}
                    strokeDasharray="0.5 0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                ))}

                {/* Animated data packets */}
                {isInView && nodes.filter(n => n.active && !n.dpo).slice(0, 3).map((from, i) => {
                  const to = nodes.find(n => n.id === "MKS")!;
                  return (
                    <motion.circle
                      key={`packet-${from.id}`}
                      r="0.4"
                      fill={from.dpo ? "#E62129" : "#0056B3"}
                      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                      animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => (
                <div
                  key={node.id}
                  style={{ position: "absolute", left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)", zIndex: 4 }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Pulse rings */}
                  {node.active && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                        style={{
                          position: "absolute",
                          inset: "-4px",
                          border: `1px solid ${node.dpo ? "#E62129" : "#0056B3"}`,
                          borderRadius: "50%",
                        }}
                      />
                      {pulseIdx === i && (
                        <motion.div
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 4, opacity: 0 }}
                          transition={{ duration: 1.2 }}
                          style={{
                            position: "absolute",
                            inset: "-2px",
                            border: `1px solid ${node.dpo ? "#E62129" : "#0056B3"}`,
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Dot */}
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    style={{
                      width: "10px",
                      height: "10px",
                      background: node.dpo ? "#E62129" : node.active ? "#0056B3" : "#333",
                      boxShadow: node.dpo ? "0 0 12px #E62129" : node.active ? "0 0 8px #0056B3" : "none",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute",
                          bottom: "20px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(8,8,16,0.95)",
                          border: `1px solid ${node.dpo ? "#E62129" : "#0056B3"}`,
                          padding: "6px 10px",
                          whiteSpace: "nowrap",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: "9px",
                          color: node.dpo ? "#E62129" : "#fff",
                          pointerEvents: "none",
                          zIndex: 10,
                          boxShadow: `0 0 12px ${node.dpo ? "rgba(230,33,41,0.3)" : "rgba(0,86,179,0.3)"}`,
                        }}
                      >
                        {node.dpo && <span style={{ color: "#E62129", marginRight: "4px" }}>⚠ DPO FOUND — </span>}
                        {node.city}
                        <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{node.id} / {node.active ? "ONLINE" : "OFFLINE"}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Label */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "7px",
                      whiteSpace: "nowrap",
                      color: node.dpo ? "#E62129" : "rgba(0,86,179,0.8)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {node.id}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div style={{ position: "absolute", bottom: "12px", right: "16px", display: "flex", flexDirection: "column", gap: "5px", zIndex: 5 }}>
                {[{ c: "#E62129", l: "DPO FOUND" }, { c: "#0056B3", l: "ACTIVE NODE" }, { c: "#333", l: "OFFLINE" }].map(({ c, l }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>
                    <div style={{ width: "8px", height: "8px", background: c, flexShrink: 0 }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Active Nodes", value: activeCount, unit: "cities online", color: "#0056B3", icon: Wifi },
              { label: "CCTV Cameras", value: "512", unit: "units active", color: "#FFC107", icon: Radio },
              { label: "DPO Database", value: "20K+", unit: "records", color: "#E62129", icon: AlertCircle },
              { label: "Today Detections", value: "1,247", unit: "events", color: "#0056B3", icon: Wifi },
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, background: `rgba(${stat.color === "#0056B3" ? "0,86,179" : stat.color === "#FFC107" ? "255,193,7" : "230,33,41"},0.1)` }}
                  style={{
                    borderLeft: `3px solid ${stat.color}`,
                    background: "rgba(255,255,255,0.03)",
                    padding: "20px",
                    cursor: "default",
                    transition: "all 0.25s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "40%",
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)`,
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{stat.label}</div>
                    <StatIcon size={12} color={stat.color} />
                  </div>
                  <div style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 900, fontSize: "28px", color: "#fff", lineHeight: 1, marginBottom: "4px" }}>{stat.value}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>{stat.unit}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

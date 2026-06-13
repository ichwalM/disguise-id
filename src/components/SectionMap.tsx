"use client";

import { useRef, useEffect, useState } from "react";
import { MapPin } from "lucide-react";

// Indonesia city nodes
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

export default function SectionMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % nodes.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [visible]);

  const activeCount = nodes.filter((n) => n.active).length;

  return (
    <section ref={sectionRef} className="bg-[#080810] py-[120px] relative overflow-hidden" id="statistics">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255, 193, 7, 0.02) 0%, transparent 100%), radial-gradient(circle, rgba(0,86,179,0.3) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 30px 30px",
        }}
      />

      <div className="container mx-auto px-12 lg:px-20 relative z-10">
        <div className="font-mono text-xs tracking-[0.3em] text-[#0056B3] mb-4 uppercase">
          // SECTION 07 — SMART CITY NETWORK
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase text-white leading-[1] tracking-tighter mb-16">
          National<br />
          <span className="text-[#0056B3]">Coverage</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Map */}
          <div className="lg:col-span-2">
            <div
              className="relative border border-[#0056B3]/30 aspect-[2/1]"
              style={{
                background: `linear-gradient(135deg, rgba(0, 86, 179, 0.08) 0%, rgba(0, 86, 179, 0.04) 100%), rgba(8, 8, 16, 0.6)`,
                backdropFilter: "blur(20px)",
                boxShadow: `
                  0 4px 16px rgba(0, 86, 179, 0.1),
                  0 8px 32px rgba(0, 86, 179, 0.05),
                  inset 0 0 20px rgba(0, 86, 179, 0.05)
                `,
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.95)",
                transition: "opacity 0.8s ease, transform 0.8s ease, box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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
              {/* Map label */}
              <div className="absolute top-3 left-3 font-mono text-[10px] text-[#0056B3]/60 tracking-widest">
                INDONESIA SURVEILLANCE GRID
              </div>

              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                {nodes.filter((n) => n.active).map((from, i) =>
                  nodes.filter((n) => n.active && n.id !== from.id).slice(0, 2).map((to, j) => (
                    <line
                      key={`${from.id}-${to.id}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#0056B3"
                      strokeWidth="0.15"
                      strokeOpacity={0.3}
                      strokeDasharray="0.5 0.5"
                    />
                  ))
                )}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="absolute"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {/* Pulse ring */}
                  {node.active && (
                    <div
                      className="absolute inset-0 -m-3 border rounded-full animate-ping"
                      style={{
                        borderColor: node.dpo ? "#E62129" : "#0056B3",
                        animationDelay: `${i * 0.2}s`,
                        opacity: pulseIdx === i ? 0.8 : 0.2,
                      }}
                    />
                  )}
                  <div
                    className="w-3 h-3 relative"
                    style={{ background: node.dpo ? "#E62129" : node.active ? "#0056B3" : "#333" }}
                  />
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] whitespace-nowrap"
                    style={{ color: node.dpo ? "#E62129" : "#0056B3" }}
                  >
                    {node.id}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/40">
                  <div className="w-2 h-2 bg-[#E62129]" /> DPO FOUND
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/40">
                  <div className="w-2 h-2 bg-[#0056B3]" /> ACTIVE NODE
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white/40">
                  <div className="w-2 h-2 bg-[#333]" /> OFFLINE
                </div>
              </div>
            </div>
          </div>

          {/* Stats sidebar */}
          <div
            className="space-y-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            {[
              { label: "Active Nodes", value: activeCount, unit: "cities", color: "#0056B3" },
              { label: "CCTV Cameras", value: "512", unit: "units", color: "#FFC107" },
              { label: "DPO Database", value: "20K+", unit: "records", color: "#E62129" },
              { label: "Today Detections", value: "1,247", unit: "events", color: "#0056B3" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[#0056B3]/30 p-5"
                style={{
                  borderLeft: `3px solid ${stat.color}`,
                  background: `linear-gradient(135deg, rgba(0, 86, 179, 0.08) 0%, rgba(0, 86, 179, 0.04) 100%), rgba(8, 8, 16, 0.6)`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `
                    0 4px 16px rgba(0, 86, 179, 0.1),
                    0 8px 32px rgba(0, 86, 179, 0.05),
                    inset 0 0 20px rgba(0, 86, 179, 0.05)
                  `,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "default",
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
                <div className="font-mono text-[10px] text-white/40 tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-white font-heading">{stat.value}</div>
                <div className="font-mono text-[10px] text-white/30">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

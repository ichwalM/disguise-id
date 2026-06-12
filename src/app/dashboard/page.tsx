"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Check, Clock, Activity, Camera, Users, Zap, Shield } from "lucide-react";

const pipeline = [
  { label: "CCTV Feed", status: "done" },
  { label: "Face Detection", status: "done" },
  { label: "Face Cropping", status: "done" },
  { label: "VAE Reconstruction", status: "active" },
  { label: "Face Recognition", status: "pending" },
  { label: "Database Matching", status: "pending" },
  { label: "Similarity Score", status: "pending" },
];

const historyRows = [
  { time: "10:45:22", cam: "CAM_01_TERMINAL_A", target: "DPO-2026-992", score: "96.4%", status: "MATCH", statusColor: "#E62129" },
  { time: "10:42:15", cam: "CAM_05_STASIUN", target: "UNKNOWN", score: "12.3%", status: "CLEAR", statusColor: "#444" },
  { time: "10:38:09", cam: "CAM_12_BANDARA", target: "VERIFY", score: "74.1%", status: "REVIEW", statusColor: "#FFC107" },
  { time: "10:30:55", cam: "CAM_03_MALL", target: "UNKNOWN", score: "8.2%", status: "CLEAR", statusColor: "#444" },
];

const statsCards = [
  { label: "Active Cameras", value: "512", sub: "online", icon: Camera, color: "#0056B3" },
  { label: "Today's Detections", value: "1,247", sub: "events", icon: Activity, color: "#FFC107" },
  { label: "Active Alerts", value: "3", sub: "unresolved", icon: AlertTriangle, color: "#E62129" },
  { label: "AI Status", value: "98.2%", sub: "uptime", icon: Zap, color: "#0056B3" },
];

export default function DashboardPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-4 border-b-2 border-[#0056B3]/20">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase font-heading text-white">
            Real-Time Monitor
          </h1>
          <p className="font-mono text-xs text-white/30 tracking-widest mt-1">
            {new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" })} WITA
          </p>
        </div>
        <div className="flex gap-2">
          <button className="font-mono text-xs font-bold px-4 py-2 border border-[#E62129]/50 text-[#E62129] hover:bg-[#E62129]/10 transition-colors">
            EXPORT REPORT
          </button>
          <button className="font-mono text-xs font-bold px-4 py-2 bg-[#0056B3] text-white hover:bg-[#004ea3] transition-colors">
            + ADD CAMERA
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <Icon size={20} style={{ color: card.color }} />
                <span className="font-mono text-[10px] text-white/30 tracking-widest">{card.sub}</span>
              </div>
              <div className="text-3xl font-black font-heading text-white mb-1" style={{ color: card.value === "3" ? "#E62129" : undefined }}>
                {card.value}
              </div>
              <div className="font-mono text-[10px] text-white/40 tracking-widest">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main monitor grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CCTV Feed */}
        <div className="lg:col-span-2 border border-[#0056B3]/20 overflow-hidden">
          <div className="bg-[#0056B3]/10 border-b border-[#0056B3]/20 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0056B3]">
              <Camera size={14} />
              CAM_01_TERMINAL_A — MAKASSAR
            </div>
            <div className="font-mono text-[10px] text-[#E62129] animate-pulse font-bold tracking-widest">
              ● LIVE
            </div>
          </div>

          {/* Fake CCTV */}
          <div className="relative bg-[#030308] aspect-video flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/noisy-net.png')",
              }}
            />
            {/* Scan lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 4px)",
              }}
            />

            {/* Target detection box */}
            <div className="absolute" style={{ top: "28%", left: "35%", width: "120px", height: "140px" }}>
              {/* Animated corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E62129]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E62129]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E62129]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E62129]" />
              <div
                className="absolute -top-5 left-0 font-mono text-[9px] text-[#E62129] font-bold animate-pulse"
              >
                FACE DETECTED
              </div>
            </div>

            {/* HUD overlay */}
            <div className="absolute top-2 left-2 font-mono text-[9px] text-[#0056B3]/70">
              {new Date().toLocaleTimeString()} WITA
            </div>
            <div className="absolute top-2 right-2 font-mono text-[9px] text-white/40">
              ZOOM: 1.0x
            </div>
            <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white/30">
              RES: 4K • FPS: {30 + (tick % 3)} • BITRATE: 12Mbps
            </div>

            {/* Center placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-[#0056B3]/5 to-transparent flex items-center justify-center">
              <div className="text-white/10 font-mono text-xs">NO SIGNAL FEED</div>
            </div>
          </div>

          {/* Timestamp bar */}
          <div className="bg-[#030308] border-t border-[#0056B3]/10 px-4 py-2 flex gap-6">
            {["CAM_01", "CAM_02", "CAM_05", "CAM_12"].map((cam, i) => (
              <button
                key={cam}
                className={`font-mono text-[10px] font-bold tracking-widest transition-colors ${i === 0 ? "text-[#0056B3]" : "text-white/20 hover:text-white/50"}`}
              >
                {cam}
              </button>
            ))}
          </div>
        </div>

        {/* AI Process & Alert */}
        <div className="space-y-4">
          {/* Pipeline */}
          <div className="border border-[#0056B3]/20 overflow-hidden">
            <div className="bg-[#0056B3]/10 border-b border-[#0056B3]/20 px-4 py-2 font-mono text-xs font-bold text-[#0056B3]">
              AI PIPELINE
            </div>
            <div className="divide-y divide-white/5">
              {pipeline.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center border"
                    style={{
                      borderColor: step.status === "done" ? "#0056B3" : step.status === "active" ? "#FFC107" : "#2a2a3a",
                    }}
                  >
                    {step.status === "done" && <Check size={10} className="text-[#0056B3]" />}
                    {step.status === "active" && (
                      <span className="w-2 h-2 bg-[#FFC107] rounded-full animate-ping" />
                    )}
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color: step.status === "done" ? "#fff" : step.status === "active" ? "#FFC107" : "#333",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          <div className="border-2 border-[#E62129]/70 bg-[#E62129]/10 p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#E62129] font-bold tracking-widest mb-4">
              <AlertTriangle size={14} />
              TARGET IDENTIFIED
            </div>
            <div className="text-6xl font-black font-heading text-white mb-1">96.4%</div>
            <div className="font-mono text-[10px] text-white/50 mb-3">SIMILARITY SCORE</div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-white/30">TARGET ID</span>
                <span className="text-white font-bold">DPO-2026-992</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-white/30">LOCATION</span>
                <span className="text-white font-bold">POS-3 MAKASSAR</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-white/30">TIME</span>
                <span className="text-white font-bold">10:45:22 WITA</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="font-mono text-[10px] font-bold py-2 bg-[#0056B3] text-white hover:bg-[#004ea3] transition-colors">
                ✓ CONFIRM
              </button>
              <button className="font-mono text-[10px] font-bold py-2 border border-white/20 text-white/60 hover:border-white/50 transition-colors">
                ✗ REJECT
              </button>
              <button className="font-mono text-[10px] font-bold py-2 border border-[#FFC107]/50 text-[#FFC107] hover:bg-[#FFC107]/10 transition-colors">
                ⚠ REVIEW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detection History table */}
      <div className="border border-[#0056B3]/20">
        <div className="bg-[#0056B3]/10 border-b border-[#0056B3]/20 px-4 py-3 flex justify-between items-center">
          <span className="font-mono text-xs font-bold text-[#0056B3] tracking-widest">DETECTION HISTORY</span>
          <span className="font-mono text-[10px] text-white/30">{historyRows.length} events today</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["TIMESTAMP", "CAMERA NODE", "TARGET ID", "SCORE", "STATUS"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-white/30 tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyRows.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{row.time}</td>
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{row.cam}</td>
                  <td className="px-4 py-3 font-mono text-xs text-white">{row.target}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-white">{row.score}</td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-[10px] font-bold px-2 py-1"
                      style={{ color: row.statusColor, border: `1px solid ${row.statusColor}40`, background: `${row.statusColor}10` }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

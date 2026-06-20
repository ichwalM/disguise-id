import { createClient } from "@/utils/supabase/server";
import { Users, Activity, AlertTriangle, Zap, Clock } from "lucide-react";

// Server Component — fetch data langsung dari Supabase
export default async function DashboardPage() {
  const supabase = await createClient();

  // Ambil total pengguna dari mst_users (sesuai aturan skema)
  const { count: totalUsers } = await supabase
    .from("mst_users")
    .select("*", { count: "exact", head: true });

  // Ambil aktivitas terbaru dari mst_timelines (kolom identifier: title)
  const { data: timelines } = await supabase
    .from("mst_timelines")
    .select("title, created_at, id")
    .order("created_at", { ascending: false })
    .limit(8);

  const statsCards = [
    {
      label: "Total Pengguna",
      value: totalUsers?.toString() ?? "—",
      sub: "terdaftar",
      icon: Users,
      color: "#0056B3",
    },
    {
      label: "Today's Detections",
      value: "1,247",
      sub: "events",
      icon: Activity,
      color: "#FFC107",
    },
    {
      label: "Active Alerts",
      value: "3",
      sub: "unresolved",
      icon: AlertTriangle,
      color: "#E62129",
    },
    {
      label: "AI Uptime",
      value: "98.2%",
      sub: "status",
      icon: Zap,
      color: "#0056B3",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-4 border-b-2 border-[#0056B3]/20">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase font-heading text-white">
            Overview
          </h1>
          <p className="font-mono text-xs text-white/30 tracking-widest mt-1">
            {new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" })}{" "}
            WITA
          </p>
        </div>
        <div className="flex gap-2">
          <button className="font-mono text-xs font-bold px-4 py-2 border border-[#E62129]/50 text-[#E62129] hover:bg-[#E62129]/10 transition-colors">
            EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors relative overflow-hidden"
            >
              {/* Decorative corner */}
              <div
                className="absolute top-0 right-0 w-12 h-12 opacity-10"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${card.color} 50%)`,
                }}
              />
              <div className="flex justify-between items-start mb-3">
                <Icon size={20} style={{ color: card.color }} />
                <span className="font-mono text-[10px] text-white/30 tracking-widest">
                  {card.sub}
                </span>
              </div>
              <div
                className="text-3xl font-black font-heading text-white mb-1"
                style={{
                  color: card.label === "Active Alerts" ? "#E62129" : undefined,
                }}
              >
                {card.value}
              </div>
              <div className="font-mono text-[10px] text-white/40 tracking-widest">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed — dari mst_timelines */}
      <div className="border border-[#0056B3]/20">
        <div className="bg-[#0056B3]/10 border-b border-[#0056B3]/20 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0056B3]">
            <Clock size={14} />
            LOG AKTIVITAS SISTEM
          </div>
          <span className="font-mono text-[10px] text-white/30">
            {timelines?.length ?? 0} entri terbaru
          </span>
        </div>

        {timelines && timelines.length > 0 ? (
          <div className="divide-y divide-white/5">
            {timelines.map((entry, i) => (
              <div
                key={entry.id ?? i}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: i === 0 ? "#E62129" : "#0056B3",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-white font-bold truncate">
                    {entry.title}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="shrink-0 text-right">
                  <span className="font-mono text-[10px] text-white/30">
                    {entry.created_at
                      ? new Date(entry.created_at).toLocaleString("id-ID", {
                          timeZone: "Asia/Makassar",
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-12 text-center">
            <Clock size={32} className="text-white/10 mx-auto mb-3" />
            <p className="font-mono text-xs text-white/20 tracking-widest">
              BELUM ADA DATA LOG AKTIVITAS
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-[#0056B3]/20 p-4 bg-[#0056B3]/5">
          <div className="font-mono text-[10px] text-[#0056B3] tracking-widest mb-2">
            DATABASE STATUS
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0056B3] animate-pulse rounded-full" />
            <span className="font-mono text-xs text-white/60">
              Supabase Connected
            </span>
          </div>
        </div>
        <div className="border border-[#FFC107]/20 p-4 bg-[#FFC107]/5">
          <div className="font-mono text-[10px] text-[#FFC107] tracking-widest mb-2">
            AI ENGINE
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFC107] animate-pulse rounded-full" />
            <span className="font-mono text-xs text-white/60">
              3 Model Active
            </span>
          </div>
        </div>
        <div className="border border-[#E62129]/20 p-4 bg-[#E62129]/5">
          <div className="font-mono text-[10px] text-[#E62129] tracking-widest mb-2">
            TOTAL DPO
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E62129] animate-pulse rounded-full" />
            <span className="font-mono text-xs text-white/60">
              Monitoring Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

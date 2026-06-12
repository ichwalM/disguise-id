"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  FolderOpen,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Real-Time Monitor" },
  { href: "/dashboard/dpo", icon: Users, label: "DPO Management" },
  { href: "/dashboard/timeline", icon: Clock, label: "Timeline Forensik" },
  { href: "/dashboard/evidence", icon: FolderOpen, label: "Evidence Center" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col md:flex-row text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#06060f] border-b-2 md:border-b-0 md:border-r-2 border-[#0056B3]/20 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b-2 border-[#0056B3]/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0056B3] flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-heading font-black text-lg tracking-tighter">
              DISGUISE<span className="text-[#0056B3]">-ID</span>
            </span>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-3 border-b border-[#0056B3]/10 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E62129] animate-pulse rounded-full" />
          <span className="font-mono text-[10px] text-white/40 tracking-widest">SURVEILLANCE ACTIVE</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-xs font-bold tracking-wide transition-all group ${
                  isActive
                    ? "bg-[#0056B3] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* AI Status */}
        <div className="p-4 border-t border-[#0056B3]/10">
          <div className="bg-[#0056B3]/10 border border-[#0056B3]/30 p-3">
            <div className="font-mono text-[10px] text-[#0056B3] tracking-widest mb-2">AI ENGINE</div>
            {[
              { name: "VAE Nusantara v2", status: "ACTIVE" },
              { name: "ArcFace Embed", status: "ACTIVE" },
              { name: "YOLO Detect", status: "ACTIVE" },
            ].map((m) => (
              <div key={m.name} className="flex justify-between items-center py-1">
                <span className="font-mono text-[10px] text-white/40">{m.name}</span>
                <span className="font-mono text-[10px] text-[#0056B3] animate-pulse">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 border-b-2 border-[#0056B3]/20 flex items-center justify-between px-6 bg-[#06060f]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="font-mono text-xs text-white/30 tracking-widest hidden md:block">
            COMMAND CENTER v2.6.1
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#FFC107] bg-[#FFC107]/10 border border-[#FFC107]/30 px-3 py-1">
              <span className="w-1.5 h-1.5 bg-[#FFC107] animate-pulse rounded-full" />
              AI PROCESSING
            </div>
            <div className="w-8 h-8 bg-[#0056B3] flex items-center justify-center font-mono text-xs font-bold">
              OP
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

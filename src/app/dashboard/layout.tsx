"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderSearch,
  BrainCircuit,
  ScrollText,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { logoutAction } from "@/app/actions";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/forensik", icon: FolderSearch, label: "Kasus Forensik" },
  { href: "/dashboard/ai", icon: BrainCircuit, label: "Manajemen AI" },
  { href: "/dashboard/log", icon: ScrollText, label: "Log Aktivitas" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface UserProfile {
  full_name: string | null;
  role_id: string | null;
  email: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Ambil profil dari tabel mst_users (sesuai aturan skema)
      const { data } = await supabase
        .from("mst_users")
        .select("full_name, role_id")
        .eq("id", user.id)
        .single();

      setProfile({
        full_name: data?.full_name ?? null,
        role_id: data?.role_id ?? null,
        email: user.email ?? null,
      });
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAction();
  }

  // Ambil inisial dari nama atau email
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : profile?.email
    ? profile.email[0].toUpperCase()
    : "OP";

  const displayName = profile?.full_name ?? profile?.email ?? "Operator";

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
          <span className="font-mono text-[10px] text-white/40 tracking-widest">
            SURVEILLANCE ACTIVE
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Active match: exact untuk /dashboard, prefix untuk sub-routes
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
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
            <div className="font-mono text-[10px] text-[#0056B3] tracking-widest mb-2">
              AI ENGINE
            </div>
            {[
              { name: "VAE Nusantara v2", status: "ACTIVE" },
              { name: "ArcFace Embed", status: "ACTIVE" },
              { name: "YOLO Detect", status: "ACTIVE" },
            ].map((m) => (
              <div key={m.name} className="flex justify-between items-center py-1">
                <span className="font-mono text-[10px] text-white/40">
                  {m.name}
                </span>
                <span className="font-mono text-[10px] text-[#0056B3] animate-pulse">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile + Logout */}
        <div className="p-4 border-t-2 border-[#0056B3]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#0056B3] flex items-center justify-center font-mono text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs font-bold text-white truncate">
                {displayName}
              </div>
              <div className="font-mono text-[9px] text-white/30 tracking-widest truncate">
                {profile?.role_id ? `ROLE: ${profile.role_id}` : "OPERATOR"}
              </div>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 
              font-mono text-[10px] font-bold tracking-widest
              border border-[#E62129]/30 text-[#E62129]/60
              hover:border-[#E62129]/60 hover:text-[#E62129] hover:bg-[#E62129]/5
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {loggingOut ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <LogOut size={12} />
            )}
            {loggingOut ? "LOGGING OUT..." : "LOGOUT"}
          </button>
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
            <div className="hidden md:flex items-center gap-2">
              <User size={14} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/40 truncate max-w-32">
                {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

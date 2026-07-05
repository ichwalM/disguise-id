import { apiFetch } from "@/lib/api";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

interface Profile {
  fullName: string | null;
  email: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await apiFetch<Profile>("/api/auth/me");

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        userEmail={profile.email || "admin@disguise-id.com"}
        userName={profile.fullName || "Admin"}
      />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="lg:ml-64 mt-20 p-4 lg:p-8">{children}</main>
    </div>
  );
}

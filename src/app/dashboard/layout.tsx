import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/mysql";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";

interface UserRow {
  full_name: string | null;
  email: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }

  const rows = await query<UserRow[]>(
    "SELECT full_name, email FROM mst_users WHERE id = ? LIMIT 1",
    [session.userId]
  );
  const profile = rows[0];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        userEmail={profile?.email || "admin@disguise-id.com"}
        userName={profile?.full_name || "Admin"}
      />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="lg:ml-64 mt-20 p-4 lg:p-8">{children}</main>
    </div>
  );
}

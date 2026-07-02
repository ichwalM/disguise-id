'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/Header';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Fetch profile dari tabel mst_users (sesuai aturan skema)
        const { data } = await supabase
          .from('mst_users')
          .select('full_name, role_id')
          .eq('id', user.id)
          .single();

        setProfile({
          full_name: data?.full_name ?? null,
          role_id: data?.role_id ?? null,
          email: user.email ?? null,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        userEmail={profile?.email || 'admin@disguise-id.com'}
        userName={profile?.full_name || 'Admin'}
      />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="lg:ml-64 mt-20 p-4 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
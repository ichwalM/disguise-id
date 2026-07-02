'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import StatCard from '@/components/dashboard/StatCard';
import { Users, Activity, AlertCircle, Zap, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // Fetch total users
        const { data: users, error: usersError } = await supabase
          .from('mst_users')
          .select('id', { count: 'exact' });

        if (usersError) throw usersError;

        // Fetch recent activities
        const { data: timeline, error: timelineError } = await supabase
          .from('mst_timelines')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (timelineError) throw timelineError;

        setTotalUsers(users?.length || 0);
        setActivities(timeline || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-zinc-400">DISGUISE-ID Command Center</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-emerald-500/10 rounded-lg" />)}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Users size={24} />}
              label="Total Users"
              value={totalUsers}
              trend={{ direction: 'up', percentage: 12 }}
            />
            <StatCard
              icon={<Activity size={24} />}
              label="System Status"
              value="98%"
              trend={{ direction: 'up', percentage: 2 }}
              bgColor="from-cyan-500/10 to-blue-500/10"
            />
            <StatCard
              icon={<Zap size={24} />}
              label="Active Models"
              value={3}
              bgColor="from-amber-500/10 to-orange-500/10"
            />
            <StatCard
              icon={<BarChart3 size={24} />}
              label="Daily Requests"
              value="1,234"
              trend={{ direction: 'up', percentage: 8 }}
              bgColor="from-purple-500/10 to-pink-500/10"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity size={20} className="text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Recent Activities</h2>
              </div>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-500/5"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-white">{activity.title}</p>
                        <span className="text-xs text-zinc-400 ml-2">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-center py-6">No recent activities</p>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle size={20} className="text-cyan-400" />
                <h3 className="text-lg font-bold text-white">System Status</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'API Server', status: 'online' },
                  { name: 'Database', status: 'online' },
                  { name: 'AI Engine', status: 'online' },
                ].map((service, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-sm font-medium text-white">{service.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-400">{service.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

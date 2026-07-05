import { apiFetch } from "@/lib/api";
import { Clock } from "lucide-react";

interface Timeline {
  id: number;
  user_id: string | null;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
}

interface TimelinesResponse {
  data: Timeline[];
  total: number;
}

export default async function LogsPage() {
  const { data: logs, total } = await apiFetch<TimelinesResponse>("/api/timelines?limit=50");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Log Aktivitas</h1>
        <p className="text-zinc-400">{total} aktivitas tercatat</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-6 border-b border-purple-500/10">
          <Clock size={20} className="text-purple-400" />
          <h2 className="text-xl font-bold text-white">Riwayat</h2>
        </div>

        {logs.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">Belum ada aktivitas.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-white">{log.title}</p>
                  {log.description && (
                    <p className="text-sm text-zinc-400 mt-1">{log.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {log.status && (
                    <span className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {log.status}
                    </span>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { apiFetch } from "@/lib/api";
import { activateAiModelAction } from "./actions";
import AiModelForm from "@/components/dashboard/AiModelForm";
import { Zap } from "lucide-react";

interface AiModel {
  id: string;
  version_name: string;
  architecture_type: string;
  is_active: number | boolean | null;
  created_at: string | null;
}

interface AiModelsResponse {
  data: AiModel[];
  total: number;
}

export default async function AiModelsPage() {
  const { data: models, total } = await apiFetch<AiModelsResponse>("/api/ai-models?limit=50");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Manajemen AI</h1>
          <p className="text-zinc-400">{total} model terdaftar</p>
        </div>
        <AiModelForm />
      </div>

      <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-6 border-b border-amber-500/10">
          <Zap size={20} className="text-amber-400" />
          <h2 className="text-xl font-bold text-white">Daftar Model</h2>
        </div>

        {models.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">Belum ada model AI.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-amber-500/10">
                  <th className="p-4 font-medium">Versi</th>
                  <th className="p-4 font-medium">Arsitektur</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Dibuat</th>
                  <th className="p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => {
                  const isActive = Number(m.is_active) === 1;
                  return (
                    <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white font-medium">{m.version_name}</td>
                      <td className="p-4 text-zinc-400">{m.architecture_type}</td>
                      <td className="p-4">
                        {isActive ? (
                          <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-zinc-500/10 text-zinc-400 border border-zinc-500/30">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {m.created_at ? new Date(m.created_at).toLocaleString() : "-"}
                      </td>
                      <td className="p-4">
                        {!isActive && (
                          <form action={activateAiModelAction.bind(null, m.id)}>
                            <button
                              type="submit"
                              className="px-3 py-1 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                            >
                              Activate
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

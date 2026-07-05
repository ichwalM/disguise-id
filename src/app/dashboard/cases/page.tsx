import { apiFetch } from "@/lib/api";
import CaseForm from "@/components/dashboard/CaseForm";
import { FileText } from "lucide-react";

interface ForensicCase {
  id: string;
  case_number: string;
  investigator_id: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
}

interface CasesResponse {
  data: ForensicCase[];
  total: number;
}

export default async function CasesPage() {
  const { data: cases, total } = await apiFetch<CasesResponse>("/api/forensic-cases?limit=50");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Kasus Forensik</h1>
          <p className="text-zinc-400">{total} kasus tercatat</p>
        </div>
        <CaseForm />
      </div>

      <div className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-6 border-b border-emerald-500/10">
          <FileText size={20} className="text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Daftar Kasus</h2>
        </div>

        {cases.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">Belum ada kasus forensik.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-emerald-500/10">
                  <th className="p-4 font-medium">Nomor Kasus</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Catatan</th>
                  <th className="p-4 font-medium">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white font-medium">{c.case_number}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {c.status ?? "-"}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">{c.notes ?? "-"}</td>
                    <td className="p-4 text-zinc-500">
                      {c.created_at ? new Date(c.created_at).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <AlertTriangle size={40} className="text-red-400" />
      <div>
        <p className="text-white font-semibold">Gagal memuat data.</p>
        <p className="text-zinc-400 text-sm mt-1">{error.message || "Terjadi kesalahan tak terduga."}</p>
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 text-sm font-medium"
      >
        Coba lagi
      </button>
    </div>
  );
}

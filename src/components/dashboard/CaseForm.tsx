"use client";

import { useState, FormEvent } from "react";
import { createCaseAction } from "@/app/dashboard/cases/actions";
import { Loader, Plus } from "lucide-react";

export default function CaseForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createCaseAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-medium"
      >
        <Plus size={16} />
        Kasus Baru
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/80 border border-emerald-500/20 rounded-lg p-6 space-y-4"
    >
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="case_number"
          placeholder="Nomor kasus"
          required
          disabled={isLoading}
          className="px-3 py-2 bg-zinc-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          name="status"
          placeholder="Status (mis. open)"
          disabled={isLoading}
          className="px-3 py-2 bg-zinc-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          name="notes"
          placeholder="Catatan"
          disabled={isLoading}
          className="px-3 py-2 bg-zinc-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 text-sm"
        >
          {isLoading && <Loader size={16} className="animate-spin" />}
          Simpan
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          className="px-4 py-2 text-zinc-400 hover:text-white text-sm"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

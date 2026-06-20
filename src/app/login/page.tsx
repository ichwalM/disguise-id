"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
    // Jika sukses, loginAction akan redirect — tidak perlu handle di sini
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0056B3 1px, transparent 1px), linear-gradient(90deg, #0056B3 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0056B3]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#E62129]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Scan line animation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,86,179,0.015) 2px, rgba(0,86,179,0.015) 4px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0056B3] mb-4 relative">
            <Shield size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E62129] animate-pulse" />
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tighter text-white mb-1">
            DISGUISE<span className="text-[#0056B3]">-ID</span>
          </h1>
          <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
            Command Center Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#06060f] border-2 border-[#0056B3]/20 p-8 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0056B3]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0056B3]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0056B3]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0056B3]" />

          {/* Status bar */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#0056B3]/10">
            <span className="w-2 h-2 bg-[#E62129] animate-pulse rounded-full" />
            <span className="font-mono text-[10px] text-white/30 tracking-widest">
              SECURE AUTHENTICATION PORTAL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 p-3 bg-[#E62129]/10 border border-[#E62129]/40">
                <AlertTriangle
                  size={14}
                  className="text-[#E62129] shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-mono text-[10px] text-[#E62129] font-bold tracking-wider mb-0.5">
                    AUTH FAILED
                  </p>
                  <p className="font-mono text-[10px] text-[#E62129]/70">
                    {error === "Invalid login credentials"
                      ? "Email atau password salah. Periksa kembali kredensial Anda."
                      : error}
                  </p>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="operator@disguise-id.go.id"
                className="w-full bg-[#0a0a14] border border-[#0056B3]/20 text-white font-mono text-sm px-4 py-3 
                  placeholder:text-white/15 outline-none
                  focus:border-[#0056B3]/60 focus:bg-[#0056B3]/5
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0a14] border border-[#0056B3]/20 text-white font-mono text-sm px-4 py-3 pr-12
                    placeholder:text-white/15 outline-none
                    focus:border-[#0056B3]/60 focus:bg-[#0056B3]/5
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0056B3] text-white font-mono text-sm font-bold tracking-widest py-3.5 
                flex items-center justify-center gap-2
                hover:bg-[#004ea3] disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 uppercase mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Shield size={14} />
                  MASUK KE SISTEM
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#0056B3]/10 text-center">
            <p className="font-mono text-[9px] text-white/20 tracking-widest">
              AKSES TERBATAS — HANYA UNTUK PERSONIL BERWENANG
            </p>
          </div>
        </div>

        {/* Version tag */}
        <div className="text-center mt-4">
          <span className="font-mono text-[9px] text-white/15 tracking-widest">
            DISGUISE-ID COMMAND CENTER v2.6.1 • POLRI × PUSIKNAS
          </span>
        </div>
      </div>
    </div>
  );
}

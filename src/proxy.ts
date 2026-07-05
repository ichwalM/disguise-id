import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cek optimistic saja (keberadaan cookie, bukan verifikasi kriptografis) --
// verifikasi token yang sebenarnya terjadi di backend (disguise-api) setiap
// kali Server Component/Action memanggilnya lewat apiFetch (401 -> redirect).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get("session")?.value);

  // Proteksi rute /dashboard
  if (pathname.startsWith("/dashboard") && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan akses /login, redirect ke /dashboard
  if (pathname === "/login" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy di semua path kecuali:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico, gambar publik
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

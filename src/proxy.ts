import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Proteksi rute /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      // Jika tidak ada sesi, lempar ke /login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Ambil role_id pengguna dari mst_users menggunakan UUID dari Auth
    const { data: profile } = await supabase
      .from("mst_users")
      .select("role_id")
      .eq("id", user.id)
      .single();

    // Jika tidak ditemukan di mst_users atau tidak memiliki role_id yang diizinkan (misal selain role admin/operator/peneliti)
    // Asumsi: Jika punya row di mst_users dan role_id != null, mereka boleh masuk.
    if (!profile || !profile.role_id) {
      // Lempar ke halaman unauthorized atau tendang kembali ke /login
      // (Di sini kita tendang kembali ke /login untuk keamanan)
      await supabase.auth.signOut();
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login dan akses /login, redirect ke /dashboard
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
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

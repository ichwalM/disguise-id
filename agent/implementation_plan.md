# Implementation Plan: MVP Login & Admin Dashboard DISGUISE-ID

## 1. Project Context & Objectives
Tujuan dari fase ini adalah mengimplementasikan fitur Minimum Viable Product (MVP) berupa sistem Autentikasi (Login) dan Admin Dashboard untuk platform DISGUISE-ID. Platform ini menggunakan framework Next.js dan Supabase sebagai Backend-as-a-Service. Desain visual, tema warna, dan komponen UI (bergaya Neobrutalism) sudah tersedia di dalam repositori. Agent harus mematuhi panduan desain yang sudah ada dan tidak merombak gaya visual utama.

## 2. Supabase Client Setup
Tugas pertama adalah memastikan koneksi antara Next.js dan Supabase berjalan lancar.
* Kredensial `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah tersedia di file `.env.local`.
* Buat utilitas Supabase Client (direkomendasikan menggunakan `@supabase/ssr` atau pustaka standar Supabase JavaScript) di dalam folder `utils/supabase` atau direktori relevan yang sudah ada.
* Pastikan utilitas ini mendukung pemanggilan dari Server Components maupun Client Components di Next.js.

## 3. Login Page Implementation (`/login`)
Bangun halaman autentikasi untuk pengguna sistem (Admin/Peneliti).
* Gunakan komponen form dan gaya visual yang sudah ada di template proyek.
* Implementasikan autentikasi Email dan Password menggunakan fungsi `supabase.auth.signInWithPassword()`.
* Tampilkan pesan *error* (toast/alert) yang ramah pengguna jika kredensial salah.
* Jika login berhasil, lakukan *redirect* pengguna secara otomatis ke halaman `/dashboard`.
* Buat *middleware* rute (`middleware.ts`) untuk memproteksi rute `/dashboard`. Cegah akses publik dan lemparkan kembali ke `/login` jika sesi (*session*) Supabase tidak ditemukan.

## 4. Admin Dashboard Layout (`/dashboard`)
Bangun tata letak utama (Layout) untuk area Admin Dashboard.
* Integrasikan komponen Navbar/Header dan Sidebar yang sudah ada di dalam template.
* Sidebar harus memiliki tautan navigasi minimal: "Overview", "Kasus Forensik", "Manajemen AI", dan "Log Aktivitas".
* Buat fungsi *Logout* di Navbar atau Sidebar yang memanggil `supabase.auth.signOut()` dan mengarahkan pengguna kembali ke halaman utama atau `/login`.
* Ambil data profil pengguna yang sedang login (seperti `full_name` dan `role_id`) untuk ditampilkan di sudut profil antarmuka.

## 5. Dashboard MVP Content (Overview Page)
Isi halaman beranda dashboard (`/dashboard/page.tsx`) dengan metrik utama.
* Buat komponen *Statistic Cards* menggunakan gaya UI template untuk menampilkan ringkasan data.
* Tarik jumlah total pengguna dari database.
* Tarik aktivitas terbaru dari log riwayat sistem untuk ditampilkan dalam bentuk daftar *feed* atau tabel sederhana.

## 6. Strict Database Schema Rules
Dalam melakukan kueri (Fetch/Insert/Update) ke database PostgreSQL Supabase, agent **WAJIB MUTLAK** mematuhi struktur tabel *custom* berikut. Dilarang keras menggunakan nama tabel bawaan (*default*).
* Gunakan tabel `mst_roles` untuk kueri referensi hak akses (bukan tabel `roles`).
* Gunakan tabel `mst_users` sebagai tabel utama pengguna untuk menampilkan data profil (bukan tabel `users`).
* Gunakan tabel `mst_timelines` untuk menarik data log riwayat dan aktivitas sistem.
* Saat melakukan kueri ke tabel `mst_timelines`, ketahuilah bahwa kolom pengenal utama (*identifier*) untuk timeline tersebut bernama `title` (bukan `name`).

## 7. Execution Workflow
Eksekusi tugas ini langkah demi langkah.
1. Inisialisasi Supabase Client.
2. Buat dan fungsikan halaman Login.
3. Terapkan Middleware proteksi rute.
4. Susun struktur Layout Dashboard.
5. Fungsikan pemanggilan data di halaman Overview Dashboard dengan mematuhi aturan skema database.
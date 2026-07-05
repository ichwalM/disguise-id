# disguise-api

REST API backend untuk DISGUISE-ID. Berdiri sendiri (independen dari project Next.js di root), bisa di-deploy ke server terpisah dari frontend.

## Struktur

```
backend/
  src/
    config/env.ts            validasi & baca environment variables
    db/pool.ts                connection pool MySQL (mysql2)
    auth/jwt.ts                sign & verify JWT
    auth/middleware.ts          middleware requireAuth (Bearer token)
    routes/auth.routes.ts        POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
    routes/dashboard.routes.ts    GET /api/dashboard/stats
    app.ts                      setup express app (cors, json, routing, error handler)
    server.ts                   entrypoint (app.listen)
  migrations/mysql/*.sql       migration SQL, dijalankan lewat scripts/migrate.mjs
  scripts/migrate.mjs           migration runner (tracking via tabel `migrations`)
  scripts/make-migration.mjs     generator file migration baru
```

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Isi `.env.local` (sudah ada, sesuaikan kalau beda environment):

   ```
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3307
   MYSQL_USER=...
   MYSQL_PASSWORD=...
   MYSQL_DATABASE=...

   JWT_SECRET=...          # secret untuk sign/verify token, WAJIB diganti untuk production
   PORT=4000
   CORS_ORIGIN=http://localhost:3000   # origin frontend yang diizinkan, pisahkan dengan koma kalau lebih dari satu
   ```

3. Jalankan migrasi database (lihat bagian Migrasi di bawah):

   ```bash
   npm run migrate
   ```

4. Jalankan dev server:

   ```bash
   npm run dev
   ```

   Server jalan di `http://localhost:4000` (atau sesuai `PORT`).

## Migrasi database

Sama seperti sistem migrasi ala Laravel yang sudah dibuat sebelumnya, sekarang dimiliki penuh oleh backend:

```bash
npm run migrate           # jalankan migrasi yang belum diterapkan
npm run migrate:status     # lihat migrasi mana yang sudah/belum jalan
npm run migrate:make -- nama_migration   # bikin file migrasi baru bernomor otomatis
```

File migrasi ada di `migrations/mysql/*.sql`, dieksekusi berurutan berdasarkan nama file, dan tercatat di tabel `migrations` di database supaya tidak dijalankan dua kali.

## API Reference

Semua endpoint (kecuali `/api/auth/login` dan `/health`) butuh header:

```
Authorization: Bearer <token>
```

Token didapat dari response `/api/auth/login`.

### POST /api/auth/login

Request:
```json
{ "email": "user@example.com", "password": "secret" }
```

Response `200`:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "uuid", "email": "user@example.com", "roleId": 1 }
}
```

Response `401`: `{ "error": "Email atau password salah." }`

### GET /api/auth/me

Response `200`:
```json
{ "fullName": "Ichwal Admin", "email": "ichwal.admin@disguise.id" }
```

### POST /api/auth/logout

Response `200`: `{ "success": true }` — stateless (JWT tidak disimpan di server), endpoint ini hanya untuk simetri alur logout di sisi frontend.

### GET /api/dashboard/stats

Response `200`:
```json
{
  "totalUsers": 3,
  "recentActivities": [
    { "title": "...", "createdAt": "2026-07-01T00:00:00.000Z" }
  ]
}
```

## Build & Deploy

```bash
npm run build     # compile TypeScript ke dist/
npm start          # jalankan hasil build (butuh .env.local / env vars yang sama di server)
```

Saat deploy ke server terpisah dari frontend:
- Set semua environment variable di atas (`MYSQL_*`, `JWT_SECRET`, `PORT`) di server tersebut.
- Set `CORS_ORIGIN` ke origin tempat frontend production di-deploy (mis. `https://disguise-id.vercel.app`).
- Pastikan MySQL bisa diakses dari server backend (host/port/firewall).

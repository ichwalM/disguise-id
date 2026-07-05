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
    auth/roles.ts                ROLE_ID + middleware requireRole (RBAC)
    routes/auth.routes.ts        POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
    routes/dashboard.routes.ts    GET /api/dashboard/stats
    routes/roles.routes.ts        CRUD /api/roles
    routes/users.routes.ts        CRUD /api/users
    routes/timelines.routes.ts     CRUD /api/timelines
    routes/datasets.routes.ts      CRUD /api/datasets
    routes/ai-models.routes.ts      CRUD /api/ai-models (+ activate)
    routes/ai-training-logs.routes.ts  CRUD /api/ai-training-logs
    routes/forensic-cases.routes.ts   CRUD /api/forensic-cases
    routes/forensic-results.routes.ts  CRUD /api/forensic-results
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

## Role-based access control (RBAC)

3 role di-seed di `mst_roles` (lihat `migrations/mysql/002_seed_admin.sql`), dipakai lewat id di `src/auth/roles.ts` (`ROLE_ID.SUPER_ADMIN=1`, `ROLE_ID.OPERATOR=2`, `ROLE_ID.RESEARCHER=3`) karena id stabil sedangkan nama role bisa diubah lewat `/api/roles`.

| Resource | Read | Create/Update | Delete |
|---|---|---|---|
| `/api/roles` | Super Admin | Super Admin | Super Admin |
| `/api/users` | Super Admin | Super Admin | Super Admin |
| `/api/timelines` | siapa saja yang login | Super Admin, Operator | Super Admin |
| `/api/datasets` | siapa saja yang login | Super Admin, Researcher | Super Admin |
| `/api/ai-models` (+`/:id/activate`) | siapa saja yang login | Super Admin, Researcher | Super Admin |
| `/api/ai-training-logs` | siapa saja yang login | Super Admin, Researcher | Super Admin |
| `/api/forensic-cases` | siapa saja yang login | Super Admin, Operator | Super Admin |
| `/api/forensic-results` | siapa saja yang login | Super Admin, Operator | Super Admin |

Request tanpa role yang sesuai akan dapat `403 { "error": "Anda tidak punya akses untuk aksi ini." }`.

## Resource API (CRUD)

Semua endpoint di bawah butuh header `Authorization: Bearer <token>` dan tunduk pada tabel RBAC di atas. Body request/response memakai nama kolom yang sama persis dengan database (snake_case, mis. `dataset_name`, `full_name`) — beda dengan `/api/auth/*` dan `/api/dashboard/*` di atas yang sudah lebih dulu memakai camelCase.

Setiap resource (kecuali disebutkan lain) punya 5 endpoint dengan pola yang sama:

```
GET    /api/<resource>            list, query ?limit=&offset= (default 20, max 100), plus filter kalau ada
GET    /api/<resource>/:id        detail
POST   /api/<resource>            create -> 201, body resource
PUT    /api/<resource>/:id        partial update (field yang tidak dikirim tidak berubah) -> 200, body resource
DELETE /api/<resource>/:id        -> 200 { "success": true }
```

List response: `{ "data": [...], "total": number, "limit": number, "offset": number }`.

| Resource | Kolom body | Filter list |
|---|---|---|
| `/api/roles` | `role_name` | - |
| `/api/users` | `email`, `password` (di-hash bcrypt), `full_name`, `role_id`, `avatar_url` | - |
| `/api/timelines` | `user_id`, `title`, `description`, `status` | `?userId=` |
| `/api/datasets` | `dataset_name`, `description`, `total_images` | - |
| `/api/ai-models` | `version_name`, `architecture_type`, `hyperparameters` (object/JSON), `weights_storage_path` | - |
| `/api/ai-training-logs` | `model_id`, `epoch_number`, `generator_loss`, `discriminator_loss`, `duration_seconds` | `?modelId=` |
| `/api/forensic-cases` | `case_number`, `investigator_id`, `notes`, `status` | `?status=` |
| `/api/forensic-results` | `case_id`, `model_used`, `dataset_source`, `input_cctv_url`, `target_clean_url`, `output_ai_url`, `ssim_score`, `psnr_score`, `processing_time_ms` | `?caseId=` |

Endpoint tambahan di luar pola CRUD standar:

### PATCH /api/ai-models/:id/activate

Mengaktifkan satu model (`is_active = true`) dan otomatis menonaktifkan semua model lain dalam satu transaction (hanya boleh ada 1 model aktif). Kalau `:id` tidak ditemukan → `404`, dan model yang sedang aktif **tidak berubah**.

### Error response yang konsisten

- `400` — body tidak valid, atau foreign key merujuk ID yang tidak ada (`ER_NO_REFERENCED_ROW_2`).
- `401` — token tidak ada/tidak valid.
- `403` — role tidak diizinkan untuk aksi ini.
- `404` — resource dengan `:id` tersebut tidak ada.
- `409` — data duplikat (mis. `email`/`dataset_name`/`version_name` yang sudah punya unique constraint).

## Build & Deploy

```bash
npm run build     # compile TypeScript ke dist/
npm start          # jalankan hasil build (butuh .env.local / env vars yang sama di server)
```

Saat deploy ke server terpisah dari frontend:
- Set semua environment variable di atas (`MYSQL_*`, `JWT_SECRET`, `PORT`) di server tersebut.
- Set `CORS_ORIGIN` ke origin tempat frontend production di-deploy (mis. `https://disguise-id.vercel.app`).
- Pastikan MySQL bisa diakses dari server backend (host/port/firewall).

Panduan deployment production lengkap (Docker, Nginx, Cloudflare, alternatif pm2): lihat [docs/deploy_v1.md](docs/deploy_v1.md).

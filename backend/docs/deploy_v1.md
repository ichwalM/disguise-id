# Deploy v1 — disguise-api

Panduan deploy `backend/` (Express REST API) ke server production, terpisah dari frontend Next.js. Sesuai stack yang disebutkan di [flow.md](../../flow.md): Docker, Nginx, Ubuntu Server, Cloudflare.

Status di titik ini: API MVP sudah lengkap — auth (login/me/logout) + full CRUD 8 resource (`roles`, `users`, `timelines`, `datasets`, `ai-models`, `ai-training-logs`, `forensic-cases`, `forensic-results`) dengan RBAC per role, sudah diverifikasi manual end-to-end (lihat [README.md](../README.md) untuk API reference lengkap). Dokumen ini baru soal cara menaikkannya ke server, bukan tentang API-nya sendiri.

## 1. Prasyarat di server

- Ubuntu Server (atau distro Linux lain) dengan akses SSH.
- Docker + Docker Compose plugin terpasang (`curl -fsSL https://get.docker.com | sh`).
- MySQL 8 yang bisa diakses dari server ini (bisa di server yang sama atau managed DB terpisah — pastikan host/port/firewall-nya kebuka).
- Domain/subdomain yang sudah diarahkan (DNS) ke server, dan (opsional tapi direkomendasikan) berada di belakang Cloudflare untuk TLS + proxy.

## 2. Environment variables production

Siapkan file `.env.production` di server (JANGAN commit ke git — sama seperti `.env.local`, gitignored lewat pola `.env*`):

```
MYSQL_HOST=...
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...

JWT_SECRET=...          # generate baru untuk production, JANGAN pakai secret dari .env.local development
PORT=4000
CORS_ORIGIN=https://disguise-id.example.com   # origin frontend production, pisahkan koma kalau lebih dari satu
```

Generate `JWT_SECRET` baru, misalnya:

```bash
openssl rand -base64 32
```

## 3. Jalankan migrasi database

Migrasi dijalankan sekali dari mesin mana pun yang bisa akses MySQL production (server itu sendiri, atau laptop dengan port MySQL di-forward):

```bash
cd backend
npm install
node --env-file=.env.production scripts/migrate.mjs
node --env-file=.env.production scripts/migrate.mjs --status   # verifikasi
```

## 4. Build & jalankan image Docker

Dari `backend/` (Dockerfile sudah tersedia di `backend/Dockerfile`, multi-stage: install → `tsc` build → runtime image `node:22-slim`):

```bash
docker build -t disguise-api:v1 .

docker run -d \
  --name disguise-api \
  --restart unless-stopped \
  --env-file .env.production \
  -p 127.0.0.1:4000:4000 \
  disguise-api:v1
```

Catatan:
- Image **tidak** membawa `.env.local`/`.env.production` (di-`.dockerignore`) — env selalu di-inject saat `docker run` (`--env-file` atau `-e KEY=value`), bukan di-bake ke image. Ini supaya image yang sama bisa dipakai di banyak environment tanpa rebuild.
- Publish ke `127.0.0.1:4000` saja (bukan `0.0.0.0`), karena akses publik akan lewat Nginx reverse proxy (langkah berikutnya), bukan langsung ke container.
- Container punya `HEALTHCHECK` yang memanggil `GET /health` — cek dengan `docker ps` (kolom STATUS akan menunjukkan `healthy`/`unhealthy`).

Update ke versi baru:

```bash
docker build -t disguise-api:v2 .
docker stop disguise-api && docker rm disguise-api
docker run -d --name disguise-api --restart unless-stopped --env-file .env.production -p 127.0.0.1:4000:4000 disguise-api:v2
```

## 5. Reverse proxy Nginx

Contoh server block (`/etc/nginx/sites-available/disguise-api`):

```nginx
server {
    listen 80;
    server_name api.disguise-id.example.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Authorization header diteruskan otomatis oleh proxy_set_header Host di atas —
        # Nginx meneruskan semua header request kecuali yang eksplisit di-hapus.
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/disguise-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Cloudflare

- Arahkan DNS record `api.disguise-id.example.com` ke IP server, proxy status **Proxied** (awan oranye) untuk dapat TLS otomatis + DDoS protection.
- SSL/TLS mode: **Full** (bukan Flexible) kalau Nginx di server sudah pakai HTTPS lokal, atau **Flexible** kalau Nginx di atas hanya listen di port 80 (Cloudflare yang meng-handle TLS ke browser, koneksi Cloudflare→server tetap HTTP). Untuk MVP ini, Flexible sudah cukup selama origin server tidak diakses publik secara langsung selain lewat Cloudflare.
- Pastikan `CORS_ORIGIN` di `.env.production` sama persis dengan origin frontend yang di-deploy (termasuk skema `https://`).

## 7. Alternatif tanpa Docker (pm2)

Kalau server belum siap Docker, jalankan langsung dengan process manager:

```bash
cd backend
npm install
npm run build
npm install -g pm2
pm2 start dist/server.js --name disguise-api --env production
pm2 save
pm2 startup   # ikuti instruksi untuk auto-start saat reboot
```

Env variables tetap perlu di-set sebelum `pm2 start` (mis. lewat `export $(cat .env.production | xargs)` atau `pm2 start` dengan `--env-file` di versi pm2 yang mendukungnya). Reverse proxy Nginx + Cloudflare di langkah 5 & 6 tetap sama, cukup arahkan `proxy_pass` ke port yang dipakai pm2.

## 8. Checklist sebelum go-live

- [ ] `JWT_SECRET` production berbeda dari development, dan tidak pernah di-commit.
- [ ] `CORS_ORIGIN` sudah diarahkan ke origin frontend production yang benar.
- [ ] `npm run migrate:status` di database production menunjukkan semua migrasi ter-apply.
- [ ] Password akun seed default (`ichwal.admin@disguise.id` / `AdminRahasia123!`) sudah diganti lewat `PUT /api/users/:id` sebelum server dibuka ke publik.
- [ ] `GET https://api.disguise-id.example.com/health` bisa diakses dan mengembalikan `{"status":"ok"}`.
- [ ] Endpoint yang butuh Bearer token benar-benar menolak request tanpa token (`401`) saat dites dari luar (bukan cuma dari localhost).

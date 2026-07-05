# API Testing Guide — disguise-api

Panduan untuk menguji seluruh endpoint backend ([lihat referensi lengkap di README.md](../README.md)). Ada 2 cara: **Postman** (koleksi siap-pakai) atau **PowerShell/curl** (manual, tanpa install apa pun). Keduanya menguji request/response yang sama.

## Prasyarat

1. Database sudah dimigrasikan dan berisi akun admin default (lihat [README.md](../README.md) bagian Migrasi):
   - Email: `ichwal.admin@disguise.id`
   - Password: `AdminRahasia123!`
   - Role: Super Admin (`role_id = 1`)
2. Server jalan di lokal:
   ```bash
   cd backend
   npm run dev
   ```
   Default `http://localhost:4000`. Cek dulu masih hidup: `GET /health` harus balas `{"status":"ok"}`.

---

## Opsi A — Postman

File koleksi: **[postman_collection.json](postman_collection.json)** (Postman Collection v2.1, tinggal import).

### Import

1. Postman → **Import** → pilih file `backend/docs/postman_collection.json`.
2. Collection variable `baseUrl` sudah default ke `http://localhost:4000` — ubah lewat tab **Variables** di collection kalau server jalan di alamat lain.
3. Tidak perlu setup Environment terpisah — semua variable (`token`, id hasil create, dll) disimpan sebagai **collection variable** dan di-set otomatis oleh test script di tiap request.

### Cara jalan

Folder sudah diurutkan `1. Auth` → `11. RBAC Scenario`, didesain untuk dijalankan **berurutan dari atas ke bawah** (bisa lewat **Collection Runner**, jalankan seluruh collection sekaligus):

- **`1. Auth` → Login (Super Admin)`** wajib jalan duluan — dia menyimpan `token` yang dipakai semua request lain lewat collection-level Bearer auth.
- Request `Create ...` di tiap folder menyimpan `id` hasil create ke collection variable (mis. `datasetId`, `caseId`, `modelId`) yang dipakai otomatis oleh request `Get/Update/Delete` sesudahnya di folder yang sama.
- Folder `4. Users` membuat user Operator (`postman.operator@disguise.id`) yang dipakai lagi di folder `11. RBAC Scenario`.
- Setiap request punya **Tests** tab berisi assertion (`pm.test`) yang otomatis pass/fail — setelah Runner selesai, lihat ringkasan pass/fail di panel hasil.
- Request bertanda "expect 4xx" (mis. *Login - salah password*, *Operator POST datasets*) memang **sengaja** menguji jalur gagal — status selain 200/201 di situ justru yang benar.

### Kalau mau ulang dari awal

Collection sudah menyertakan request **Cleanup** di beberapa folder (menghapus data yang dibuat request sebelumnya) supaya bisa dijalankan berkali-kali tanpa numpuk data uji atau kena `409 duplikat`. Kalau Runner berhenti di tengah karena suatu request gagal, cek data yang mungkin belum ke-cleanup lewat `GET /api/<resource>` sebelum run ulang.

---

## Opsi B — PowerShell (tanpa Postman)

Jalankan blok-blok berikut di PowerShell secara berurutan (bisa disalin langsung).

### 1. Login & simpan token

```powershell
$base = "http://localhost:4000"
$login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" `
  -Body '{"email":"ichwal.admin@disguise.id","password":"AdminRahasia123!"}'
$h = @{ Authorization = "Bearer $($login.token)" }
Write-Output "roleId=$($login.user.roleId)"
```

### 2. Contoh CRUD (pola sama untuk semua resource, ganti nama resource & body)

```powershell
# Create
$ds = Invoke-RestMethod -Uri "$base/api/datasets" -Method Post -Headers $h -ContentType "application/json" `
  -Body '{"dataset_name":"Test Dataset","description":"desc","total_images":100}'

# List
Invoke-RestMethod -Uri "$base/api/datasets?limit=20&offset=0" -Headers $h

# Get by id
Invoke-RestMethod -Uri "$base/api/datasets/$($ds.id)" -Headers $h

# Update (partial - field yang tidak dikirim tidak berubah)
Invoke-RestMethod -Uri "$base/api/datasets/$($ds.id)" -Method Put -Headers $h -ContentType "application/json" `
  -Body '{"total_images":200}'

# Delete
Invoke-RestMethod -Uri "$base/api/datasets/$($ds.id)" -Method Delete -Headers $h
```

### 3. Tes RBAC (buat user Operator, login, cek 200 vs 403)

```powershell
$op = Invoke-RestMethod -Uri "$base/api/users" -Method Post -Headers $h -ContentType "application/json" `
  -Body (@{ email="operator.test@disguise.id"; password="OperatorPass123!"; role_id=2 } | ConvertTo-Json)

$opLogin = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" `
  -Body (@{ email="operator.test@disguise.id"; password="OperatorPass123!" } | ConvertTo-Json)
$opH = @{ Authorization = "Bearer $($opLogin.token)" }

# Diizinkan (Operator boleh kelola forensic-cases)
Invoke-RestMethod -Uri "$base/api/forensic-cases" -Method Post -Headers $opH -ContentType "application/json" `
  -Body '{"case_number":"RBAC-TEST-1"}'

# Ditolak (403) - datasets cuma Super Admin & Researcher
try {
  Invoke-RestMethod -Uri "$base/api/datasets" -Method Post -Headers $opH -ContentType "application/json" -Body '{"dataset_name":"x"}'
} catch { Write-Output "Status: $($_.Exception.Response.StatusCode.value__)" }   # expect 403

# Cleanup
Invoke-RestMethod -Uri "$base/api/users/$($op.id)" -Method Delete -Headers $h | Out-Null
```

### 4. Tes tanpa token (401)

```powershell
try { Invoke-RestMethod -Uri "$base/api/dashboard/stats" }
catch { Write-Output "Status: $($_.Exception.Response.StatusCode.value__)" }   # expect 401
```

---

## Checklist test case per endpoint

Field body & filter lengkap ada di [README.md](../README.md#resource-api-crud). Checklist di bawah fokus ke **skenario yang wajib dicoba**, bukan ulangan field reference.

| Endpoint | Happy path | Error case wajib dicoba |
|---|---|---|
| `POST /api/auth/login` | 200 + token | 401 password salah |
| `GET /api/auth/me` | 200 + profil | 401 tanpa token |
| `POST /api/auth/logout` | 200 | - |
| `GET /api/dashboard/stats` | 200 + totalUsers/recentActivities | 401 tanpa token |
| `/api/roles` (Super Admin) | CRUD 200/201 | 403 role lain, 404 id salah |
| `/api/users` (Super Admin) | CRUD 200/201 | 403 role lain, 409 email duplikat |
| `/api/timelines` | CRUD 200/201 | 400 tanpa `title`, 403 Researcher create, 403 non-Super-Admin delete |
| `/api/datasets` | CRUD 200/201 | 400 tanpa `dataset_name`, 403 Operator create |
| `/api/ai-models` | CRUD 200/201 | 400 tanpa `version_name`/`architecture_type`, 403 Operator create |
| `PATCH /api/ai-models/:id/activate` | 200, `is_active` pindah ke model target, model lain jadi `false` | 404 id salah **dan pastikan model yang tadinya aktif tetap aktif** (tidak ikut ke-nonaktifkan) |
| `/api/ai-training-logs` | CRUD 200/201 | 400 tanpa `epoch_number`, filter `?modelId=` |
| `/api/forensic-cases` | CRUD 200/201 | 400 tanpa `case_number`, filter `?status=`, 403 Researcher create |
| `/api/forensic-results` | CRUD 200/201 | 400 tanpa `input_cctv_url`, filter `?caseId=` |

Semua endpoint di atas (kecuali `login`) juga wajib dicoba **tanpa header Authorization** → harus selalu `401`, sebelum cek body/role sama sekali (`requireAuth` jalan duluan sebelum `requireRole`).

## Data uji

Semua contoh di dokumen ini pakai prefix yang jelas (`Postman Test ...`, `RBAC-...`, `operator.test@...`) supaya gampang dibedakan dari data asli dan gampang dibersihkan manual lewat `DELETE` kalau ada yang tertinggal.

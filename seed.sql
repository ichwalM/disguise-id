-- ====================================================================
-- SEEDER DATABASE DISGUISE-ID
-- ====================================================================
-- Petunjuk Penggunaan:
-- 1. Buka Dashboard Supabase Anda (https://supabase.com).
-- 2. Buka menu "SQL Editor" di panel sebelah kiri.
-- 3. Buat Query baru, salin seluruh isi file ini, lalu klik "Run".
-- ====================================================================

-- 1. Bersihkan data user lama (jika ada) untuk mencegah konflik / duplicate keys
DELETE FROM public.mst_users WHERE id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
);

DELETE FROM auth.users WHERE id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
);

-- 2. Insert Users ke auth.users (Supabase Internal Auth)
-- Password di-hash menggunakan bcrypt (crypt + gen_salt dari extension pgcrypto)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'authenticated',
    'authenticated',
    'ichwal.admin@disguise.id',
    crypt('AdminRahasia123!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'authenticated',
    'authenticated',
    'operator.cctv@disguise.id',
    crypt('OperatorAman123!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'authenticated',
    'authenticated',
    'dosen.peneliti@disguise.id',
    crypt('PenelitiData123!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW()
  );

-- 3. Insert Profil ke public.mst_users (Tabel Kustom Pengguna)
-- ID harus cocok dengan ID di tabel auth.users
-- role_id: 1 = Super Admin, 2 = Operator Forensik, 3 = Peneliti
INSERT INTO public.mst_users (id, full_name, role_id)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Ichwal Admin', 1),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Budi Operator', 2),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Dr. Pratama Peneliti', 3);

-- 4. Seed Awal untuk tabel mst_timelines (Log Aktivitas) agar Dashboard tidak kosong
-- Menghapus log lama agar tidak menumpuk saat rerun seeder
DELETE FROM public.mst_timelines;

INSERT INTO public.mst_timelines (title, created_at)
VALUES
  ('Sistem DISGUISE-ID diinisialisasi.', NOW() - INTERVAL '2 hours'),
  ('Kamera CCTV Regional Makassar dihubungkan.', NOW() - INTERVAL '90 minutes'),
  ('AI Engine VAE Nusantara v2 dimuat dengan sukses.', NOW() - INTERVAL '60 minutes'),
  ('Super Admin masuk ke sistem.', NOW() - INTERVAL '30 minutes');

#!/usr/bin/env node
// Generator file migrasi baru, mengikuti pola penomoran 001_, 002_, dst
// yang sudah dipakai di migrations/mysql/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations", "mysql");

const name = process.argv[2];
if (!name) {
  console.error("Cara pakai: npm run migrate:make -- nama_migration");
  console.error('Contoh   : npm run migrate:make -- create_notifications_table');
  process.exit(1);
}

fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });

const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));
const nextNumber =
  files.reduce((max, f) => {
    const match = f.match(/^(\d+)_/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;

const prefix = String(nextNumber).padStart(3, "0");
const slug = name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_+|_+$/g, "");

const fileName = `${prefix}_${slug}.sql`;
const filePath = path.join(MIGRATIONS_DIR, fileName);

if (fs.existsSync(filePath)) {
  console.error(`File sudah ada: ${fileName}`);
  process.exit(1);
}

const template = `-- ====================================================================
-- Migration: ${slug}
-- ====================================================================

`;

fs.writeFileSync(filePath, template);
console.log(`Dibuat: migrations/mysql/${fileName}`);

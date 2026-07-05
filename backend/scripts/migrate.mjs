#!/usr/bin/env node
// Runner migrasi ala Laravel untuk MySQL.
// Mencatat migrasi yang sudah diterapkan di tabel `migrations` sehingga
// `npm run migrate` hanya menjalankan file baru yang belum pernah dieksekusi.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations", "mysql");

async function getConnection() {
  const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Env MySQL belum lengkap, kurang: ${missing.join(", ")}. Pastikan menjalankan lewat "node --env-file=.env.local".`
    );
  }

  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  });
}

async function ensureMigrationsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      batch INT NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

async function getApplied(conn) {
  const [rows] = await conn.query("SELECT name, batch FROM migrations ORDER BY id");
  return rows;
}

async function printStatus(files, applied) {
  const appliedByName = new Map(applied.map((r) => [r.name, r.batch]));
  console.log("Status migrasi:\n");
  if (files.length === 0) {
    console.log("  (tidak ada file migrasi di migrations/mysql)");
    return;
  }
  for (const file of files) {
    const batch = appliedByName.get(file);
    console.log(batch !== undefined ? `  [x] ${file}  (batch ${batch})` : `  [ ] ${file}  (pending)`);
  }
}

async function run() {
  const showStatus = process.argv.includes("--status");
  const conn = await getConnection();

  try {
    await ensureMigrationsTable(conn);

    const files = listMigrationFiles();
    const applied = await getApplied(conn);

    if (showStatus) {
      await printStatus(files, applied);
      return;
    }

    const appliedNames = new Set(applied.map((r) => r.name));
    const pending = files.filter((f) => !appliedNames.has(f));

    if (pending.length === 0) {
      console.log("Tidak ada migrasi baru. Database sudah up to date.");
      return;
    }

    const [batchRows] = await conn.query(
      "SELECT COALESCE(MAX(batch), 0) AS maxBatch FROM migrations"
    );
    const batch = batchRows[0].maxBatch + 1;

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Migrating: ${file}`);
      await conn.query(sql);
      await conn.query("INSERT INTO migrations (name, batch) VALUES (?, ?)", [file, batch]);
      console.log(`Migrated:  ${file}`);
    }

    console.log(`\nSelesai. ${pending.length} migrasi diterapkan pada batch ${batch}.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error("Migrasi gagal:", err.message);
  process.exit(1);
});

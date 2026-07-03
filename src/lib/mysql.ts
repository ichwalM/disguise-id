import mysql from "mysql2/promise";

// Koneksi MySQL sementara untuk testing.
// Nanti akan kembali menggunakan Supabase sebagai sumber data utama.
let pool: mysql.Pool | undefined;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

type QueryParam = string | number | boolean | null;

export async function query<T>(sql: string, params?: QueryParam[]) {
  const [rows] = await getPool().execute(sql, params);
  return rows as T;
}

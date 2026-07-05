import mysql from "mysql2/promise";
import { env } from "../config/env.js";

let pool: mysql.Pool | undefined;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysqlHost,
      port: env.mysqlPort,
      user: env.mysqlUser,
      password: env.mysqlPassword,
      database: env.mysqlDatabase,
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

export async function withTransaction<T>(
  handler: (exec: (sql: string, params?: QueryParam[]) => Promise<unknown>) => Promise<T>
): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await handler((sql, params) => conn.execute(sql, params));
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

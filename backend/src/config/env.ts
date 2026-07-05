const required = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_DATABASE",
  "JWT_SECRET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Env ${key} belum diset. Cek file .env.local di folder backend/.`);
  }
}

export const env = {
  mysqlHost: process.env.MYSQL_HOST!,
  mysqlPort: Number(process.env.MYSQL_PORT ?? 3306),
  mysqlUser: process.env.MYSQL_USER!,
  mysqlPassword: process.env.MYSQL_PASSWORD ?? "",
  mysqlDatabase: process.env.MYSQL_DATABASE!,
  jwtSecret: process.env.JWT_SECRET!,
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim()),
};

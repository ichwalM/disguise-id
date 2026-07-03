"use server";

import bcrypt from "bcryptjs";
import { query } from "@/lib/mysql";
import { createSession, deleteSession } from "@/lib/session";

interface UserRow {
  id: string;
  password_hash: string;
  role_id: number | null;
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const rows = await query<UserRow[]>(
    "SELECT id, password_hash, role_id FROM mst_users WHERE email = ? LIMIT 1",
    [email]
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: "Email atau password salah." };
  }

  await createSession(user.id, user.role_id);
  return { success: true };
}

export async function logoutAction() {
  await deleteSession();
}

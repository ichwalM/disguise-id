"use server";

import { apiLogin, ApiError } from "@/lib/api";
import { setAuthToken, clearAuthToken } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { token } = await apiLogin(email, password);
    await setAuthToken(token);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Email atau password salah." };
    }
    return { error: "Tidak bisa terhubung ke server. Coba lagi nanti." };
  }
}

export async function logoutAction() {
  await clearAuthToken();
}

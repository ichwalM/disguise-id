import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Token JWT-nya diterbitkan & diverifikasi oleh backend (disguise-api).
// Di sini kita cuma relay: simpan apa adanya di cookie httpOnly, tidak
// pernah decode/verify sendiri.
export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    sameSite: "lax",
    path: "/",
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

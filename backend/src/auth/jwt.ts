import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

const encodedKey = new TextEncoder().encode(env.jwtSecret);

export interface AuthTokenPayload {
  sub: string;
  roleId: number | null;
  [key: string]: unknown;
}

export async function signAuthToken(userId: string, roleId: number | null) {
  return new SignJWT({ roleId } satisfies Omit<AuthTokenPayload, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

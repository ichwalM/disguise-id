import "server-only";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/session";

const API_URL = process.env.API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errBody.error ?? "Request gagal.");
  }

  return res.json() as Promise<T>;
}

export async function apiLogin(email: string, password: string) {
  return apiRequest<{ token: string; user: { id: string; email: string; roleId: number | null } }>(
    "/api/auth/login",
    { method: "POST", body: { email, password } }
  );
}

export async function apiFetch<T>(path: string, opts: Omit<RequestOptions, "token"> = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    return await apiRequest<T>(path, { ...opts, token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }
}

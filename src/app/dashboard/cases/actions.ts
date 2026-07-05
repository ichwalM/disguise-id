"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export async function createCaseAction(formData: FormData) {
  const case_number = formData.get("case_number") as string;
  const notes = formData.get("notes") as string;
  const status = formData.get("status") as string;

  if (!case_number?.trim()) {
    return { error: "Nomor kasus wajib diisi." };
  }

  try {
    await apiFetch("/api/forensic-cases", {
      method: "POST",
      body: { case_number, notes: notes || null, status: status || null },
    });
    revalidatePath("/dashboard/cases");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Tidak bisa terhubung ke server." };
  }
}

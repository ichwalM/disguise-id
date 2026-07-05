"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export async function createAiModelAction(formData: FormData) {
  const version_name = formData.get("version_name") as string;
  const architecture_type = formData.get("architecture_type") as string;
  const weights_storage_path = formData.get("weights_storage_path") as string;

  if (!version_name?.trim() || !architecture_type?.trim()) {
    return { error: "version_name dan architecture_type wajib diisi." };
  }

  try {
    await apiFetch("/api/ai-models", {
      method: "POST",
      body: { version_name, architecture_type, weights_storage_path: weights_storage_path || null },
    });
    revalidatePath("/dashboard/ai");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Tidak bisa terhubung ke server." };
  }
}

export async function activateAiModelAction(id: string, _formData: FormData) {
  await apiFetch(`/api/ai-models/${id}/activate`, { method: "PATCH" });
  revalidatePath("/dashboard/ai");
}

"use server";

import { getDb } from "@/db/index";
import { presets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePreset(id) {
  try {
    const db = getDb();

    // Удаление из базы данных
    const result = await db.delete(presets).where(eq(presets.id, id));

    // Обновление кэша страницы каталога
    revalidatePath("/catalog");

    return {
      success: true,
      data: {
        affectedRows: result.affectedRows,
      },
    };
  } catch (error) {
    console.error("Ошибка при удалении пресета:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при удалении пресета",
    };
  }
}

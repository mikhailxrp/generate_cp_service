"use server";

import { getDb } from "@/db/index";
import { compat } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteCompat(id) {
  try {
    const db = getDb();

    // Удаление из базы данных
    const result = await db.delete(compat).where(eq(compat.id, id));

    // Обновление кэша страницы каталога
    revalidatePath("/catalog");

    return {
      success: true,
      data: {
        affectedRows: result.affectedRows,
      },
    };
  } catch (error) {
    console.error("Ошибка при удалении совместимости:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при удалении совместимости",
    };
  }
}

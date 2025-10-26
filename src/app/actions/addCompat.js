"use server";

import { getDb } from "@/db/index";
import { compat } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCompat(formData) {
  try {
    const db = getDb();

    // Валидация обязательных полей
    if (!formData.inverterSku || !formData.essSku) {
      return {
        success: false,
        error: "Заполните поля 'Инвертор (SKU)' и 'ESS (SKU)'",
      };
    }

    // Проверка на уникальность пары инвертор-ESS
    const existingCompat = await db
      .select()
      .from(compat)
      .where(
        and(
          eq(compat.inverterSku, formData.inverterSku.trim()),
          eq(compat.essSku, formData.essSku.trim())
        )
      )
      .limit(1);

    if (existingCompat.length > 0) {
      return {
        success: false,
        error: "Совместимость с такой парой инвертор-ESS уже существует",
      };
    }

    // Подготовка данных для вставки
    const compatData = {
      inverterSku: formData.inverterSku.trim(),
      essSku: formData.essSku.trim(),
      isCompatible: formData.isCompatible === "true" ? 1 : 0,
      limits: formData.limits?.trim() || null,
      comment: formData.comment?.trim() || null,
    };

    // Вставка в базу данных
    const result = await db.insert(compat).values(compatData);

    // Обновление кэша страницы каталога
    revalidatePath("/catalog");

    return {
      success: true,
      data: {
        insertId: result.insertId,
        affectedRows: result.affectedRows,
      },
    };
  } catch (error) {
    console.error("Ошибка при добавлении совместимости:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при добавлении совместимости",
    };
  }
}

"use server";

import { getDb } from "@/db/index";
import { presets } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addPreset(formData) {
  try {
    const db = getDb();

    // Валидация обязательных полей
    if (!formData.useCase) {
      return {
        success: false,
        error: "Заполните поле 'Use case'",
      };
    }

    // Подготовка данных для вставки
    let pvModuleSkusArray = null;
    if (formData.pvModuleSkus?.trim()) {
      // Разделяем по запятой и очищаем от пробелов
      pvModuleSkusArray = formData.pvModuleSkus
        .split(",")
        .map((sku) => sku.trim())
        .filter((sku) => sku.length > 0);
    }

    const presetData = {
      useCase: formData.useCase.trim(),
      rangeKwp: formData.rangeKwp?.trim() || null,
      pvModuleSkus: pvModuleSkusArray,
      inverterSku: formData.inverterSku?.trim() || null,
      essSku: formData.essSku?.trim() || null,
      pcsSku: formData.pcsSku?.trim() || null,
      mountSku: formData.mountSku?.trim() || null,
      notes: formData.notes?.trim() || null,
    };

    // Вставка в базу данных
    const result = await db.insert(presets).values(presetData);

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
    console.error("Ошибка при добавлении пресета:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при добавлении пресета",
    };
  }
}

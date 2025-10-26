"use server";

import { getDb } from "@/db/index";
import { services } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateService(serviceId, formData) {
  try {
    const db = getDb();

    // Валидация обязательных полей
    if (
      !formData.sku ||
      !formData.title ||
      !formData.serviceType ||
      !formData.basePrice
    ) {
      return {
        success: false,
        error: "Заполните все обязательные поля",
      };
    }

    // Проверка на уникальность SKU (исключая текущую услугу)
    const existingService = await db
      .select()
      .from(services)
      .where(and(eq(services.sku, formData.sku), ne(services.id, serviceId)))
      .limit(1);

    if (existingService.length > 0) {
      return {
        success: false,
        error: "Услуга с таким SKU уже существует",
      };
    }

    // Подготовка данных для обновления
    const updateData = {
      sku: formData.sku.trim(),
      title: formData.title.trim(),
      serviceType: formData.serviceType,
      description: formData.description?.trim() || null,
      basePrice: parseFloat(formData.basePrice),
      currency: formData.currency || "RUB",
      executionDays: formData.executionDays
        ? parseInt(formData.executionDays)
        : null,
      warrantyYears: formData.warrantyYears
        ? parseFloat(formData.warrantyYears)
        : null,
      comment: formData.comment?.trim() || null,
    };

    // Обновление в базе данных
    const result = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, serviceId));

    // Обновление кэша страницы каталога
    revalidatePath("/catalog");

    return {
      success: true,
      data: {
        affectedRows: result.affectedRows,
      },
    };
  } catch (error) {
    console.error("Ошибка при обновлении услуги:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при обновлении услуги",
    };
  }
}

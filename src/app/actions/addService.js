"use server";

import { getDb } from "@/db/index";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addService(formData) {
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

    // Проверка на уникальность SKU
    const existingService = await db
      .select()
      .from(services)
      .where(eq(services.sku, formData.sku))
      .limit(1);

    if (existingService.length > 0) {
      return {
        success: false,
        error: "Услуга с таким SKU уже существует",
      };
    }

    // Подготовка данных для вставки
    const serviceData = {
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
      isActive: 1,
      priority: 0,
    };

    // Вставка в базу данных
    const result = await db.insert(services).values(serviceData);

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
    console.error("Ошибка при добавлении услуги:", error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при добавлении услуги",
    };
  }
}

"use server";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Сохранение результатов расчета окупаемости СЭС
 * @param {number} id - ID записи в main_information
 * @param {Object} paybackData - Результат расчета из функции calculatePayback
 * @returns {Promise<Object>} { success: true }
 */
export async function savePaybackDataAction(id, paybackData) {
  const db = getDb();

  await db
    .update(mainInformation)
    .set({
      paybackData: paybackData,
    })
    .where(eq(mainInformation.id, id));

  return { success: true };
}


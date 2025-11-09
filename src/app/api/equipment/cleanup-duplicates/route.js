import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { sql } from "drizzle-orm";

/**
 * DELETE /api/equipment/cleanup-duplicates
 * Удаляет дубликаты по id в таблице price_items
 * Оставляет запись с наименьшим id для каждой группы дубликатов
 */
export async function DELETE(request) {
  try {
    const db = getDb();

    // Находим и удаляем дубликаты по id
    // Оставляем запись с MIN(id) для каждой группы дубликатов по sku
    const result = await db.execute(sql`
      DELETE t1 FROM price_items t1
      INNER JOIN (
        SELECT sku, MIN(id) as min_id
        FROM price_items
        GROUP BY sku
        HAVING COUNT(*) > 1
      ) t2 ON t1.sku = t2.sku
      WHERE t1.id > t2.min_id
    `);

    const deletedCount = result.affectedRows || 0;

    return NextResponse.json({
      success: true,
      message: `Удалено дубликатов: ${deletedCount}`,
      deletedCount,
    });
  } catch (error) {
    console.error("Ошибка при очистке дубликатов:", error);
    return NextResponse.json(
      { error: `Ошибка при очистке: ${error.message}` },
      { status: 500 }
    );
  }
}

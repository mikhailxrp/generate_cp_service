import "dotenv/config";
import mysql from "mysql2/promise";

// Маппинг старых type_code на новые
const typeCodeMapping = {
  trans: "ct", // Трансформаторы тока
  el_panel: "panel_ac", // Щиты AC/DC
  krep: "mount", // Крепёж и BOS
  cpo_cs: "cpo90", // CPO90 (по умолчанию, так как в названиях упоминается CPO 90)
};

async function fixOrphanItems() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("🔧 Исправляю записи с устаревшими type_code...\n");

    for (const [oldCode, newCode] of Object.entries(typeCodeMapping)) {
      // Получаем category_id для нового кода
      const [category] = await connection.query(
        `SELECT id FROM price_categories WHERE code = ?`,
        [newCode]
      );

      if (category.length === 0) {
        console.log(
          `⚠️  Категория ${newCode} не найдена, пропускаю ${oldCode}`
        );
        continue;
      }

      const categoryId = category[0].id;

      // Обновляем type_code и category_id
      const [result] = await connection.query(
        `UPDATE price_items 
         SET type_code = ?, category_id = ?
         WHERE type_code = ?`,
        [newCode, categoryId, oldCode]
      );

      console.log(
        `✅ ${oldCode} → ${newCode}: обновлено ${result.affectedRows} записей`
      );
    }

    // Проверяем, остались ли записи с несуществующими type_code
    const [remaining] = await connection.query(`
      SELECT DISTINCT pi.type_code
      FROM price_items pi
      LEFT JOIN price_categories pc ON pc.code = pi.type_code
      WHERE pc.id IS NULL
    `);

    if (remaining.length > 0) {
      console.log("\n⚠️  Остались записи с несуществующими type_code:");
      remaining.forEach((row) => console.log(`  - ${row.type_code}`));
    } else {
      console.log("\n✅ Все записи имеют валидные type_code и category_id!");
    }

    // Пересчитываем category_id для всех записей (на случай, если что-то не совпало)
    console.log("\n🔄 Пересчитываю category_id для всех записей...");
    const [updateResult] = await connection.query(`
      UPDATE price_items pi
      JOIN price_categories pc ON pc.code = pi.type_code
      SET pi.category_id = pc.id
      WHERE pi.category_id != pc.id OR pi.category_id IS NULL
    `);
    console.log(`✅ Обновлено ${updateResult.affectedRows} записей`);

    console.log("\n✅ Готово!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

fixOrphanItems();

import "dotenv/config";
import mysql from "mysql2/promise";

const categories = [
  { code: "panel", title: "Солнечные модули", groupCode: "core" },
  { code: "inverter", title: "Инверторы", groupCode: "core" },
  { code: "ess", title: "ESS системы", groupCode: "core" },
  { code: "batt", title: "Аккумуляторы", groupCode: "core" },
  { code: "smartmeter", title: "Смартметры", groupCode: "accessory" },
  { code: "ct", title: "Трансформаторы тока", groupCode: "accessory" },
  { code: "cable", title: "Кабель", groupCode: "bos" },
  { code: "connector", title: "Соединители (MC4 и др.)", groupCode: "bos" },
  { code: "uzip", title: "УЗИП", groupCode: "bos" },
  { code: "fuse", title: "Предохранители", groupCode: "bos" },
  { code: "panel_ac", title: "Щиты AC/DC", groupCode: "bos" },
  { code: "mount", title: "Крепёж и BOS", groupCode: "bos" },
  { code: "lotki", title: "Лотки", groupCode: "bos" },
  { code: "krep_lotki", title: "Крепёж для лотков", groupCode: "bos" },
  { code: "metizi", title: "Метизы", groupCode: "bos" },
  { code: "pow_off", title: "Выключатели нагрузки", groupCode: "bos" },
  { code: "cpo90", title: "CPO90", groupCode: "bos" },
  { code: "cs90", title: "CS90", groupCode: "bos" },
  { code: "dpt_t", title: "DPT-T", groupCode: "bos" },
  { code: "sunhors", title: "Комплекты SUNHORS", groupCode: "other" },
  { code: "demo", title: "Демо-оборудование", groupCode: "other" },
];

async function updateCategories() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("🔄 Обновляю категории...\n");

    for (const cat of categories) {
      // Проверяем, существует ли категория
      const [existing] = await connection.query(
        `SELECT id FROM price_categories WHERE code = ?`,
        [cat.code]
      );

      if (existing.length > 0) {
        // Обновляем существующую
        await connection.query(
          `UPDATE price_categories 
           SET title = ?, group_code = ?, updated_at = NOW()
           WHERE code = ?`,
          [cat.title, cat.groupCode, cat.code]
        );
        console.log(
          `✅ Обновлена: ${cat.code} → ${cat.title} (${cat.groupCode})`
        );
      } else {
        // Создаем новую
        await connection.query(
          `INSERT INTO price_categories (code, title, group_code, is_active, created_at, updated_at)
           VALUES (?, ?, ?, 1, NOW(), NOW())`,
          [cat.code, cat.title, cat.groupCode]
        );
        console.log(
          `➕ Создана: ${cat.code} → ${cat.title} (${cat.groupCode})`
        );
      }
    }

    console.log("\n📊 Итоговый список категорий:");
    const [all] = await connection.query(
      `SELECT id, code, title, group_code FROM price_categories ORDER BY code`
    );
    all.forEach((row) => {
      console.log(`  ${row.id}. ${row.code} → ${row.title} (${row.groupCode})`);
    });

    console.log("\n✅ Категории обновлены!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCategories();

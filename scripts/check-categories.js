import "dotenv/config";
import mysql from "mysql2/promise";

async function checkCategories() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("📊 Проверяю категории...\n");

    const [categories] = await connection.query(
      `SELECT id, code, title, group_code, is_active 
       FROM price_categories 
       ORDER BY code`
    );

    console.log(`Всего категорий: ${categories.length}\n`);
    categories.forEach((cat) => {
      console.log(
        `${cat.id.toString().padStart(2, " ")}. ${cat.code.padEnd(
          15,
          " "
        )} → ${cat.title.padEnd(30, " ")} [${cat.group_code || "NULL"}]`
      );
    });

    // Проверяем, есть ли записи с неправильными type_code
    console.log(
      "\n🔍 Проверяю записи price_items с несуществующими type_code..."
    );
    const [orphans] = await connection.query(`
      SELECT DISTINCT pi.type_code
      FROM price_items pi
      LEFT JOIN price_categories pc ON pc.code = pi.type_code
      WHERE pc.id IS NULL
    `);

    if (orphans.length > 0) {
      console.log("⚠️  Найдены записи с несуществующими type_code:");
      orphans.forEach((row) => console.log(`  - ${row.type_code}`));
    } else {
      console.log("✅ Все type_code имеют соответствующие категории");
    }

    // Статистика по группам
    console.log("\n📈 Статистика по группам:");
    const [stats] = await connection.query(`
      SELECT 
        pc.group_code,
        COUNT(DISTINCT pc.id) as categories_count,
        COUNT(pi.id) as items_count
      FROM price_categories pc
      LEFT JOIN price_items pi ON pi.category_id = pc.id
      GROUP BY pc.group_code
      ORDER BY pc.group_code
    `);

    stats.forEach((stat) => {
      console.log(
        `  ${(stat.group_code || "NULL").padEnd(15, " ")}: ${
          stat.categories_count
        } категорий, ${stat.items_count} товаров`
      );
    });
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkCategories();

import "dotenv/config";
import mysql from "mysql2/promise";

async function checkOrphanItems() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("🔍 Проверяю записи с несуществующими type_code...\n");

    const [orphans] = await connection.query(`
      SELECT 
        pi.id,
        pi.type_code,
        pi.sku,
        pi.title,
        pi.category_id
      FROM price_items pi
      LEFT JOIN price_categories pc ON pc.code = pi.type_code
      WHERE pc.id IS NULL
      ORDER BY pi.type_code
    `);

    if (orphans.length === 0) {
      console.log("✅ Все записи имеют валидные type_code");
      return;
    }

    console.log(
      `Найдено ${orphans.length} записей с несуществующими type_code:\n`
    );

    const grouped = {};
    orphans.forEach((row) => {
      if (!grouped[row.type_code]) {
        grouped[row.type_code] = [];
      }
      grouped[row.type_code].push(row);
    });

    Object.keys(grouped).forEach((typeCode) => {
      console.log(`\n📦 ${typeCode} (${grouped[typeCode].length} записей):`);
      grouped[typeCode].slice(0, 3).forEach((row) => {
        console.log(`   - ${row.sku}: ${row.title}`);
      });
      if (grouped[typeCode].length > 3) {
        console.log(`   ... и еще ${grouped[typeCode].length - 3} записей`);
      }
    });

    console.log("\n💡 Возможные маппинги:");
    console.log("   trans → ct (Трансформаторы тока)");
    console.log("   el_panel → panel_ac (Щиты AC/DC)");
    console.log("   krep → mount (Крепёж и BOS)");
    console.log("   cpo_cs → cpo90 или cs90");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkOrphanItems();

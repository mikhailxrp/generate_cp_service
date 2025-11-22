import "dotenv/config";
import mysql from "mysql2/promise";

async function verifyRelations() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log(
      "🔍 Детальная проверка связей price_items ↔ price_categories\n"
    );

    // 1. Проверяем структуру foreign key
    const [fkDetails] = await connection.query(`
      SELECT 
        kcu.CONSTRAINT_NAME,
        kcu.TABLE_NAME,
        kcu.COLUMN_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME,
        rc.UPDATE_RULE,
        rc.DELETE_RULE
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
        AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE kcu.TABLE_SCHEMA = DATABASE()
      AND kcu.TABLE_NAME = 'price_items'
      AND kcu.COLUMN_NAME = 'category_id'
    `);

    if (fkDetails.length > 0) {
      console.log("✅ Foreign Key Constraint найден:");
      fkDetails.forEach((fk) => {
        console.log(`   Имя: ${fk.CONSTRAINT_NAME}`);
        console.log(
          `   ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
        );
        console.log(`   UPDATE: ${fk.UPDATE_RULE}, DELETE: ${fk.DELETE_RULE}`);
      });
    } else {
      console.log("⚠️  Foreign Key Constraint не найден");
    }
    console.log();

    // 2. Проверяем, что все category_id валидны
    const [invalidIds] = await connection.query(`
      SELECT COUNT(*) as count
      FROM price_items pi
      LEFT JOIN price_categories pc ON pc.id = pi.category_id
      WHERE pc.id IS NULL
    `);

    if (invalidIds[0].count > 0) {
      console.log(
        `❌ Найдено ${invalidIds[0].count} записей с невалидными category_id`
      );
    } else {
      console.log(
        "✅ Все category_id валидны (ссылаются на существующие категории)"
      );
    }
    console.log();

    // 3. Проверяем соответствие type_code и category_id
    const [mismatches] = await connection.query(`
      SELECT COUNT(*) as count
      FROM price_items pi
      JOIN price_categories pc ON pc.id = pi.category_id
      WHERE pc.code != pi.type_code
    `);

    if (mismatches[0].count > 0) {
      console.log(
        `⚠️  Найдено ${mismatches[0].count} записей, где type_code не соответствует category_id`
      );

      const [examples] = await connection.query(`
        SELECT 
          pi.id,
          pi.type_code,
          pi.category_id,
          pc.code as category_code
        FROM price_items pi
        JOIN price_categories pc ON pc.id = pi.category_id
        WHERE pc.code != pi.type_code
        LIMIT 5
      `);

      console.log("   Примеры:");
      examples.forEach((row) => {
        console.log(
          `     ID ${row.id}: type_code=${row.type_code}, category_id=${row.category_id} (code=${row.category_code})`
        );
      });
    } else {
      console.log("✅ Все type_code соответствуют category_id");
    }
    console.log();

    // 4. Статистика по категориям
    const [categoryStats] = await connection.query(`
      SELECT 
        pc.id,
        pc.code,
        pc.title,
        pc.group_code,
        COUNT(pi.id) as items_count
      FROM price_categories pc
      LEFT JOIN price_items pi ON pi.category_id = pc.id
      GROUP BY pc.id, pc.code, pc.title, pc.group_code
      ORDER BY items_count DESC, pc.code
    `);

    console.log("📊 Статистика по категориям:");
    categoryStats.forEach((stat) => {
      console.log(
        `   ${stat.code.padEnd(15)} (id: ${stat.id
          .toString()
          .padStart(2)}) → ${stat.items_count
          .toString()
          .padStart(3)} товаров [${stat.group_code}]`
      );
    });
    console.log();

    // 5. Тест JOIN запроса
    const [testJoin] = await connection.query(`
      SELECT 
        pi.id,
        pi.sku,
        pi.type_code,
        pi.category_id,
        pc.code as category_code,
        pc.title as category_title,
        pc.group_code
      FROM price_items pi
      JOIN price_categories pc ON pc.id = pi.category_id
      LIMIT 3
    `);

    console.log("🧪 Тест JOIN запроса (первые 3 записи):");
    testJoin.forEach((row) => {
      console.log(
        `   ID ${row.id}: ${row.sku} | type_code: ${row.type_code} | category_id: ${row.category_id} → ${row.category_code} (${row.category_title}) [${row.group_code}]`
      );
    });

    console.log("\n✅ Проверка завершена!");
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

verifyRelations();

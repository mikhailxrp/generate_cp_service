import "dotenv/config";
import mysql from "mysql2/promise";

async function checkMigration() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("🔍 Проверяю структуру таблицы price_items...\n");

    // Проверяем наличие колонки category_id
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'price_items'
      AND COLUMN_NAME = 'category_id'
    `);

    if (columns.length === 0) {
      console.log("❌ Колонка category_id не найдена!");
      return;
    }

    console.log("✅ Колонка category_id найдена:");
    console.log(columns[0]);
    console.log();

    // Проверяем наличие индекса
    const [indexes] = await connection.query(`
      SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'price_items'
      AND COLUMN_NAME = 'category_id'
    `);

    console.log("📊 Индексы на category_id:");
    if (indexes.length === 0) {
      console.log("❌ Индекс не найден!");
    } else {
      indexes.forEach((idx) =>
        console.log(`  - ${idx.INDEX_NAME} (unique: ${idx.NON_UNIQUE === 0})`)
      );
    }
    console.log();

    // Проверяем наличие foreign key
    const [fks] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'price_items'
      AND COLUMN_NAME = 'category_id'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    console.log("🔗 Foreign keys на category_id:");
    if (fks.length === 0) {
      console.log(
        "⚠️  Foreign key constraint не найден (только логическая связь через индекс)"
      );
    } else {
      fks.forEach((fk) => {
        console.log(
          `  - ${fk.CONSTRAINT_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
        );
      });
    }
    console.log();

    // Проверяем данные - сколько записей имеют category_id
    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(category_id) as with_category,
        COUNT(*) - COUNT(category_id) as without_category
      FROM price_items
    `);

    console.log("📈 Статистика данных:");
    console.log(`  Всего записей: ${stats[0].total}`);
    console.log(`  С category_id: ${stats[0].with_category}`);
    console.log(`  Без category_id: ${stats[0].without_category}`);
    console.log();

    // Проверяем примеры данных
    const [samples] = await connection.query(`
      SELECT 
        pi.id,
        pi.type_code,
        pi.category_id,
        pc.code as category_code,
        pc.title as category_title
      FROM price_items pi
      LEFT JOIN price_categories pc ON pc.id = pi.category_id
      LIMIT 5
    `);

    console.log("📋 Примеры данных (первые 5 записей):");
    samples.forEach((row) => {
      console.log(
        `  ID: ${row.id}, type_code: ${row.type_code}, category_id: ${
          row.category_id
        }, category: ${row.category_code || "NULL"} (${
          row.category_title || "N/A"
        })`
      );
    });
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkMigration();

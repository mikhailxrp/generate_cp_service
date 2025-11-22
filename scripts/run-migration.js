import "dotenv/config";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    multipleStatements: true,
  });

  try {
    // Читаем SQL из файла миграции
    const migrationFile = join(
      __dirname,
      "../drizzle/0016_polite_master_chief.sql"
    );
    const sql = readFileSync(migrationFile, "utf-8");

    console.log("🚀 Выполняю миграцию...");
    console.log("SQL:", sql);

    // Выполняем миграцию
    await connection.query(sql);

    console.log("✅ Миграция успешно выполнена!");
  } catch (error) {
    console.error("❌ Ошибка при выполнении миграции:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();

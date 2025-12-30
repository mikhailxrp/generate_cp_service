import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  try {
    console.log("🔄 Выполнение миграции: add_payback_data.sql");
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "add_payback_data.sql"),
      "utf-8"
    );

    await connection.query(migrationSQL);
    
    console.log("✅ Миграция успешно выполнена!");
    console.log("   Добавлено поле payback_data в таблицу main_information");
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("ℹ️  Поле payback_data уже существует в таблице");
    } else {
      console.error("❌ Ошибка выполнения миграции:", error.message);
      throw error;
    }
  } finally {
    await connection.end();
  }
}

runMigration();


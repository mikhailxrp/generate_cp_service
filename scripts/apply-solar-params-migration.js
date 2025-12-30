import "dotenv/config";
import { getDb } from "../src/db/index.js";
import { sql } from "drizzle-orm";

async function applyMigration() {
  const db = getDb();

  try {
    console.log("Применяю миграцию для добавления полей солнечной радиации...");

    // Добавляем поля, если их еще нет
    await db.execute(sql`
      ALTER TABLE main_information 
      ADD COLUMN IF NOT EXISTS solar_angle DECIMAL(5, 2),
      ADD COLUMN IF NOT EXISTS solar_aspect DECIMAL(5, 2),
      ADD COLUMN IF NOT EXISTS solar_lat DECIMAL(10, 7),
      ADD COLUMN IF NOT EXISTS solar_lon DECIMAL(10, 7),
      ADD COLUMN IF NOT EXISTS solar_peakpower DECIMAL(10, 2)
    `);

    console.log("✓ Миграция успешно применена!");
    console.log("Добавлены поля:");
    console.log("  - solar_angle (угол наклона)");
    console.log("  - solar_aspect (азимут)");
    console.log("  - solar_lat (широта)");
    console.log("  - solar_lon (долгота)");
    console.log("  - solar_peakpower (пиковая мощность)");

    process.exit(0);
  } catch (error) {
    console.error("Ошибка при применении миграции:", error);
    process.exit(1);
  }
}

applyMigration();


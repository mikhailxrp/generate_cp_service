import { readFileSync } from "fs";
import { resolve } from "path";
import * as XLSX from "xlsx";
import { getDb } from "../src/db/index.js";
const db = getDb();
import { priceCategories, priceItems } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

const toBool = (v) => {
  if (v == null) return false;
  const s = String(v).toLowerCase().trim();
  return ["да", "1", "yes", "true", "y"].includes(s);
};

const mapDemoRowToPriceItem = (row, categoryId, index) => {
  const title = String(row["Полное_наименование"] || "").trim();
  const roofType = String(row["Тип_кровли"] || "").trim();

  // Базовый SKU: DEMO-<Тип_кровли>-<кусок имени>
  const skuRaw = `DEMO-${roofType || "GEN"}-${title}`.replace(/\s+/g, "_");
  const sku = skuRaw.slice(0, 90); // чтобы точно влезло в varchar(100)

  const attrs = {
    demo: {
      roof_type: row["Тип_кровли"] || null,
      system_type: row["Тип_системы"] || null,
      grid_type: row["Гибридная/Сетевая"] || null,
      email: row["email"] || null,
      password: row["password"] || null,
      app_url: row["url_на приложение"] || null,
      service_24_7: toBool(row["Сервис24_7"]),
      segment_b2c: toBool(row["Сегмент_Частник"]),
      segment_b2b: toBool(row["Сегмент_Юрлицо"]),
    },
    meta: {
      brand: row["Бренд"] || null,
      raw_category: row["Категория"] || null,
    },
  };

  return {
    categoryId,
    typeCode: "demo",
    sku,
    title,

    priceRub: 0,
    currency: "RUB",
    stock: 1,
    priority: 0,

    warehouseRegion: null,
    leadDays: 0,
    specUrl: row["url_на приложение"] || null,
    comment: row["Комментарий"] || null,

    attrs,
  };
};

async function importDemo() {
  try {
    console.log("🔄 Начинаю импорт демо-конфигураций (PRICE_DEMO)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);
    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_DEMO")) {
      throw new Error("Лист PRICE_DEMO не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_DEMO"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "demo"))
      .limit(1);

    if (!category) {
      throw new Error(
        "Категория demo не найдена! Добавь её в price_categories."
      );
    }

    console.log(`✅ Категория demo найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["Полное_наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapDemoRowToPriceItem(row, category.id);

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлен DEMO: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(
          `❌ Ошибка вставки DEMO "${row["Полное_наименование"]}": ${err.message}`
        );
      }
    }

    console.log("\n🎉 Импорт PRICE_DEMO завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importDemo();

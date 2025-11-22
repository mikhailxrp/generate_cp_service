import { readFileSync } from "fs";
import { resolve } from "path";
import * as XLSX from "xlsx";
import { getDb } from "../src/db/index.js";
const db = getDb();
import { priceCategories, priceItems } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

const toNum = (v) => {
  if (v == null) return null;
  const str = String(v).replace(",", ".").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
};

const toBool = (v) => {
  if (v == null) return false;
  const s = String(v).toLowerCase().trim();
  return ["да", "1", "yes", "true", "y"].includes(s);
};

const parseStockFlag = (v) => {
  // для этих позиций часто это услуги/спец.товары — считаем, что всегда доступны
  if (v == null) return 1;
  const s = String(v).toLowerCase().trim();
  if (["да", "yes", "есть", "1", "true"].includes(s)) return 1;
  if (["нет", "no", "0", "false"].includes(s)) return 0;
  return 1;
};

const mapSunhorsRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    service_24_7: toBool(row["Сервис24_7"]),
  };

  const attrs = {
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "sunhours",

    sku: String(row["SKU"] || "").trim(),
    title: String(
      row["Наименование"] || row["Полное_наименование"] || ""
    ).trim(),

    priceRub: toNum(row["Цена_базовая"]) ?? 0,
    currency: row["Валюта"] || "RUB",

    stock: parseStockFlag(null), // по умолчанию считаем "доступно"
    priority: 0,

    warehouseRegion: null,
    leadDays: 0,
    specUrl: null,
    comment: row["Комментарий"] || null,

    attrs,
  };
};

async function importSunhors() {
  try {
    console.log("🔄 Начинаю импорт позиций Sunhors (PRICE_SUNHORS)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);
    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_SUNHORS")) {
      throw new Error("Лист PRICE_SUNHORS не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_SUNHORS"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "sunhours"))
      .limit(1);

    if (!category) throw new Error("Категория sunhours не найдена!");

    console.log(`✅ Категория sunhours найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapSunhorsRowToPriceItem(row, category.id);

        await db.insert(priceItems).values(mapped);
        console.log(
          `➕ Добавлена позиция Sunhors: ${mapped.title} (${mapped.sku})`
        );
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт PRICE_SUNHORS завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importSunhors();

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

const toInt = (v) => {
  if (v == null) return null;
  const str = String(v).trim();
  if (!str) return null;
  const num = parseInt(str, 10);
  return Number.isNaN(num) ? null : num;
};

const toBool = (v) => {
  if (!v) return false;
  const s = String(v).toLowerCase().trim();
  return ["да", "1", "yes", "true", "есть", "y"].includes(s);
};

const parseStockFlag = (v) => {
  if (!v) return 0;
  const s = String(v).toLowerCase().trim();
  if (["да", "yes", "есть", "1"].includes(s)) return 1;
  if (["нет", "no", "0"].includes(s)) return 0;
  return 0;
};

const parsePriority = (v) => {
  if (!v) return 0;
  const s = String(v).toLowerCase().trim();
  if (s.startsWith("низ")) return 1;
  if (s.startsWith("сред")) return 2;
  if (s.startsWith("выс")) return 3;
  return 0;
};

const mapElPanelRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    etm_code: row["Код_ЭТМ"] || null,
    panel_type: row["Тип_щита"] || null, // AC/DC/ГРЩ/ЩУ
    ip_class: row["Степень_защиты_IP"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      panel_type: row["Тип_щита"] || null,
      ip_class: row["Степень_защиты_IP"] || null,
    },
    mechanical: {
      dimensions_mm: row["Размеры_мм(Ш×В×Г)"] || null,
      material: row["Материал"] || null,
      weight_kg: toNum(row["Вес_кг"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "panel_ac",

    sku: String(row["SKU"] || "").trim(),
    title: String(
      row["Наименование"] || row["Полное_наименование"] || ""
    ).trim(),

    priceRub: toNum(row["Цена_базовая"]) ?? 0,
    currency: row["Валюта"] || "RUB",

    stock: parseStockFlag(row["Наличие"]),
    priority: parsePriority(row["Приоритет"]),

    warehouseRegion: row["Регион_склада"] || null,
    leadDays: toInt(row["Срок_поставки_дни"]) || 0,
    specUrl: row["Ссылка_на_datasheet"] || null,
    comment: row["Комментарий"] || null,

    attrs,
  };
};

async function importElPanel() {
  try {
    console.log("🔄 Начинаю импорт электрических щитов (PRICE_panel_ac)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_panel_ac")) {
      throw new Error("Лист PRICE_panel_ac не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_panel_ac"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "panel_ac"))
      .limit(1);

    if (!category) throw new Error("Категория panel_ac не найдена!");

    console.log(`✅ Категория panel_ac найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapElPanelRowToPriceItem(row, category.id);

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлен щит: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт PRICE_panel_ac завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importElPanel();

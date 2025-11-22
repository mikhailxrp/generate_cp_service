import { resolve } from "path";
import { getDb } from "../src/db/index.js";
import { priceCategories, priceItems } from "../src/db/schema.js";
import {
  toNum,
  toInt,
  toBool,
  parseStockFlag,
  parsePriority,
  importFromCsv,
} from "./csvImportHelpers.js";

const db = getDb();

// ============================================================================
// МАППИНГ ДЛЯ CPO90 (идентично importCpo90.js)
// ============================================================================

const mapCpo90RowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    etm_code: row["Код_ЭТМ"] || null,
    zinc_type: row["Тип_оцинковки"] || null,
    premium_raw: row["Премиум_да/нет"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    mechanical: {
      zinc_type: row["Тип_оцинковки"] || null,
      premium: toBool(row["Премиум_да/нет"]),
      dimensions_mm: row["Размеры_мм (В×Ш×Д)"] || null,
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "cpo90",

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

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function importCpo90FromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_CPO90.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "cpo90",
      categoryName: "CPO90",
      mapRowToPriceItem: mapCpo90RowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importCpo90FromCsv();


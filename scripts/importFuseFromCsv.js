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
// МАППИНГ ДЛЯ ПРЕДОХРАНИТЕЛЕЙ (идентично importFuse.js)
// ============================================================================

const mapFuseRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    fuse_type: row["Тип_предохранителя"] || null,
    fuse_holder_type: row["Тип_держателя"] || null,
    etm_code: row["Код_ЭТМ"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      fuse_type: row["Тип_предохранителя"] || null,
      holder_type: row["Тип_держателя"] || null,
      current_a: toNum(row["Сила тока_А"]),
      voltage_v: toNum(row["Напряжение_V"]),
    },
    mechanical: {
      dimensions_mm: row["Размеры_мм(Д×Ш×Г)"] || null,
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "fuse",

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

async function importFuseFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_FUSE.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "fuse",
      categoryName: "Предохранители",
      mapRowToPriceItem: mapFuseRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importFuseFromCsv();


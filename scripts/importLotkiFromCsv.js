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
// МАППИНГ ДЛЯ ЛОТКОВ (идентично importLotki.js)
// ============================================================================

const mapLotkiRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    etm_code: row["Код_ЭТМ"] || null,
    tray_type: row["Тип_лотка"] || null,
    coating: row["Покрытие"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    mechanical: {
      tray_type: row["Тип_лотка"] || null,
      material: row["Материал"] || null,
      coating: row["Покрытие"] || null,
      width_mm: toNum(row["Ширина_мм"]),
      height_mm: toNum(row["Высота_мм"]),
      length_mm: toNum(row["Длина_мм"]),
      thickness_mm: toNum(row["Толщина_мм"]),
      dimensions_mm:
        row["Размеры_мм(Д×Ш×Т)"] || row["Размеры_мм(Ш×В×Г)"] || null,
      weight_kg: toNum(row["Вес_кг"]),
    },
    compat: {
      for_cable_tray: true,
      indoor: toBool(row["Для_внутренних_работ"]),
      outdoor: toBool(row["Для_наружных_работ"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "lotki",

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

async function importLotkiFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_LOTKI.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "lotki",
      categoryName: "Лотки",
      mapRowToPriceItem: mapLotkiRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importLotkiFromCsv();


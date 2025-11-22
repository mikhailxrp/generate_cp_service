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
// МАППИНГ ДЛЯ КАБЕЛЯ (идентично importCable.js)
// ============================================================================

const mapCableRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    etm_code: row["Код_ЭТМ"] || null,
    grounding: row["Заземление"] || null,
    ac_dc_type: row["Тип_AC/DC"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      dc_cable_single_m: toNum(row["Кабель_солнечный_одинарный"]),
      dc_cable_double_m: toNum(row["Кабель_солнечный_сдвоенный"]),
      ac_cable_m: toNum(row["Кабель_силовой_гибкий"]),
      comm_cable_m: toNum(row["Кабель_связи"]),
      ac_dc_type: row["Тип_AC/DC"] || null,
    },
    compat: {
      grounding: row["Заземление"] || null,
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "cable",

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

async function importCableFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_CABLE.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "cable",
      categoryName: "Кабель",
      mapRowToPriceItem: mapCableRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importCableFromCsv();


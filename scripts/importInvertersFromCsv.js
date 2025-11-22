import { resolve } from "path";
import { getDb } from "../src/db/index.js";
import { priceCategories, priceItems } from "../src/db/schema.js";
import {
  toNum,
  toInt,
  toBool,
  parseGridType,
  parseBatterySupport,
  parseStockFlag,
  parsePriority,
  importFromCsv,
} from "./csvImportHelpers.js";

const db = getDb();

// ============================================================================
// ФУНКЦИЯ МАППИНГА CSV → price_items (идентична Excel-версии)
// ============================================================================

/**
 * Маппинг строки CSV в объект для price_items.
 * Структура attrs НЕ МЕНЯЕТСЯ — используется та же, что в importInverters.js
 */
const mapInverterRowToPriceItem = (row, categoryId) => {
  const baseMeta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      ac_power_kw: toNum(row["Мощность_кВт"]),
      phases: toInt(row["Выход_фазы(1/3)"]),
      grid_type: parseGridType(row["Тип_инвертора"]),
      mppt_count: toInt(row["Кол-во_MPPT"]),
      strings_per_mppt: toInt(row["Стрингов_на_1_MPPT"]),
      max_dc_voltage_v: toNum(row["Вход_VDC_max"]),
      ac_max_current_a: toNum(row["Сила_тока_AC_(А)"]),
    },
    compat: {
      battery_support: parseBatterySupport(row["Тип_BATT_LV/HV"]),
      roof_applicable: toBool(row["Применимость_Крыша"]),
      ground_applicable: toBool(row["Применимость_Наземка"]),
      carport_applicable: toBool(row["Применимость_Карпорт"]),
      parallel_work: toBool(row["Параллельная_работа"]),
      segment_b2c: toBool(row["Сегмент_Частник"]),
      segment_b2b: toBool(row["Сегмент_Юрлицо"]),
    },
    bos: {
      dc_cable_single_m_per_kw: toNum(row["Кабель_солнечный_одинарный"]),
      dc_cable_double_m_per_kw: toNum(row["Кабель_солнечный_сдвоенный"]),
      ac_cable_m_per_kw: toNum(row["Кабель_силовой_гибкий"]),
      breaker_type: row["Автомат_тип"] || null,
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta: baseMeta,
  };

  return {
    categoryId,
    typeCode: "inverter",

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
// ГЛАВНАЯ ФУНКЦИЯ ИМПОРТА
// ============================================================================

async function importInvertersFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_INVERTERS.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "inverter",
      categoryName: "Инверторы",
      mapRowToPriceItem: mapInverterRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

// ============================================================================
// ЗАПУСК
// ============================================================================

importInvertersFromCsv();

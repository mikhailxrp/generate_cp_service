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
// МАППИНГ ДЛЯ БАТАРЕЙ (идентично importBatt.js)
// ============================================================================

const parseBatteryType = (v) => {
  if (!v) return "none";
  const s = String(v).toUpperCase();
  if (s.includes("LV")) return "lv";
  if (s.includes("HV")) return "hv";
  return "none";
};

const mapBattRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    mount_type: row["Тип монтажа"] || null,
    battery_type_raw: row["Тип_BATT_LV/HV"] || null,
    warranty_years: toInt(row["Гарантия_лет"]),
    service_24_7: toBool(row["Сервис24_7"]),
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      capacity_kwh: toNum(row["Ёмкость_кВтч"]),
      module_capacity_kwh: toNum(row["Ёмкость_1_модуля_кВтч"]),
      module_nom_voltage_v: toNum(row["Ном_Напр_1_модуля_V"]),
      module_capacity_ah: toNum(row["Ёмкость_1_модуля_Ач"]),
      nominal_voltage_v: toNum(row["Номин_напряжение_V"]),
      dod_pct: toNum(row["DoD_%"]),
      cycles_80pct: toInt(row["Циклы_до_80%DoD"]),
      work_temp_charge_discharge: row["Раб_темп_заряд/разряд"] || null,
      battery_type: parseBatteryType(row["Тип_BATT_LV/HV"]),
    },
    mechanical: {
      weight_kg: toNum(row["Вес_кг"]),
      dimensions_mm: row["Размеры_мм(Д×Ш×Г)"] || null,
    },
    compat: {
      bms: toBool(row["BMS"]),
      peak_shaving: toBool(row["Peak_shaving"]),
      black_start: toBool(row["Black_start"]),
      communication: row["Коммуникационные_возможности"] || null,
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
      deg_cost_per_cycle_rub: toNum(row["Deg_cost_per_cycle_RUB"]),
      calendar_fade_pct_year: toNum(row["Calendar_fade_%год"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "batt",

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

async function importBattFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_BATT.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "batt",
      categoryName: "Аккумуляторы",
      mapRowToPriceItem: mapBattRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importBattFromCsv();


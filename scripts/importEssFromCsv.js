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
// МАППИНГ ДЛЯ ESS (идентично importEss.js)
// ============================================================================

const mapEssRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    mount_type: row["Тип монтажа"] || null,
    warranty_years: toInt(row["Гарантия_лет"]),
    service_24_7: toBool(row["Сервис24_7"]),
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      capacity_kwh: toNum(row["Ёмкость_кВтч"]),
      pcs_power_kw: toNum(row["Мощность_PCS_кВт"]),
      nominal_voltage_v: toNum(row["Номин_напряжение_V"]),
      dod_pct: toNum(row["DoD_%"]),
      work_temp_charge_discharge: row["Раб_темп_заряд/разряд"] || null,
      roundtrip_efficiency_pct: toNum(row["КПД_rt_%"]),
      cycles_80pct: toInt(row["Циклы_до_80%DoD"]),
    },
    compat: {
      grid_forming: toBool(row["Grid_forming"]),
      ups_mode: toBool(row["UPS"]),
      peak_shaving: toBool(row["Peak_shaving"]),
      black_start: toBool(row["Black_start"]),
      bms: toBool(row["BMS"]),
      communication: row["Коммуникационные возможности"] || null,
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
    typeCode: "ess",

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
    specUrl: row["Ссылка_на_datasheet"] || row["Ссылка_на_datasheet.1"] || null,
    comment: row["Комментарий"] || null,

    attrs,
  };
};

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function importEssFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_ESS.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "ess",
      categoryName: "Системы накопления энергии (ESS)",
      mapRowToPriceItem: mapEssRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importEssFromCsv();

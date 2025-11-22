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
// МАППИНГ ДЛЯ ПАНЕЛЕЙ (идентично importModules.js)
// ============================================================================

const mapModuleRowToPriceItem = (row, categoryId) => {
  const baseMeta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    panel_type: row["Тип_панели"] || null,
    grounding: row["Заземление"] || null,
    warranty_years: toInt(row["Гарантия_лет"]),
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      power_w: toNum(row["Мощность_Вт"]),
      efficiency_pct: toNum(row["КПД_%"]),
      voc_v: toNum(row["Voc_V"]),
      voc_temp_coeff_pct_per_c: toNum(row["Темп_коэф_Voc, %/С"]),
      voc_minus30_v: toNum(row["-30гр"]),
      voc_for_calc_v: toNum(row["Voc_V_для_расчета"]),
      imp_a: toNum(row["Imp_A"]),
    },
    mechanical: {
      weight_kg: toNum(row["Вес_кг"]),
      dimensions_mm: row["Размеры_мм(Д×Ш×Т)"] || null,
      mech_load_pa: toNum(row["Мех.нагрузка_Па"]),
      snow_load_kg_m2: toNum(row["Снег_нагрузка_кг/м2"]),
      wind_load_m_s: toNum(row["Ветер_нагрузка_м/с"]),
    },
    compat: {
      roof_flat: toBool(row["Применимость_Крыша_Плоская"]),
      roof_metal: toBool(row["Применимость_Крыша_Металл"]),
      ground_mount: toBool(row["Применимость_Наземка"]),
      carport: toBool(row["Применимость_Карпорт"]),
      facade: toBool(row["Применимость_Фасадная"]),
      segment_b2c: toBool(row["Сегмент_Частник"]),
      segment_b2b: toBool(row["Сегмент_Юрлицо"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta: baseMeta,
  };

  return {
    categoryId,
    typeCode: "panel",

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

async function importModulesFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_MODULES.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "panel",
      categoryName: "Солнечные панели",
      mapRowToPriceItem: mapModuleRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importModulesFromCsv();

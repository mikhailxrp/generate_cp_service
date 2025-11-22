/**
 * 📋 ШАБЛОН ДЛЯ ИМПОРТА НОВОЙ КАТЕГОРИИ ИЗ CSV
 *
 * КАК ИСПОЛЬЗОВАТЬ:
 * 1. Скопируйте этот файл и переименуйте, например: importEssFromCsv.js
 * 2. Найдите существующий Excel-скрипт для вашей категории (например, scripts/importEss.js)
 * 3. Скопируйте функцию маппинга оттуда (mapXxxRowToPriceItem)
 * 4. Измените константы ниже (CSV_PATH, CATEGORY_CODE, TYPE_CODE)
 * 5. Запустите: node scripts/importEssFromCsv.js
 *
 * ⚠️ НЕ МЕНЯЙТЕ структуру attrs — используйте ту же, что в Excel-скрипте!
 */

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
  // Если нужны специфичные парсеры (только для инверторов):
  // parseGridType,
  // parseBatterySupport,
} from "./csvImportHelpers.js";

const db = getDb();

// ============================================================================
// 🔧 КОНФИГУРАЦИЯ (ИЗМЕНИТЕ ПОД СВОЮ КАТЕГОРИЮ)
// ============================================================================

// Путь к CSV-файлу (относительно корня проекта)
const CSV_PATH = "./data/PRICE_ESS.csv"; // <-- ИЗМЕНИТЬ

// Код категории в таблице price_categories (например: 'ess', 'batt', 'mount_bos')
const CATEGORY_CODE = "ess"; // <-- ИЗМЕНИТЬ

// Код типа для price_items.type_code (обычно совпадает с CATEGORY_CODE)
const TYPE_CODE = "ess"; // <-- ИЗМЕНИТЬ

// Название категории для логов
const CATEGORY_NAME = "Системы накопления энергии (ESS)"; // <-- ИЗМЕНИТЬ

// ============================================================================
// 📋 ФУНКЦИЯ МАППИНГА (СКОПИРУЙТЕ ИЗ EXCEL-СКРИПТА)
// ============================================================================

/**
 * ВАЖНО: Эта функция должна быть ИДЕНТИЧНА той, что используется
 * в Excel-импорте для этой категории!
 *
 * Пример: если есть scripts/importEss.js с функцией mapEssRowToPriceItem,
 * скопируйте её сюда ЦЕЛИКОМ, НЕ МЕНЯЯ структуру attrs!
 */
const mapRowToPriceItem = (row, categoryId) => {
  // 🔹 Соберите meta-данные
  const baseMeta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
    // ... другие поля из Excel-скрипта
  };

  // 🔹 Соберите attrs (ИСПОЛЬЗУЙТЕ ТУ ЖЕ СТРУКТУРУ, ЧТО В EXCEL-СКРИПТЕ!)
  const attrs = {
    electrical: {
      // Например для ESS:
      // capacity_kwh: toNum(row["Емкость_кВт⋅ч"]),
      // max_charge_power_kw: toNum(row["Макс_мощность_заряда_кВт"]),
      // max_discharge_power_kw: toNum(row["Макс_мощность_разряда_кВт"]),
      // voltage_v: toNum(row["Напряжение_В"]),
      // dod_pct: toNum(row["DoD_%"]),
      // ...
    },
    mechanical: {
      // weight_kg: toNum(row["Вес_кг"]),
      // dimensions_mm: row["Размеры_мм"] || null,
      // ...
    },
    compat: {
      // battery_type: row["Тип_батареи"] || null, // LV/HV
      // segment_b2c: toBool(row["Сегмент_Частник"]),
      // segment_b2b: toBool(row["Сегмент_Юрлицо"]),
      // ...
    },
    bos: {
      // work_cost_1: toNum(row["Стоимость_работ_1"]),
      // work_cost_2: toNum(row["Стоимость_работ_2"]),
      // ...
    },
    meta: baseMeta,
  };

  return {
    categoryId,
    typeCode: TYPE_CODE,

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
// 🚀 ГЛАВНАЯ ФУНКЦИЯ ИМПОРТА
// ============================================================================

async function runImport() {
  try {
    const csvPath = resolve(process.cwd(), CSV_PATH);

    await importFromCsv({
      csvPath,
      categoryCode: CATEGORY_CODE,
      categoryName: CATEGORY_NAME,
      mapRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

runImport();

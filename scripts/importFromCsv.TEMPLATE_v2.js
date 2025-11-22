/**
 * 📋 УЛУЧШЕННЫЙ ШАБЛОН ДЛЯ ИМПОРТА ИЗ CSV
 * 
 * ✅ ПОШАГОВАЯ ИНСТРУКЦИЯ:
 * 
 * 1. Скопируй этот файл: cp scripts/importFromCsv.TEMPLATE_v2.js scripts/importXxxFromCsv.js
 * 2. Измени константы в блоке КОНФИГУРАЦИЯ (строки 30-35)
 * 3. Найди Excel-скрипт для твоей категории (например, scripts/importEss.js)
 * 4. Скопируй функцию mapXxxRowToPriceItem из Excel-скрипта в блок МАППИНГ (строка 60)
 * 5. Запусти: node scripts/importXxxFromCsv.js
 * 
 * ⚠️ НЕ ИЗОБРЕТАЙ структуру attrs — используй ту же, что в Excel-импорте!
 */

import { resolve } from "path";
import { getDb } from "../src/db/index.js";
import { priceCategories, priceItems } from "../src/db/schema.js";

// Импорт вспомогательных функций (все уже реализованы в csvImportHelpers.js)
import {
  // Парсинг базовых типов
  toNum,              // "123.45" или "123,45" → 123.45
  toInt,              // "42" → 42
  toBool,             // "Да" | "1" | "yes" → true
  
  // Парсинг специфичных полей price_items
  parseStockFlag,     // "Наличие": "Да" → 1, "Нет" → 0
  parsePriority,      // "Приоритет": "низкий" → 1, "средний" → 2, "высокий" → 3
  
  // Парсеры для инверторов (используй если нужно)
  parseGridType,      // "Тип_инвертора": "Гибрид" → "hybrid", "off" → "off_grid", иначе "on_grid"
  parseBatterySupport,// "Тип_BATT_LV/HV": "LV" → "lv", "HV" → "hv", иначе "none"
  
  // Универсальная функция импорта (уже всё делает за тебя)
  importFromCsv,
} from "./csvImportHelpers.js";

const db = getDb();

// ============================================================================
// 🔧 КОНФИГУРАЦИЯ — ИЗМЕНИ ПОД СВОЮ КАТЕГОРИЮ
// ============================================================================

const CSV_PATH = "./data/PRICE_ESS.csv";        // ← Путь к CSV-файлу
const CATEGORY_CODE = "ess";                     // ← Код в price_categories.code
const TYPE_CODE = "ess";                         // ← Значение price_items.type_code
const CATEGORY_NAME = "Системы накопления (ESS)"; // ← Название для логов

// ============================================================================
// 📋 ФУНКЦИЯ МАППИНГА — СКОПИРУЙ ИЗ EXCEL-СКРИПТА
// ============================================================================

/**
 * ⚠️ ВАЖНО: Эта функция должна быть ИДЕНТИЧНА той, что в Excel-импорте!
 * 
 * ОТКУДА БРАТЬ:
 * - Для inverter: scripts/importInverters.js → mapInverterRowToPriceItem
 * - Для panel:    scripts/importModules.js → mapModuleRowToPriceItem
 * - Для ess:      scripts/importEss.js → mapEssRowToPriceItem
 * - Для batt:     scripts/importBatt.js → mapBattRowToPriceItem
 * - Для mount:    scripts/importMountBos.js → mapMountRowToPriceItem
 * - И так далее для других категорий
 * 
 * КАК КОПИРОВАТЬ:
 * 1. Открой соответствующий Excel-скрипт
 * 2. Найди функцию mapXxxRowToPriceItem
 * 3. Скопируй её ЦЕЛИКОМ (включая все вложенные объекты)
 * 4. Вставь вместо примера ниже
 * 5. НЕ МЕНЯЙ структуру attrs!
 */

const mapRowToPriceItem = (row, categoryId) => {
  // ========================================
  // ШАБЛОН 1: ESS (Системы накопления)
  // ========================================
  // Раскомментируй и адаптируй под свою категорию
  
  /*
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
  */

  // ========================================
  // ШАБЛОН 2: INVERTER (Инверторы)
  // ========================================
  
  /*
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
  */

  // ========================================
  // ШАБЛОН 3: PANEL (Солнечные модули)
  // ========================================
  
  /*
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
  */

  // ========================================
  // ⚠️ УДАЛИ ВСЁ ВЫШЕ И ВСТАВЬ СВОЮ ФУНКЦИЮ МАППИНГА ИЗ EXCEL-СКРИПТА!
  // ========================================
  
  // 🔹 Временная заглушка (удали и замени на реальную функцию)
  throw new Error(`
    ❌ Функция маппинга не реализована!
    
    Открой Excel-скрипт для категории "${CATEGORY_CODE}" и скопируй функцию mapXxxRowToPriceItem сюда.
    
    Пример: если категория "ess", открой scripts/importEss.js и скопируй mapEssRowToPriceItem.
  `);

  // ========================================
  // ОБЩАЯ ЧАСТЬ (используется всеми категориями)
  // ========================================
  // Раскомментируй после вставки функции маппинга
  
  /*
  return {
    categoryId,
    typeCode: TYPE_CODE,
    
    sku: String(row["SKU"] || "").trim(),
    title: String(row["Наименование"] || row["Полное_наименование"] || "").trim(),
    
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
  */
};

// ============================================================================
// 🚀 ГЛАВНАЯ ФУНКЦИЯ ИМПОРТА (НЕ ТРОГАЙ — УЖЕ ГОТОВА)
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
      // verbose: true, // ← раскомментируй для детальных логов
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

runImport();




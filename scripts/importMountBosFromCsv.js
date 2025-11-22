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
// МАППИНГ ДЛЯ КРЕПЕЖА И BOS (идентично importMountBos.js)
// ============================================================================

const mapMountRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    construction_type: row["Тип_конструкции"] || null,
    material: row["Материал"] || null,
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    mechanical: {
      material: row["Материал"] || null,
      weight_kg: toNum(row["Вес_кг"]),
      dimensions_mm: row["Размеры_мм(Д×Ш×Т)"] || null,
      mech_load_pa: toNum(row["Мех.нагрузка_Па"]),
      snow_load_kg_m2: toNum(row["Снег_нагрузка_кг/м2"]),
      wind_load_m_s: toNum(row["Ветер_нагрузка_м/с"]),
      construction_type: row["Тип_конструкции"] || null,
    },
    compat: {
      roof_flat: toBool(row["Применимость_Крыша_Плоская"]),
      roof_metal: toBool(row["Применимость_Крыша_Металл"]),
      ground_mount: toBool(row["Применимость_Наземка"]),
      carport: toBool(row["Применимость_Карпорт"]),
      facade: toBool(row["Применимость_Фасадная"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "mount",

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

async function importMountBosFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_MOUNT_BOS.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "mount",
      categoryName: "Крепёж и BOS",
      mapRowToPriceItem: mapMountRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importMountBosFromCsv();


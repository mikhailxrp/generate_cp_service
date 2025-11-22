import { resolve } from "path";
import { getDb } from "../src/db/index.js";
import { priceCategories, priceItems } from "../src/db/schema.js";
import {
  toNum,
  toPrice,
  toBool,
  parseStockFlag,
  importFromCsv,
} from "./csvImportHelpers.js";

const db = getDb();

// ============================================================================
// МАППИНГ ДЛЯ ДОП УСЛУГ
// ============================================================================

const mapAdditionalServiceRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    raw_category: row["Категория"] || null,
    service_24_7: toBool(row["Сервис24_7"]),
  };

  const attrs = {
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "sunhors",

    sku: String(row["SKU"] || "").trim(),
    title: String(
      row["Наименование"] || row["Полное_наименование"] || ""
    ).trim(),

    // используем toPrice для правильного парсинга процентов
    priceRub: toPrice(row["Цена_базовая"]) ?? 0,
    currency: row["Валюта"] || "RUB",

    stock: parseStockFlag(null), // по умолчанию считаем "доступно"
    priority: 0,

    warehouseRegion: null,
    leadDays: 0,
    specUrl: null,
    comment: row["Комментарий"] || null,

    attrs,
  };
};

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function importAdditionalServicesFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_ADDITIONAL_SERVICES.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "sunhors",
      categoryName: "Дополнительные услуги",
      mapRowToPriceItem: mapAdditionalServiceRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importAdditionalServicesFromCsv();


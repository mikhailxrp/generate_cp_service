import { readFileSync } from "fs";
import { resolve } from "path";
import * as XLSX from "xlsx";
import { getDb } from "../src/db/index.js";
const db = getDb();
import { priceCategories, priceItems } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

const toNum = (v) => {
  if (v == null) return null;
  const str = String(v).replace(",", ".").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
};

const toInt = (v) => {
  if (v == null) return null;
  const str = String(v).trim();
  if (!str) return null;
  const num = parseInt(str, 10);
  return Number.isNaN(num) ? null : num;
};

const toBool = (v) => {
  if (v == null) return false;
  const str = String(v).toLowerCase().trim();
  return ["да", "1", "yes", "true", "y", "true"].includes(str);
};

// Наличие: Да/Нет → 1/0
const parseStockFlag = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (["да", "yes", "есть", "в наличии", "1", "true"].includes(s)) return 1;
  if (["нет", "no", "0", "false"].includes(s)) return 0;
  return 0;
};

// Приоритет: низкий/средний/высокий → 1/2/3
const parsePriority = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (s.startsWith("низ")) return 1;
  if (s.startsWith("сред")) return 2;
  if (s.startsWith("выс")) return 3;
  return 0;
};

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
      // общая ёмкость системы
      capacity_kwh: toNum(row["Ёмкость_кВтч"]),
      // параметры одного модуля
      module_capacity_kwh: toNum(row["Ёмкость_1_модуля_кВтч"]),
      module_nom_voltage_v: toNum(row["Ном_Напр_1_модуля_V"]),
      module_capacity_ah: toNum(row["Ёмкость_1_модуля_Ач"]),
      // системное напряжение
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

async function importBatt() {
  try {
    console.log("🔄 Начинаю импорт АКБ (PRICE_BATT)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);

    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_BATT")) {
      throw new Error("Лист PRICE_BATT не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_BATT"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "batt"))
      .limit(1);

    if (!category) throw new Error("Категория batt не найдена!");

    console.log(`✅ Категория batt найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapBattRowToPriceItem(row, category.id);

        // если хочешь — можно пропускать без цены:
        // if (mapped.priceRub === 0) {
        //   console.warn(`⚠️ Пропуск ${mapped.sku} — нет цены`);
        //   skipped++;
        //   continue;
        // }

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлена АКБ: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт АКБ завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importBatt();

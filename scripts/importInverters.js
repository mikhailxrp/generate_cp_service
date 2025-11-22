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
  return ["да", "1", "yes", "true"].includes(str);
};

const parseGridType = (v) => {
  if (!v) return "on_grid";
  const str = String(v).toLowerCase();
  if (str.includes("гибрид")) return "hybrid";
  if (str.includes("off")) return "off_grid";
  return "on_grid";
};

const parseBatterySupport = (v) => {
  if (!v) return "none";
  const s = String(v).toUpperCase();
  if (s.includes("LV")) return "lv";
  if (s.includes("HV")) return "hv";
  return "none";
};

// 🔹 Наличие: Да/Нет → 1/0
const parseStockFlag = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (["да", "yes", "есть", "в наличии", "1", "true"].includes(s)) return 1;
  if (["нет", "no", "0", "false"].includes(s)) return 0;
  return 0;
};

// 🔹 Приоритет: низкий/средний/высокий → 1/2/3
const parsePriority = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (s.startsWith("низ")) return 1;
  if (s.startsWith("сред")) return 2;
  if (s.startsWith("выс")) return 3;
  return 0;
};

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

    // 🔹 теперь правильно
    stock: parseStockFlag(row["Наличие"]),
    priority: parsePriority(row["Приоритет"]),

    warehouseRegion: row["Регион_склада"] || null,
    leadDays: toInt(row["Срок_поставки_дни"]) || 0,
    specUrl: row["Ссылка_на_datasheet"] || null,
    comment: row["Комментарий"] || null,
    attrs,
  };
};

async function importInverters() {
  try {
    console.log("🔄 Начинаю импорт инверторов...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);

    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_INVERTERS")) {
      throw new Error("Лист PRICE_INVERTERS не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_INVERTERS"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "inverter"))
      .limit(1);

    if (!category) throw new Error("Категория inverter не найдена!");

    console.log(`✅ Категория inverter найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }
      try {
        const mapped = mapInverterRowToPriceItem(row, category.id);

        // опционально: если нет цены — можно пропустить
        // if (mapped.priceRub === 0) {
        //   console.warn(`⚠️ Пропуск ${mapped.sku} — нет цены`);
        //   skipped++;
        //   continue;
        // }

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлено: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importInverters();

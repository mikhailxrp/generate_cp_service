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
  return ["да", "1", "yes", "true", "y"].includes(str);
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

async function importEss() {
  try {
    console.log("🔄 Начинаю импорт ESS (PRICE_ESS)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);

    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_ESS")) {
      throw new Error("Лист PRICE_ESS не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_ESS"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "ess"))
      .limit(1);

    if (!category) throw new Error("Категория ess не найдена!");

    console.log(`✅ Категория ess найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapEssRowToPriceItem(row, category.id);

        // если хочешь — можно пропускать ESS без цены:
        // if (mapped.priceRub === 0) {
        //   console.warn(`⚠️ Пропуск ${mapped.sku} — нет цены`);
        //   skipped++;
        //   continue;
        // }

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлена ESS: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт ESS завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importEss();

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

async function importMountBos() {
  try {
    console.log("🔄 Начинаю импорт крепежа и BOS (PRICE_MOUNT_BOS)...");

    const filePath = resolve(process.cwd(), "Прайс РРЦ.xlsx");
    console.log(`📂 Читаю файл: ${filePath}`);

    const fileBuffer = readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames.includes("PRICE_MOUNT_BOS")) {
      throw new Error("Лист PRICE_MOUNT_BOS не найден.");
    }

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets["PRICE_MOUNT_BOS"]);
    console.log(`📊 Найдено строк: ${rows.length}`);

    const [category] = await db
      .select()
      .from(priceCategories)
      .where(eq(priceCategories.code, "mount"))
      .limit(1);

    if (!category) throw new Error("Категория mount не найдена!");

    console.log(`✅ Категория mount найдена. ID = ${category.id}`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapMountRowToPriceItem(row, category.id);

        // если хочешь — можно пропускать без цены:
        // if (mapped.priceRub === 0) {
        //   console.warn(`⚠️ Пропуск ${mapped.sku} — нет цены`);
        //   skipped++;
        //   continue;
        // }

        await db.insert(priceItems).values(mapped);
        console.log(`➕ Добавлен крепёж/BOS: ${mapped.title} (${mapped.sku})`);
        inserted++;
      } catch (err) {
        console.error(`❌ Ошибка вставки ${row["SKU"]}: ${err.message}`);
      }
    }

    console.log("\n🎉 Импорт PRICE_MOUNT_BOS завершён.");
    console.log(`✔️ Добавлено: ${inserted}`);
    console.log(`⚠️ Пропущено: ${skipped}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importMountBos();

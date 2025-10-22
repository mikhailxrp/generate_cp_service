// scripts/import-from-csv.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { db } from "../src/db/index.js";
import { priceItems, presets, compat } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

// --- helpers ---
const num = (v) => {
  if (v == null) return null;
  const s = String(v).trim().replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const intOrNull = (v) => {
  const n = parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
};
const boolFromText = (v) => {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  return [
    "1",
    "да",
    "yes",
    "y",
    "true",
    "ok",
    "совместимость",
    "совместим",
    "совместимо",
  ].includes(s)
    ? 1
    : ["0", "нет", "no", "n", "false", "не совместим", "несовместим"].includes(
        s
      )
    ? 0
    : null;
};

const readCsv = (file) => {
  const full = path.resolve(process.cwd(), "data", file);
  const buf = fs.readFileSync(full);
  return parse(buf, { columns: true, skip_empty_lines: true });
};

// --- mapping for price items ---
async function importPriceSheet(file, typeCode, commonMap) {
  const rows = readCsv(file);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    // общие поля по именам столбцов (русские заголовки из твоих листов)
    const sku = (row["SKU"] || row["Sku"] || row["Артикул"] || "").trim();
    const title = (row["Наименование"] || row["Название"] || "").trim();
    const priceRub = num(row["Цена_базовая"]);
    const currency = (row["Валюта"] || "RUB").trim();
    const stock = intOrNull(row["Наличие"]); // если в таблице текст — поправим позже
    const priority = intOrNull(row["Приоритет"]);
    const warehouseRegion = (row["Регион_склада"] || "").trim();
    const leadDays = intOrNull(row["Срок_поставки_дни"]);
    const specUrl = (row["Ссылка_на_спеку"] || "").trim();
    const comment = (row["Комментарий"] || "").trim();

    if (!sku || !title || !priceRub) {
      skip++;
      continue;
    }

    // всё остальное в attrs
    const attrs = {};
    for (const [k, v] of Object.entries(row)) {
      if (
        [
          "SKU",
          "Наименование",
          "Цена_базовая",
          "Валюта",
          "Наличие",
          "Приоритет",
          "Регион_склада",
          "Срок_поставки_дни",
          "Ссылка_на_спеку",
          "Комментарий",
          "Категория",
        ].includes(k)
      ) {
        continue;
      }
      // пример: числа пытаемся превратить в number
      const maybeNum = num(v);
      attrs[k] = maybeNum !== null ? maybeNum : v;
    }

    // upsert по SKU
    await db
      .insert(priceItems)
      .values({
        typeCode,
        sku,
        title,
        priceRub,
        currency,
        stock,
        priority: priority ?? 0,
        warehouseRegion: warehouseRegion || null,
        leadDays,
        specUrl: specUrl || null,
        comment: comment || null,
        attrs, // весь хвост — в JSON
        isActive: 1,
      })
      .onDuplicateKeyUpdate({
        set: {
          title,
          priceRub,
          currency,
          stock,
          priority: priority ?? 0,
          warehouseRegion: warehouseRegion || null,
          leadDays,
          specUrl: specUrl || null,
          comment: comment || null,
          attrs,
        },
      });

    ok++;
  }

  console.log(`Imported ${ok}, skipped ${skip} from ${file} as ${typeCode}`);
}

async function importPresets(file) {
  const rows = readCsv(file);
  let ok = 0;

  for (const row of rows) {
    const useCase = (row["use_case"] || "").trim();
    if (!useCase) continue;

    // pv_module_skus может быть "SKU1, SKU2, SKU3"
    const pvModuleSkus = (row["pv_module_skus"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await db
      .insert(presets)
      .values({
        useCase,
        rangeKwp:
          row["range_kWp"] ||
          row["range_kWp"] ||
          row["range_kWp"] ||
          row["range_kWp"] ||
          row["range_kWp"] ||
          row["range_kWp"]
            ? String(row["range_kWp"])
            : row["range_kWp"] ?? row["range_kWp"],
        // выше просто страховка от разных регистраций, если уверены, можно упростить до row['range_kWp']
        pvModuleSkus,
        inverterSku: (row["inverter_sku"] || "").trim() || null,
        essSku: (row["ess_sku"] || "").trim() || null,
        pcsSku: (row["pcs_sku"] || "").trim() || null,
        mountSku: (row["mount_sku"] || "").trim() || null,
        notes: (row["notes"] || "").trim() || null,
      })
      .onDuplicateKeyUpdate({
        set: {
          rangeKwp: row["range_kWp"] ? String(row["range_kWp"]).trim() : null,
          pvModuleSkus,
          inverterSku: (row["inverter_sku"] || "").trim() || null,
          essSku: (row["ess_sku"] || "").trim() || null,
          pcsSku: (row["pcs_sku"] || "").trim() || null,
          mountSku: (row["mount_sku"] || "").trim() || null,
          notes: (row["notes"] || "").trim() || null,
        },
      });

    ok++;
  }
  console.log(`Imported ${ok} rows from ${file} into presets`);
}

async function importCompat(file) {
  const rows = readCsv(file);
  let ok = 0,
    upd = 0;

  for (const row of rows) {
    const inverterSku = (row["inverter_sku"] || "").trim();
    const essSku = (row["ess_sku"] || "").trim();
    if (!inverterSku || !essSku) continue;

    const isCompatible = boolFromText(row["совместимость"]);
    const limits = (row["ограничения"] || "").trim() || null;
    const comment = (row["комментарий"] || "").trim() || null;

    // upsert по паре (inverter_sku, ess_sku)
    try {
      await db.insert(compat).values({
        inverterSku,
        essSku,
        isCompatible: isCompatible ?? 1,
        limits,
        comment,
      });
      ok++;
    } catch (e) {
      // если уникальный ключ сработал — обновим
      await db
        .update(compat)
        .set({ isCompatible: isCompatible ?? 1, limits, comment })
        .where(eq(compat.inverterSku, inverterSku))
        .where(eq(compat.essSku, essSku));
      upd++;
    }
  }

  console.log(`Compat: inserted ${ok}, updated ${upd} from ${file}`);
}

// --- main runner ---
(async () => {
  // 1) Единая таблица price_items по 4 листам
  await importPriceSheet("PRICE_MODULES.csv", "panel");
  await importPriceSheet("PRICE_INVERTERS.csv", "inverter");
  await importPriceSheet("PRICE_ESS.csv", "ess");
  await importPriceSheet("PRICE_MOUNT_BOS.csv", "mount");

  // 2) Пресеты
  await importPresets("PRESETS.csv");

  // 3) Совместимость
  await importCompat("COMPAT.csv");

  console.log("Import finished.");
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

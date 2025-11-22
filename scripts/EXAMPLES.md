# 💡 Примеры использования CSV-импорта

## 🎯 Базовый импорт

### Пример 1: Импорт инверторов

```bash
node scripts/importInvertersFromCsv.js
```

**Что происходит:**

1. Читается `./data/PRICE_INVERTERS.csv`
2. Ищется категория `inverter` в БД
3. Каждая строка маппится в объект `price_items`
4. Если `sku` существует → обновляется запись
5. Если `sku` новый → вставляется новая запись

**Вывод:**

```
🔄 Начинаю импорт: Инверторы...
📂 Читаю CSV: D:\project\data\PRICE_INVERTERS.csv
✅ Категория 'inverter' найдена. ID = 2
➕ Добавлено: Huawei SUN2000-5KTL-L1 (INV-001)
🔄 Обновлено: Growatt MIN 6000TL-XH (INV-002)
➕ Добавлено: Solis S5-GR1P6K-M (INV-003)

🎉 Импорт Инверторы завершён.
➕ Добавлено новых: 42
🔄 Обновлено: 13
⚠️ Пропущено: 2
```

---

## 🔧 Создание нового импорта: пошагово

### Пример 2: Создание скрипта для батарей (BATT)

#### Шаг 1: Проверьте наличие Excel-скрипта

```bash
ls scripts/importBatt.js
```

Если есть — отлично! Если нет — сначала создайте Excel-версию.

#### Шаг 2: Скопируйте шаблон

```bash
cp scripts/importFromCsv.TEMPLATE.js scripts/importBattFromCsv.js
```

#### Шаг 3: Откройте Excel-скрипт

```javascript
// scripts/importBatt.js
const mapBattRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    chemistry: row["Химия"] || null, // Li-ion, LiFePO4 и т.п.
    warranty_years: toInt(row["Гарантия_лет"]),
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      capacity_kwh: toNum(row["Ёмкость_кВтч"]),
      voltage_v: toNum(row["Напряжение_В"]),
      max_charge_current_a: toNum(row["Макс_ток_заряда_А"]),
      max_discharge_current_a: toNum(row["Макс_ток_разряда_А"]),
      cycles: toInt(row["Количество_циклов"]),
      dod_pct: toNum(row["DoD_%"]),
    },
    mechanical: {
      weight_kg: toNum(row["Вес_кг"]),
      dimensions_mm: row["Размеры_мм"] || null,
      ip_rating: row["IP"] || null,
    },
    compat: {
      battery_type: row["Тип_LV/HV"] || null,
      segment_b2c: toBool(row["Сегмент_Частник"]),
      segment_b2b: toBool(row["Сегмент_Юрлицо"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "batt",
    // ... остальные поля
  };
};
```

#### Шаг 4: Скопируйте функцию в CSV-скрипт

```javascript
// scripts/importBattFromCsv.js
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

// 🔹 СКОПИРОВАНА ФУНКЦИЯ ИЗ importBatt.js (идентично!)
const mapBattRowToPriceItem = (row, categoryId) => {
  const meta = {
    brand: row["Бренд"] || null,
    chemistry: row["Химия"] || null,
    warranty_years: toInt(row["Гарантия_лет"]),
    stock_raw: row["Наличие"] || null,
    priority_raw: row["Приоритет"] || null,
  };

  const attrs = {
    electrical: {
      capacity_kwh: toNum(row["Ёмкость_кВтч"]),
      voltage_v: toNum(row["Напряжение_В"]),
      max_charge_current_a: toNum(row["Макс_ток_заряда_А"]),
      max_discharge_current_a: toNum(row["Макс_ток_разряда_А"]),
      cycles: toInt(row["Количество_циклов"]),
      dod_pct: toNum(row["DoD_%"]),
    },
    mechanical: {
      weight_kg: toNum(row["Вес_кг"]),
      dimensions_mm: row["Размеры_мм"] || null,
      ip_rating: row["IP"] || null,
    },
    compat: {
      battery_type: row["Тип_LV/HV"] || null,
      segment_b2c: toBool(row["Сегмент_Частник"]),
      segment_b2b: toBool(row["Сегмент_Юрлицо"]),
    },
    bos: {
      work_cost_1: toNum(row["Стоимость_работ_1"]),
      work_cost_2: toNum(row["Стоимость_работ_2"]),
    },
    meta,
  };

  return {
    categoryId,
    typeCode: "batt",

    sku: String(row["SKU"] || "").trim(),
    title: String(row["Наименование"] || "").trim(),

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

async function importBattFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_BATT.csv");

    await importFromCsv({
      csvPath,
      categoryCode: "batt",
      categoryName: "Батареи",
      mapRowToPriceItem: mapBattRowToPriceItem,
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}

importBattFromCsv();
```

#### Шаг 5: Запустите

```bash
node scripts/importBattFromCsv.js
```

✅ **Готово!** За 5 минут вы создали рабочий импорт для новой категории.

---

## 🔄 Обновление прайса

### Пример 3: Обновление цен через CSV

**Сценарий:** поставщик прислал новый прайс в CSV.

**Действия:**

1. Замените старый CSV новым:

```bash
mv новый_прайс_инверторы.csv ./data/PRICE_INVERTERS.csv
```

2. Запустите импорт:

```bash
node scripts/importInvertersFromCsv.js
```

3. Скрипт **автоматически**:
   - Обновит цены для существующих SKU
   - Добавит новые позиции
   - Оставит неизменными те, которых нет в CSV

**Результат:**

```
🔄 Обновлено: Huawei SUN2000-5KTL-L1 (INV-001)  ← цена изменилась
🔄 Обновлено: Growatt MIN 6000TL-XH (INV-002)   ← атрибуты обновлены
➕ Добавлено: Новый инвертор X (INV-999)         ← новая позиция
```

---

## 🧪 Тестирование и отладка

### Пример 4: Импорт только 5 строк для теста

Измените скрипт:

```javascript
async function importInvertersFromCsv() {
  try {
    const csvPath = resolve(process.cwd(), "./data/PRICE_INVERTERS.csv");

    // 🔹 Добавьте тестовый лимит
    const TEST_LIMIT = 5;
    let processedRows = 0;

    await importFromCsv({
      csvPath,
      categoryCode: "inverter",
      categoryName: "Инверторы (ТЕСТ)",
      mapRowToPriceItem: (row, categoryId) => {
        processedRows++;
        if (processedRows > TEST_LIMIT) {
          throw new Error("ТЕСТОВЫЙ ЛИМИТ ДОСТИГНУТ");
        }
        return mapInverterRowToPriceItem(row, categoryId);
      },
      db,
      schema: { priceCategories, priceItems },
    });

    process.exit(0);
  } catch (err) {
    if (err.message.includes("ТЕСТОВЫЙ ЛИМИТ")) {
      console.log("\n✅ Тест завершён (обработано 5 строк)");
      process.exit(0);
    }
    console.error("❌ Критическая ошибка:", err);
    process.exit(1);
  }
}
```

Или проще — используйте утилиту `head`:

```bash
# Создайте тестовый CSV из первых 6 строк (1 заголовок + 5 данных)
head -n 6 ./data/PRICE_INVERTERS.csv > ./data/test_inverters.csv

# Измените путь в скрипте на test_inverters.csv
node scripts/importInvertersFromCsv.js
```

---

## 📊 Сравнение данных

### Пример 5: Проверка изменений после импорта

**До импорта:**

```sql
SELECT sku, price_rub, stock, updated_at
FROM price_items
WHERE sku IN ('INV-001', 'INV-002', 'INV-003');
```

**Результат:**

```
+---------+-----------+-------+---------------------+
| sku     | price_rub | stock | updated_at          |
+---------+-----------+-------+---------------------+
| INV-001 | 150000.00 |     1 | 2025-01-15 10:00:00 |
| INV-002 | 200000.00 |     0 | 2025-01-10 09:00:00 |
+---------+-----------+-------+---------------------+
```

**Запуск импорта:**

```bash
node scripts/importInvertersFromCsv.js
```

**После импорта:**

```sql
SELECT sku, price_rub, stock, updated_at
FROM price_items
WHERE sku IN ('INV-001', 'INV-002', 'INV-003');
```

**Результат:**

```
+---------+-----------+-------+---------------------+
| sku     | price_rub | stock | updated_at          |
+---------+-----------+-------+---------------------+
| INV-001 | 145000.00 |     1 | 2025-01-16 14:30:00 | ← цена снизилась
| INV-002 | 200000.00 |     1 | 2025-01-16 14:30:00 | ← появилось в наличии
| INV-003 |  95000.00 |     1 | 2025-01-16 14:30:00 | ← новая позиция
+---------+-----------+-------+---------------------+
```

---

## 🚀 Автоматизация

### Пример 6: Автоматический импорт по расписанию (cron)

**Linux/Mac:**

```bash
# Открыть crontab
crontab -e

# Добавить задачу (каждый день в 3:00 утра)
0 3 * * * cd /path/to/project && node scripts/importInvertersFromCsv.js >> /var/log/import.log 2>&1
```

**Windows (Task Scheduler):**

1. Создайте `.bat` файл:

```batch
@echo off
cd D:\project
node scripts\importInvertersFromCsv.js >> import.log 2>&1
```

2. Добавьте задачу в планировщик:
   - Триггер: ежедневно в 3:00
   - Действие: запуск `import_inverters.bat`

---

## 💡 Продвинутые техники

### Пример 7: Условный импорт (только изменённые записи)

Расширьте функцию `upsertPriceItem` для проверки изменений:

```javascript
async function smartUpsert(db, mapped) {
  // Получаем текущую запись
  const [existing] = await db
    .select()
    .from(priceItems)
    .where(eq(priceItems.sku, mapped.sku))
    .limit(1);

  if (existing) {
    // Проверяем, изменилась ли цена
    const priceChanged = existing.priceRub !== mapped.priceRub;
    const attrsChanged =
      JSON.stringify(existing.attrs) !== JSON.stringify(mapped.attrs);

    if (!priceChanged && !attrsChanged) {
      console.log(`⏭️  Пропущено (без изменений): ${mapped.sku}`);
      return { action: "skipped" };
    }
  }

  // Вставляем/обновляем как обычно
  await upsertPriceItem(db, mapped);
  return { action: existing ? "updated" : "inserted" };
}
```

---

## 🔍 Валидация данных

### Пример 8: Проверка обязательных полей

```javascript
const mapInverterRowToPriceItem = (row, categoryId) => {
  // Валидация перед маппингом
  const requiredFields = [
    "SKU",
    "Наименование",
    "Мощность_кВт",
    "Цена_базовая",
  ];
  const missingFields = requiredFields.filter((f) => !row[f]);

  if (missingFields.length > 0) {
    throw new Error(
      `Отсутствуют обязательные поля: ${missingFields.join(", ")}`
    );
  }

  // Валидация типов
  const power = toNum(row["Мощность_кВт"]);
  if (power === null || power <= 0) {
    throw new Error(
      `Некорректная мощность для SKU=${row["SKU"]}: ${row["Мощность_кВт"]}`
    );
  }

  // ... остальной код маппинга
};
```

---

## 📈 Статистика импорта

### Пример 9: Детальный отчёт

Расширьте функцию `importFromCsv` для сбора статистики:

```javascript
const stats = {
  inserted: 0,
  updated: 0,
  skipped: 0,
  errors: [],
  priceChanges: [],
};

// В цикле обработки:
try {
  const mapped = mapRowToPriceItem(row, category.id);
  const [existing] = await db
    .select()
    .from(priceItems)
    .where(eq(priceItems.sku, mapped.sku))
    .limit(1);

  if (existing && existing.priceRub !== mapped.priceRub) {
    stats.priceChanges.push({
      sku: mapped.sku,
      oldPrice: existing.priceRub,
      newPrice: mapped.priceRub,
      diff: mapped.priceRub - existing.priceRub,
    });
  }

  await upsertPriceItem(db, mapped);
  // ...
} catch (err) {
  stats.errors.push({ sku: row["SKU"], error: err.message });
}

// После импорта:
console.log("\n📊 Статистика импорта:");
console.log(`➕ Добавлено: ${stats.inserted}`);
console.log(`🔄 Обновлено: ${stats.updated}`);
console.log(`⚠️  Пропущено: ${stats.skipped}`);

if (stats.priceChanges.length > 0) {
  console.log("\n💰 Изменения цен:");
  stats.priceChanges.forEach(({ sku, oldPrice, newPrice, diff }) => {
    const sign = diff > 0 ? "+" : "";
    console.log(`  ${sku}: ${oldPrice} → ${newPrice} (${sign}${diff})`);
  });
}

if (stats.errors.length > 0) {
  console.log("\n❌ Ошибки:");
  stats.errors.forEach(({ sku, error }) => {
    console.log(`  ${sku}: ${error}`);
  });
}
```

---

## 🎓 Заключение

Вы изучили:

- ✅ Базовый импорт из CSV
- ✅ Создание новых скриптов импорта
- ✅ Обновление прайса
- ✅ Тестирование и отладку
- ✅ Автоматизацию
- ✅ Продвинутые техники

**Документация:**

- 📖 [Полная документация](CSV_IMPORT_README.md)
- 🚀 [Быстрый старт](../CSV_IMPORT_QUICKSTART.md)
- 📋 [Список команд](CSV_IMPORT_COMMANDS.md)

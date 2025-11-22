# 📋 Руководство по импорту из CSV в price_items

## 🎯 Цель

Этот гайд покажет, как **быстро создать CSV-импортер** для любой категории прайса, используя готовую инфраструктуру проекта.

---

## ✅ Что уже готово

1. **Универсальная функция импорта** → `csvImportHelpers.js`
2. **Все вспомогательные парсеры** → `toNum`, `toInt`, `toBool`, `parseStockFlag`, `parsePriority`, `parseGridType`, `parseBatterySupport`
3. **UPSERT через raw SQL** → автоматическое обновление существующих записей по SKU
4. **Шаблон для новых категорий** → `importFromCsv.TEMPLATE.js`
5. **Рабочие примеры** → `importInvertersFromCsv.js`, `importModulesFromCsv.js` и т.д.

---

## 🚀 Быстрый старт: создание нового импортера за 3 шага

### Шаг 1: Подготовь CSV-файл

Экспортируй нужный лист из Excel (например, `PRICE_ESS`) в CSV:

```bash
# Положи файл в папку data/
./data/PRICE_ESS.csv
./data/PRICE_BATT.csv
./data/PRICE_MODULES.csv
# и т.д.
```

**Важно:** заголовки колонок в CSV должны точно совпадать с названиями в Excel!

---

### Шаг 2: Скопируй шаблон и адаптируй

```bash
# Скопируй шаблон
cp scripts/importFromCsv.TEMPLATE.js scripts/importEssFromCsv.js
```

Открой новый файл и измени **3 параметра**:

```js
// 🔧 КОНФИГУРАЦИЯ
const CSV_PATH = "./data/PRICE_ESS.csv";        // ← путь к CSV
const CATEGORY_CODE = "ess";                     // ← код категории в БД
const TYPE_CODE = "ess";                         // ← typeCode для price_items
const CATEGORY_NAME = "Системы накопления (ESS)"; // ← название для логов
```

---

### Шаг 3: Скопируй функцию маппинга из Excel-скрипта

Найди соответствующий Excel-импортер (например, `scripts/importEss.js`) и **скопируй функцию маппинга ЦЕЛИКОМ**:

```js
// Из scripts/importEss.js копируем mapEssRowToPriceItem → в CSV-скрипт
const mapRowToPriceItem = (row, categoryId) => {
  // ... вся логика маппинга из Excel-скрипта БЕЗ ИЗМЕНЕНИЙ
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
    typeCode: TYPE_CODE, // ← используй константу из конфига
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
};
```

**⚠️ ВАЖНО:** НЕ меняй структуру `attrs` — она должна совпадать с Excel-импортом!

---

### Шаг 4: Запусти импорт

```bash
node scripts/importEssFromCsv.js
```

Увидишь прогресс-бар и итоговый отчёт:

```
============================================================
🚀 Импорт: Системы накопления (ESS)
============================================================

⠋ Обработано строк: 45 | Время: 3s

============================================================
✅ Импорт завершён: Системы накопления (ESS)
============================================================

📊 Статистика:
   ➕ Добавлено новых записей: 32
   🔄 Обновлено существующих: 10
   ⚠️  Пропущено (ошибки/пустые): 3
   📝 Всего обработано строк: 45

============================================================
```

---

## 📚 Готовые примеры для копирования

### 1. Инверторы (`inverter`)

**CSV:** `./data/PRICE_INVERTERS.csv`  
**Excel-скрипт:** `scripts/importInverters.js`  
**CSV-скрипт:** `scripts/importInvertersFromCsv.js` ✅ (уже готов)

```js
const CSV_PATH = "./data/PRICE_INVERTERS.csv";
const CATEGORY_CODE = "inverter";
const TYPE_CODE = "inverter";
const CATEGORY_NAME = "Инверторы";

// Функция маппинга из importInverters.js (строки 66-126)
```

**Специфичные парсеры:**
- `parseGridType(v)` → `"on_grid" | "hybrid" | "off_grid"`
- `parseBatterySupport(v)` → `"lv" | "hv" | "none"`

---

### 2. Солнечные модули (`panel`)

**CSV:** `./data/PRICE_MODULES.csv`  
**Excel-скрипт:** `scripts/importModules.js`  
**CSV-скрипт:** `scripts/importModulesFromCsv.js` ✅ (уже готов)

```js
const CSV_PATH = "./data/PRICE_MODULES.csv";
const CATEGORY_CODE = "panel";
const TYPE_CODE = "panel";
const CATEGORY_NAME = "Солнечные модули";

// Функция маппинга из importModules.js (строки 50-115)
```

**Особенности:**
- Много механических параметров: вес, габариты, нагрузки
- Температурный коэффициент `Voc`
- Применимость к разным типам кровли

---

### 3. Системы накопления (`ess`)

**CSV:** `./data/PRICE_ESS.csv`  
**Excel-скрипт:** `scripts/importEss.js`  
**CSV-скрипт:** `scripts/importEssFromCsv.js` ✅ (уже готов)

```js
const CSV_PATH = "./data/PRICE_ESS.csv";
const CATEGORY_CODE = "ess";
const TYPE_CODE = "ess";
const CATEGORY_NAME = "Системы накопления энергии (ESS)";

// Функция маппинга из importEss.js (строки 50-110)
```

**Особенности:**
- Ёмкость (`capacity_kwh`), мощность PCS
- Параметры циклов (DoD, cycles_80pct)
- Деградация (`deg_cost_per_cycle_rub`, `calendar_fade_pct_year`)
- Флаги: `grid_forming`, `ups_mode`, `peak_shaving`, `black_start`

---

### 4. Батареи (`batt`)

**CSV:** `./data/PRICE_BATT.csv`  
**Excel-скрипт:** `scripts/importBatt.js`  
**CSV-скрипт:** `scripts/importBattFromCsv.js` ✅ (уже готов)

```js
const CSV_PATH = "./data/PRICE_BATT.csv";
const CATEGORY_CODE = "batt";
const TYPE_CODE = "batt";
const CATEGORY_NAME = "Батареи (АКБ)";

// Функция маппинга из importBatt.js (строки 58-126)
```

**Специфичный парсер:**
- `parseBatteryType(v)` → `"lv" | "hv" | "none"`

**Особенности:**
- Параметры модуля: `module_capacity_kwh`, `module_nom_voltage_v`, `module_capacity_ah`
- Общая емкость системы: `capacity_kwh`
- Тип батареи: LV/HV

---

### 5. Крепёж и BOS (`mount`)

**CSV:** `./data/PRICE_MOUNT_BOS.csv`  
**Excel-скрипт:** `scripts/importMountBos.js`  
**CSV-скрипт:** `scripts/importMountBosFromCsv.js` ✅ (уже готов)

```js
const CSV_PATH = "./data/PRICE_MOUNT_BOS.csv";
const CATEGORY_CODE = "mount";
const TYPE_CODE = "mount";
const CATEGORY_NAME = "Крепёж и BOS";

// Функция маппинга из importMountBos.js (строки 50-106)
```

**Особенности:**
- Механические параметры: материал, вес, габариты, нагрузки
- Тип конструкции
- Применимость к кровлям, наземке, карпорту, фасаду

---

## 🛠️ Универсальные вспомогательные функции

Все эти функции уже доступны через `csvImportHelpers.js`:

```js
import {
  toNum,              // Парсинг float (поддержка запятой)
  toInt,              // Парсинг int
  toBool,             // Парсинг boolean ("Да" → true)
  parseStockFlag,     // "Наличие" → 0/1
  parsePriority,      // "Приоритет" → 0/1/2/3
  parseGridType,      // "Тип_инвертора" → "on_grid" | "hybrid" | "off_grid"
  parseBatterySupport,// "Тип_BATT_LV/HV" → "lv" | "hv" | "none"
  importFromCsv,      // Универсальная функция импорта
  upsertPriceItem,    // INSERT ... ON DUPLICATE KEY UPDATE
} from "./csvImportHelpers.js";
```

---

## 🔄 Как работает UPSERT

При импорте:
- Если `SKU` **не существует** → **вставка** новой записи
- Если `SKU` **существует** → **обновление** всех полей (кроме `id` и `sku`)

Реализовано через raw SQL:

```sql
INSERT INTO price_items (...) VALUES (...)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  type_code = VALUES(type_code),
  title = VALUES(title),
  price_rub = VALUES(price_rub),
  ...
  attrs = VALUES(attrs),
  updated_at = CURRENT_TIMESTAMP
```

**Преимущества:**
- ✅ Можно переимпортировать CSV сколько угодно раз
- ✅ Обновляются цены, наличие, приоритет
- ✅ Не падает на дубликатах

---

## 📝 Структура attrs — единая для всех категорий

```ts
type PriceItemAttrs = {
  electrical?: {
    // Электрические параметры: мощность, напряжение, КПД, MPPT, фазы
    ac_power_kw?: number;
    phases?: number;
    voltage_v?: number;
    capacity_kwh?: number;
    // ... другие поля в зависимости от категории
  };
  
  mechanical?: {
    // Габариты, вес, материал, нагрузки
    weight_kg?: number;
    dimensions_mm?: string;
    mech_load_pa?: number;
    snow_load_kg_m2?: number;
    wind_load_m_s?: number;
    // ...
  };
  
  compat?: {
    // Совместимость и применимость
    battery_support?: "lv" | "hv" | "none";
    grid_type?: "on_grid" | "hybrid" | "off_grid";
    roof_applicable?: boolean;
    ground_applicable?: boolean;
    segment_b2c?: boolean;
    segment_b2b?: boolean;
    // ...
  };
  
  bos?: {
    // Обвязка и работы
    dc_cable_single_m_per_kw?: number;
    ac_cable_m_per_kw?: number;
    work_cost_1?: number;
    work_cost_2?: number;
    deg_cost_per_cycle_rub?: number;
    // ...
  };
  
  meta?: {
    // Вспомогательные данные
    brand?: string;
    raw_category?: string;
    stock_raw?: string;
    priority_raw?: string;
    warranty_years?: number;
    // ...
  };
};
```

**⚠️ КРИТИЧЕСКИ ВАЖНО:**
- НЕ добавляй новые разделы верхнего уровня (кроме `electrical`, `mechanical`, `compat`, `bos`, `meta`)
- НЕ меняй названия существующих ключей
- Используй ту же структуру, что в Excel-импорте для этой категории

---

## 🐛 Отладка и логирование

### Включить подробные логи

В `importFromCsv()` есть параметр `verbose`:

```js
await importFromCsv({
  csvPath,
  categoryCode: CATEGORY_CODE,
  categoryName: CATEGORY_NAME,
  mapRowToPriceItem,
  db,
  schema: { priceCategories, priceItems },
  verbose: true, // ← покажет каждую вставку/обновление
});
```

### Проверить ошибки

Функция `importFromCsv` возвращает статистику:

```js
const { inserted, updated, skipped, errors } = await importFromCsv({ ... });

console.log(`Добавлено: ${inserted}`);
console.log(`Обновлено: ${updated}`);
console.log(`Пропущено: ${skipped}`);

if (errors.length > 0) {
  errors.forEach(({ sku, error }) => {
    console.error(`Ошибка для ${sku}: ${error}`);
  });
}
```

---

## ✅ Чеклист перед запуском

- [ ] CSV-файл лежит в `./data/`
- [ ] Заголовки колонок в CSV совпадают с Excel
- [ ] В `price_categories` есть запись с нужным `code`
- [ ] Функция маппинга скопирована из Excel-скрипта
- [ ] Структура `attrs` не изменена
- [ ] Константы `CSV_PATH`, `CATEGORY_CODE`, `TYPE_CODE` настроены
- [ ] Запущен скрипт: `node scripts/importXxxFromCsv.js`

---

## 🚀 Все готовые CSV-импортеры

| Категория | Excel-лист | CSV-файл | CSV-скрипт | Статус |
|-----------|-----------|----------|------------|--------|
| Инверторы | `PRICE_INVERTERS` | `./data/PRICE_INVERTERS.csv` | `importInvertersFromCsv.js` | ✅ |
| Модули | `PRICE_MODULES` | `./data/PRICE_MODULES.csv` | `importModulesFromCsv.js` | ✅ |
| ESS | `PRICE_ESS` | `./data/PRICE_ESS.csv` | `importEssFromCsv.js` | ✅ |
| Батареи | `PRICE_BATT` | `./data/PRICE_BATT.csv` | `importBattFromCsv.js` | ✅ |
| Крепёж/BOS | `PRICE_MOUNT_BOS` | `./data/PRICE_MOUNT_BOS.csv` | `importMountBosFromCsv.js` | ✅ |
| Кабели | `PRICE_CABLE` | `./data/PRICE_CABLE.csv` | `importCableFromCsv.js` | ✅ |
| Коннекторы | `PRICE_CONNECTOR` | `./data/PRICE_CONNECTOR.csv` | `importConnectorFromCsv.js` | ✅ |
| Предохранители | `PRICE_FUSE` | `./data/PRICE_FUSE.csv` | `importFuseFromCsv.js` | ✅ |
| Лотки | `PRICE_LOTKI` | `./data/PRICE_LOTKI.csv` | `importLotkiFromCsv.js` | ✅ |
| Эл. панели | `PRICE_EL_PANEL` | `./data/PRICE_EL_PANEL.csv` | `importElPanelFromCsv.js` | ✅ |
| Трансформаторы | `PRICE_TRANS` | `./data/PRICE_TRANS.csv` | `importTransFromCsv.js` | ✅ |
| УЗИПы | `PRICE_UZIP` | `./data/PRICE_UZIP.csv` | `importUzipFromCsv.js` | ✅ |
| Счётчики | `PRICE_SMARTMETERS` | `./data/PRICE_SMARTMETERS.csv` | `importSmartmetersFromCsv.js` | ✅ |
| CPO90 | `PRICE_CPO90` | `./data/PRICE_CPO90.csv` | `importCpo90FromCsv.js` | ✅ |
| PowOff | `PRICE_POW_OFF` | `./data/PRICE_POW_OFF.csv` | `importPowOffFromCsv.js` | ✅ |

---

## 💡 Советы и best practices

1. **Тестируй на малой выборке:** создай тестовый CSV с 5-10 строками, проверь корректность маппинга
2. **Проверяй дубли SKU:** перед массовым импортом убедись, что в CSV нет дублей
3. **Сохраняй backup БД:** перед первым импортом новой категории
4. **Используй версионный контроль CSV:** храни CSV в git, чтобы отслеживать изменения прайса
5. **Автоматизируй обновления:** можно настроить cron для периодического импорта актуальных цен

---

## 🔗 Полезные ссылки

- **Основная документация CSV-импорта:** `scripts/CSV_IMPORT_README.md`
- **Команды для запуска:** `scripts/CSV_IMPORT_COMMANDS.md`
- **Шаблон для новых категорий:** `scripts/importFromCsv.TEMPLATE.js`
- **Хелперы:** `scripts/csvImportHelpers.js`

---

## ❓ FAQ

**Q: Что делать, если в CSV другие названия колонок?**  
A: Либо переименуй колонки в CSV, либо добавь алиасы в функцию маппинга:

```js
const sku = row["SKU"] || row["Артикул"] || "";
```

**Q: Можно ли импортировать несколько CSV в одну категорию?**  
A: Да, запусти импорт несколько раз — UPSERT обновит существующие записи.

**Q: Как удалить все записи категории перед импортом?**  
A: Выполни SQL:

```sql
DELETE FROM price_items WHERE category_id = (SELECT id FROM price_categories WHERE code = 'ess');
```

Или через Drizzle:

```js
await db.delete(priceItems).where(eq(priceItems.categoryId, categoryId));
```

**Q: Можно ли добавить новые поля в `attrs`?**  
A: Да, но только ВНУТРИ существующих разделов (`electrical`, `mechanical`, и т.д.). НЕ создавай новые разделы верхнего уровня!

---

**🎉 Готово! Теперь ты можешь импортировать любую категорию из CSV за 5 минут.**




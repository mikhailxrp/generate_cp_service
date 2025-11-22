# 📋 CSV Import Cheatsheet — Шпаргалка

## ⚡ Команды для импорта (копируй и запускай)

```bash
# === ОСНОВНОЕ ОБОРУДОВАНИЕ ===
node scripts/importInvertersFromCsv.js      # Инверторы
node scripts/importModulesFromCsv.js        # Солнечные модули
node scripts/importEssFromCsv.js            # Системы накопления ESS
node scripts/importBattFromCsv.js           # Батареи / АКБ
node scripts/importMountBosFromCsv.js       # Крепёж и BOS

# === BOS-КОМПОНЕНТЫ ===
node scripts/importCableFromCsv.js          # Кабели
node scripts/importConnectorFromCsv.js      # Коннекторы
node scripts/importFuseFromCsv.js           # Предохранители
node scripts/importLotkiFromCsv.js          # Кабельные лотки
node scripts/importElPanelFromCsv.js        # Электрические панели
node scripts/importTransFromCsv.js          # Трансформаторы
node scripts/importUzipFromCsv.js           # УЗИПы
node scripts/importSmartmetersFromCsv.js    # Счётчики

# === ПРОЧЕЕ ===
node scripts/importCpo90FromCsv.js          # CPO90
node scripts/importPowOffFromCsv.js         # PowOff

# === ПРОВЕРКА ===
node scripts/check-categories.js            # Список категорий с количеством товаров
node scripts/check-orphan-items.js          # SKU без категории
```

---

## 🎯 Создание нового импортера за 3 команды

```bash
# 1. Скопируй шаблон
cp scripts/importFromCsv.TEMPLATE.js scripts/importXxxFromCsv.js

# 2. Открой и измени 4 строки:
#    CSV_PATH, CATEGORY_CODE, TYPE_CODE, CATEGORY_NAME
#    + скопируй функцию маппинга из Excel-скрипта

# 3. Запусти
node scripts/importXxxFromCsv.js
```

---

## 📦 Структура файлов

```
./data/                              # CSV-файлы
  ├── PRICE_INVERTERS.csv
  ├── PRICE_MODULES.csv
  ├── PRICE_ESS.csv
  └── ...

./scripts/
  ├── csvImportHelpers.js            # Все вспомогательные функции
  ├── importFromCsv.TEMPLATE.js      # Шаблон (простой)
  ├── importFromCsv.TEMPLATE_v2.js   # Шаблон (с примерами)
  │
  ├── importInvertersFromCsv.js      # ✅ Готовые CSV-импортеры
  ├── importModulesFromCsv.js        # ✅
  ├── importEssFromCsv.js            # ✅
  └── ...                            # ✅ (все остальные)
```

---

## 🛠️ Вспомогательные функции (из csvImportHelpers.js)

```js
// ПАРСИНГ БАЗОВЫХ ТИПОВ
toNum("123,45")                    // → 123.45
toInt("42")                        // → 42
toBool("Да")                       // → true

// СПЕЦИФИЧНЫЕ ПАРСЕРЫ price_items
parseStockFlag("Да")               // → 1
parseStockFlag("Нет")              // → 0
parsePriority("низкий")            // → 1
parsePriority("средний")           // → 2
parsePriority("высокий")           // → 3

// ДЛЯ ИНВЕРТОРОВ
parseGridType("Гибрид")            // → "hybrid"
parseGridType("off-grid")          // → "off_grid"
parseGridType("Сетевой")           // → "on_grid"

parseBatterySupport("LV")          // → "lv"
parseBatterySupport("HV")          // → "hv"
parseBatterySupport("нет")         // → "none"

// УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ИМПОРТА
await importFromCsv({
  csvPath: "./data/PRICE_XXX.csv",
  categoryCode: "xxx",
  categoryName: "Название для логов",
  mapRowToPriceItem: mapXxxRowToPriceItem,
  db,
  schema: { priceCategories, priceItems },
  verbose: false,  // true = детальные логи
});
```

---

## 📋 Структура attrs (единая для всех!)

```typescript
attrs: {
  electrical?: {
    // Эл. параметры: мощность, напряжение, КПД, MPPT, фазы
    ac_power_kw, phases, grid_type, mppt_count, capacity_kwh, ...
  },
  mechanical?: {
    // Габариты, вес, материал, нагрузки
    weight_kg, dimensions_mm, mech_load_pa, snow_load_kg_m2, ...
  },
  compat?: {
    // Совместимость: тип кровли, сегменты B2C/B2B, LV/HV
    battery_support, roof_applicable, ground_applicable, segment_b2c, ...
  },
  bos?: {
    // Обвязка и работы: кабели, стоимость работ, деградация
    dc_cable_single_m_per_kw, work_cost_1, work_cost_2, deg_cost_per_cycle_rub, ...
  },
  meta?: {
    // Вспомогательные: бренд, гарантия, сырые значения
    brand, warranty_years, stock_raw, priority_raw, ...
  }
}
```

---

## 🔑 Соответствие категорий

| Excel-лист | CATEGORY_CODE | TYPE_CODE | CSV-файл |
|------------|---------------|-----------|----------|
| `PRICE_INVERTERS` | `inverter` | `inverter` | `./data/PRICE_INVERTERS.csv` |
| `PRICE_MODULES` | `panel` | `panel` | `./data/PRICE_MODULES.csv` |
| `PRICE_ESS` | `ess` | `ess` | `./data/PRICE_ESS.csv` |
| `PRICE_BATT` | `batt` | `batt` | `./data/PRICE_BATT.csv` |
| `PRICE_MOUNT_BOS` | `mount` | `mount` | `./data/PRICE_MOUNT_BOS.csv` |
| `PRICE_CABLE` | `cable` | `cable` | `./data/PRICE_CABLE.csv` |
| `PRICE_CONNECTOR` | `connector` | `connector` | `./data/PRICE_CONNECTOR.csv` |
| `PRICE_FUSE` | `fuse` | `fuse` | `./data/PRICE_FUSE.csv` |
| `PRICE_LOTKI` | `lotki` | `lotki` | `./data/PRICE_LOTKI.csv` |
| `PRICE_EL_PANEL` | `el_panel` | `el_panel` | `./data/PRICE_EL_PANEL.csv` |
| `PRICE_TRANS` | `trans` | `trans` | `./data/PRICE_TRANS.csv` |
| `PRICE_UZIP` | `uzip` | `uzip` | `./data/PRICE_UZIP.csv` |
| `PRICE_SMARTMETERS` | `smartmeters` | `smartmeters` | `./data/PRICE_SMARTMETERS.csv` |
| `PRICE_CPO90` | `cpo90` | `cpo90` | `./data/PRICE_CPO90.csv` |
| `PRICE_POW_OFF` | `pow_off` | `pow_off` | `./data/PRICE_POW_OFF.csv` |

---

## 🔄 UPSERT-логика

```sql
INSERT INTO price_items (sku, title, price_rub, ...)
VALUES (?, ?, ?, ...)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  price_rub = VALUES(price_rub),
  stock = VALUES(stock),
  priority = VALUES(priority),
  attrs = VALUES(attrs),
  updated_at = CURRENT_TIMESTAMP
```

**Результат:**
- Если `SKU` **новый** → **INSERT** (добавление)
- Если `SKU` **существует** → **UPDATE** (обновление всех полей кроме id и sku)

---

## ✅ Чеклист перед импортом

```bash
# 1. CSV-файл готов?
ls -lh ./data/PRICE_INVERTERS.csv

# 2. Категория существует в БД?
node scripts/check-categories.js | grep inverter

# 3. Тестовый импорт на 5 строках (создай PRICE_INVERTERS_TEST.csv)
head -n 6 ./data/PRICE_INVERTERS.csv > ./data/PRICE_INVERTERS_TEST.csv
# Измени CSV_PATH в скрипте на TEST.csv
node scripts/importInvertersFromCsv.js

# 4. Всё ОК? Запускай полный импорт
node scripts/importInvertersFromCsv.js
```

---

## 🐛 Частые ошибки

| Ошибка | Решение |
|--------|---------|
| `Категория не найдена` | `node scripts/update-categories.js` |
| `Duplicate entry for key 'sku'` | Норм! UPSERT обновит существующую запись |
| Кракозябры в данных | Экспортируй CSV в UTF-8 с BOM |
| Нет колонки в CSV | Проверь заголовки (включая пробелы/подчёркивания) |
| `Cannot find module` | `npm install csv-parse` |

---

## 📚 Полная документация

| Документ | Что внутри |
|----------|-----------|
| `CSV_IMPORT_QUICK_START.md` | Быстрый старт за 2 минуты |
| `CSV_IMPORT_GUIDE.md` | Подробное руководство с примерами |
| `CSV_CATEGORIES_REFERENCE.md` | Справочник всех категорий |
| `CSV_IMPORT_COMMANDS.md` | Все команды для копипаста |
| `CSV_IMPORT_README.md` | Общий обзор системы |

---

## 💡 Pro Tips

```bash
# Импорт с детальными логами
# В скрипте раскомментируй: verbose: true

# Сохранить лог импорта в файл
node scripts/importInvertersFromCsv.js > logs/import_$(date +%Y%m%d).log 2>&1

# Импорт всех категорий одной командой
for script in scripts/import*FromCsv.js; do node "$script"; done

# Проверка перед массовым импортом
node scripts/check-categories.js
node scripts/check-orphan-items.js
```

---

**🎉 Вот и всё! Держи эту шпаргалку под рукой.**

**Быстрая справка:**
- ⚡ Команда импорта: `node scripts/importXxxFromCsv.js`
- 📋 Шаблон: `scripts/importFromCsv.TEMPLATE.js`
- 🛠️ Хелперы: `scripts/csvImportHelpers.js`
- ✅ Проверка: `node scripts/check-categories.js`




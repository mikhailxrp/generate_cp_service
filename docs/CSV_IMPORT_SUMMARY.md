# 📦 CSV Import System — Итоговая сводка

## ✅ Что создано

### 🛠️ Инфраструктура

1. **`scripts/csvImportHelpers.js`** — общие функции:

   - `toNum()`, `toInt()`, `toBool()` — парсинг данных
   - `parseStockFlag()`, `parsePriority()` — парсинг наличия и приоритета
   - `parseGridType()`, `parseBatterySupport()` — специфичные парсеры для инверторов
   - `upsertPriceItem()` — универсальная функция вставки/обновления
   - `importFromCsv()` — универсальная функция импорта (каркас)

2. **`scripts/importFromCsv.TEMPLATE.js`** — шаблон для быстрого создания новых импортов

### ✅ Готовые скрипты импорта

1. **`scripts/importInvertersFromCsv.js`** — инверторы (`PRICE_INVERTERS.csv` → категория `inverter`)
2. **`scripts/importModulesFromCsv.js`** — солнечные панели (`PRICE_MODULES.csv` → категория `panel`)
3. **`scripts/importEssFromCsv.js`** — системы накопления энергии (`PRICE_ESS.csv` → категория `ess`)

### 📚 Документация

1. **`CSV_IMPORT_QUICKSTART.md`** (корень) — быстрый старт за 5 минут
2. **`scripts/README_CSV_IMPORT.md`** — главное оглавление всей документации
3. **`scripts/CSV_IMPORT_README.md`** — полная документация с примерами структуры `attrs`
4. **`scripts/CSV_IMPORT_COMMANDS.md`** — команды, чеклисты, troubleshooting
5. **`scripts/EXAMPLES.md`** — детальные примеры использования

---

## 🎯 Как использовать

### Импорт существующих категорий

```bash
# Инверторы
node scripts/importInvertersFromCsv.js

# Панели
node scripts/importModulesFromCsv.js

# ESS
node scripts/importEssFromCsv.js
```

### Создание импорта для новой категории

```bash
# 1. Скопируйте шаблон
cp scripts/importFromCsv.TEMPLATE.js scripts/importBattFromCsv.js

# 2. Измените константы в файле (CSV_PATH, CATEGORY_CODE, TYPE_CODE)

# 3. Скопируйте функцию маппинга из Excel-скрипта (scripts/importBatt.js)

# 4. Запустите
node scripts/importBattFromCsv.js
```

---

## 🔑 Ключевые принципы

### ❌ НЕ МЕНЯЕТСЯ:

- Схема БД (`price_items`) — никаких миграций
- Структура `attrs` верхнего уровня:
  ```javascript
  {
    electrical: { ... },
    mechanical: { ... },
    compat: { ... },
    bos: { ... },
    meta: { ... }
  }
  ```
- Названия ключей внутри `attrs` (идентичны Excel-импорту)
- Логика парсеров

### ✅ ПЕРЕИСПОЛЬЗУЕТСЯ:

- Функции маппинга из Excel-скриптов (`mapXxxRowToPriceItem`)
- Парсеры (`toNum`, `toBool`, `parseGridType` и т.п.)
- Бизнес-логика (совместимость, применимость, флаги)

### 🔄 UPSERT:

- Если `sku` существует → обновляется запись (цена, attrs, stock)
- Если `sku` новый → вставляется новая запись

---

## 📊 Структура `attrs` (консистентна с Excel-импортом)

### Инверторы (`inverter`)

```javascript
attrs: {
  electrical: {
    ac_power_kw, phases, grid_type, mppt_count,
    strings_per_mppt, max_dc_voltage_v, ac_max_current_a
  },
  compat: {
    battery_support, roof_applicable, ground_applicable,
    carport_applicable, parallel_work, segment_b2c, segment_b2b
  },
  bos: {
    dc_cable_single_m_per_kw, dc_cable_double_m_per_kw,
    ac_cable_m_per_kw, breaker_type, work_cost_1, work_cost_2
  },
  meta: {
    brand, raw_category, stock_raw, priority_raw
  }
}
```

### Панели (`panel`)

```javascript
attrs: {
  electrical: {
    power_w, efficiency_pct, voc_v, voc_temp_coeff_pct_per_c,
    voc_minus30_v, voc_for_calc_v, imp_a
  },
  mechanical: {
    weight_kg, dimensions_mm, mech_load_pa,
    snow_load_kg_m2, wind_load_m_s
  },
  compat: {
    roof_flat, roof_metal, ground_mount, carport, facade,
    segment_b2c, segment_b2b
  },
  bos: {
    work_cost_1, work_cost_2
  },
  meta: {
    brand, raw_category, panel_type, grounding,
    warranty_years, stock_raw, priority_raw
  }
}
```

### ESS (`ess`)

```javascript
attrs: {
  electrical: {
    capacity_kwh, pcs_power_kw, nominal_voltage_v, dod_pct,
    work_temp_charge_discharge, roundtrip_efficiency_pct, cycles_80pct
  },
  compat: {
    grid_forming, ups_mode, peak_shaving, black_start,
    bms, communication
  },
  bos: {
    work_cost_1, work_cost_2, deg_cost_per_cycle_rub,
    calendar_fade_pct_year
  },
  meta: {
    brand, raw_category, mount_type, warranty_years,
    service_24_7, stock_raw, priority_raw
  }
}
```

---

## 🚀 Преимущества

✅ **Быстрее Excel** — stream-обработка вместо загрузки всего файла  
✅ **Меньше памяти** — постоянное потребление независимо от размера CSV  
✅ **Автоматизация** — легко встраивается в CI/CD  
✅ **Консистентность** — та же структура данных, что в Excel-импорте  
✅ **UPSERT** — автоматическое обновление существующих записей  
✅ **Устойчивость** — ошибки логируются, но не останавливают импорт

---

## 📁 Карта файлов

```
project/
├── CSV_IMPORT_QUICKSTART.md         # ← Старт здесь
├── CSV_IMPORT_SUMMARY.md            # ← Этот файл (сводка)
│
├── data/                            # CSV-файлы (создайте сами)
│   ├── PRICE_INVERTERS.csv
│   ├── PRICE_MODULES.csv
│   └── PRICE_ESS.csv
│
└── scripts/
    ├── README_CSV_IMPORT.md         # Главное оглавление
    ├── CSV_IMPORT_README.md         # Полная документация
    ├── CSV_IMPORT_COMMANDS.md       # Команды и чеклисты
    ├── EXAMPLES.md                  # Примеры использования
    │
    ├── csvImportHelpers.js          # Общие функции
    ├── importFromCsv.TEMPLATE.js    # Шаблон
    │
    ├── importInvertersFromCsv.js    # ✅ Готов
    ├── importModulesFromCsv.js      # ✅ Готов
    └── importEssFromCsv.js          # ✅ Готов
```

---

## 📖 С чего начать?

### Для пользователей (запуск импорта)

1. Прочитайте **[CSV_IMPORT_QUICKSTART.md](CSV_IMPORT_QUICKSTART.md)**
2. Создайте `./data/` и положите туда CSV
3. Запустите: `node scripts/importInvertersFromCsv.js`

### Для разработчиков (создание нового импорта)

1. Прочитайте **[scripts/EXAMPLES.md](scripts/EXAMPLES.md)** → Пример 2
2. Скопируйте шаблон: `scripts/importFromCsv.TEMPLATE.js`
3. Адаптируйте под свою категорию (3 минуты)
4. Запустите

### Для изучения деталей

1. **[scripts/README_CSV_IMPORT.md](scripts/README_CSV_IMPORT.md)** — главное оглавление
2. **[scripts/CSV_IMPORT_README.md](scripts/CSV_IMPORT_README.md)** — полная документация
3. **[scripts/CSV_IMPORT_COMMANDS.md](scripts/CSV_IMPORT_COMMANDS.md)** — справочник команд

---

## 🎯 Итоговый чеклист

### Установка

- [x] `npm install csv-parse` — установлен
- [x] Создана директория `./data/`
- [x] CSV-файлы экспортированы из Excel

### Готовые скрипты

- [x] `importInvertersFromCsv.js` — инверторы
- [x] `importModulesFromCsv.js` — панели
- [x] `importEssFromCsv.js` — ESS

### Инфраструктура

- [x] `csvImportHelpers.js` — общие функции
- [x] `importFromCsv.TEMPLATE.js` — шаблон

### Документация

- [x] Быстрый старт (`CSV_IMPORT_QUICKSTART.md`)
- [x] Полная документация (`scripts/CSV_IMPORT_README.md`)
- [x] Примеры (`scripts/EXAMPLES.md`)
- [x] Команды (`scripts/CSV_IMPORT_COMMANDS.md`)
- [x] Оглавление (`scripts/README_CSV_IMPORT.md`)

---

## ✨ Что дальше?

### Оставшиеся категории для импорта:

- [ ] `importBattFromCsv.js` — батареи (`PRICE_BATT.csv`)
- [ ] `importMountBosFromCsv.js` — монтаж и BOS (`PRICE_MOUNT_BOS.csv`)
- [ ] Другие категории по мере необходимости

### Дополнительные возможности:

- [ ] Массовый импорт всех категорий (`importAllFromCsv.js`)
- [ ] Автоматизация через cron/Task Scheduler
- [ ] Расширенная валидация данных
- [ ] Детальная статистика изменений

**Используйте существующие скрипты как примеры!**

---

**Версия:** 1.0.0  
**Статус:** ✅ Готово к использованию  
**Дата:** 2025-01-16

**Старт:** [CSV_IMPORT_QUICKSTART.md](CSV_IMPORT_QUICKSTART.md)

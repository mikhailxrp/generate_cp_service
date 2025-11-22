# 📊 Справочник по категориям прайса для CSV-импорта

## 🎯 Быстрый доступ к параметрам всех категорий

Используй эту таблицу для быстрого создания CSV-импортеров.

---

## 📋 Основные категории (Core Equipment)

### 1. Инверторы (`inverter`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_INVERTERS` |
| **CSV-файл** | `./data/PRICE_INVERTERS.csv` |
| **CATEGORY_CODE** | `inverter` |
| **TYPE_CODE** | `inverter` |
| **Excel-скрипт** | `scripts/importInverters.js` |
| **CSV-скрипт** | `scripts/importInvertersFromCsv.js` ✅ |
| **Функция маппинга** | `mapInverterRowToPriceItem` (строки 66-126) |

**Специфичные парсеры:**
```js
parseGridType(row["Тип_инвертора"])      // → "on_grid" | "hybrid" | "off_grid"
parseBatterySupport(row["Тип_BATT_LV/HV"]) // → "lv" | "hv" | "none"
```

**Ключевые поля attrs:**
```js
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
  }
}
```

---

### 2. Солнечные модули (`panel`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_MODULES` |
| **CSV-файл** | `./data/PRICE_MODULES.csv` |
| **CATEGORY_CODE** | `panel` |
| **TYPE_CODE** | `panel` |
| **Excel-скрипт** | `scripts/importModules.js` |
| **CSV-скрипт** | `scripts/importModulesFromCsv.js` ✅ |
| **Функция маппинга** | `mapModuleRowToPriceItem` (строки 50-115) |

**Ключевые поля attrs:**
```js
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
  }
}
```

---

### 3. Системы накопления энергии (`ess`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_ESS` |
| **CSV-файл** | `./data/PRICE_ESS.csv` |
| **CATEGORY_CODE** | `ess` |
| **TYPE_CODE** | `ess` |
| **Excel-скрипт** | `scripts/importEss.js` |
| **CSV-скрипт** | `scripts/importEssFromCsv.js` ✅ |
| **Функция маппинга** | `mapEssRowToPriceItem` (строки 50-110) |

**Ключевые поля attrs:**
```js
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
    work_cost_1, work_cost_2, 
    deg_cost_per_cycle_rub, calendar_fade_pct_year
  }
}
```

---

### 4. Батареи / АКБ (`batt`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_BATT` |
| **CSV-файл** | `./data/PRICE_BATT.csv` |
| **CATEGORY_CODE** | `batt` |
| **TYPE_CODE** | `batt` |
| **Excel-скрипт** | `scripts/importBatt.js` |
| **CSV-скрипт** | `scripts/importBattFromCsv.js` ✅ |
| **Функция маппинга** | `mapBattRowToPriceItem` (строки 58-126) |

**Специфичный парсер:**
```js
parseBatteryType(row["Тип_BATT_LV/HV"]) // → "lv" | "hv" | "none"
```

**Ключевые поля attrs:**
```js
attrs: {
  electrical: {
    capacity_kwh, module_capacity_kwh, module_nom_voltage_v,
    module_capacity_ah, nominal_voltage_v, dod_pct, 
    cycles_80pct, work_temp_charge_discharge, battery_type
  },
  mechanical: {
    weight_kg, dimensions_mm
  },
  compat: {
    bms, peak_shaving, black_start, communication
  },
  bos: {
    work_cost_1, work_cost_2,
    deg_cost_per_cycle_rub, calendar_fade_pct_year
  }
}
```

---

### 5. Крепёж и BOS (`mount`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_MOUNT_BOS` |
| **CSV-файл** | `./data/PRICE_MOUNT_BOS.csv` |
| **CATEGORY_CODE** | `mount` |
| **TYPE_CODE** | `mount` |
| **Excel-скрипт** | `scripts/importMountBos.js` |
| **CSV-скрипт** | `scripts/importMountBosFromCsv.js` ✅ |
| **Функция маппинга** | `mapMountRowToPriceItem` (строки 50-106) |

**Ключевые поля attrs:**
```js
attrs: {
  mechanical: {
    material, weight_kg, dimensions_mm, 
    mech_load_pa, snow_load_kg_m2, wind_load_m_s,
    construction_type
  },
  compat: {
    roof_flat, roof_metal, ground_mount, carport, facade
  },
  bos: {
    work_cost_1, work_cost_2
  }
}
```

---

## 🔌 Вспомогательное оборудование (BOS Components)

### 6. Кабели (`cable`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_CABLE` |
| **CSV-файл** | `./data/PRICE_CABLE.csv` |
| **CATEGORY_CODE** | `cable` |
| **TYPE_CODE** | `cable` |
| **Excel-скрипт** | `scripts/importCable.js` |
| **CSV-скрипт** | `scripts/importCableFromCsv.js` ✅ |

---

### 7. Коннекторы (`connector`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_CONNECTOR` |
| **CSV-файл** | `./data/PRICE_CONNECTOR.csv` |
| **CATEGORY_CODE** | `connector` |
| **TYPE_CODE** | `connector` |
| **Excel-скрипт** | `scripts/importConnector.js` |
| **CSV-скрипт** | `scripts/importConnectorFromCsv.js` ✅ |

---

### 8. Предохранители (`fuse`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_FUSE` |
| **CSV-файл** | `./data/PRICE_FUSE.csv` |
| **CATEGORY_CODE** | `fuse` |
| **TYPE_CODE** | `fuse` |
| **Excel-скрипт** | `scripts/importFuse.js` |
| **CSV-скрипт** | `scripts/importFuseFromCsv.js` ✅ |

---

### 9. Кабельные лотки (`lotki`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_LOTKI` |
| **CSV-файл** | `./data/PRICE_LOTKI.csv` |
| **CATEGORY_CODE** | `lotki` |
| **TYPE_CODE** | `lotki` |
| **Excel-скрипт** | `scripts/importLotki.js` |
| **CSV-скрипт** | `scripts/importLotkiFromCsv.js` ✅ |

---

### 10. Электрические панели (`el_panel`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_EL_PANEL` |
| **CSV-файл** | `./data/PRICE_EL_PANEL.csv` |
| **CATEGORY_CODE** | `el_panel` |
| **TYPE_CODE** | `el_panel` |
| **Excel-скрипт** | `scripts/importElPanel.js` |
| **CSV-скрипт** | `scripts/importElPanelFromCsv.js` ✅ |

---

### 11. Трансформаторы (`trans`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_TRANS` |
| **CSV-файл** | `./data/PRICE_TRANS.csv` |
| **CATEGORY_CODE** | `trans` |
| **TYPE_CODE** | `trans` |
| **Excel-скрипт** | `scripts/importTrans.js` |
| **CSV-скрипт** | `scripts/importTransFromCsv.js` ✅ |

---

### 12. УЗИПы (`uzip`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_UZIP` |
| **CSV-файл** | `./data/PRICE_UZIP.csv` |
| **CATEGORY_CODE** | `uzip` |
| **TYPE_CODE** | `uzip` |
| **Excel-скрипт** | `scripts/importUzip.js` |
| **CSV-скрипт** | `scripts/importUzipFromCsv.js` ✅ |

---

### 13. Счётчики / Smartmeters (`smartmeters`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_SMARTMETERS` |
| **CSV-файл** | `./data/PRICE_SMARTMETERS.csv` |
| **CATEGORY_CODE** | `smartmeters` |
| **TYPE_CODE** | `smartmeters` |
| **Excel-скрипт** | `scripts/importSmartmeters.js` |
| **CSV-скрипт** | `scripts/importSmartmetersFromCsv.js` ✅ |

---

### 14. CPO90 (`cpo90`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_CPO90` |
| **CSV-файл** | `./data/PRICE_CPO90.csv` |
| **CATEGORY_CODE** | `cpo90` |
| **TYPE_CODE** | `cpo90` |
| **Excel-скрипт** | `scripts/importCpo90.js` |
| **CSV-скрипт** | `scripts/importCpo90FromCsv.js` ✅ |

---

### 15. PowOff (`pow_off`)

| Параметр | Значение |
|----------|----------|
| **Excel-лист** | `PRICE_POW_OFF` |
| **CSV-файл** | `./data/PRICE_POW_OFF.csv` |
| **CATEGORY_CODE** | `pow_off` |
| **TYPE_CODE** | `pow_off` |
| **Excel-скрипт** | `scripts/importPowOff.js` |
| **CSV-скрипт** | `scripts/importPowOffFromCsv.js` ✅ |

---

## 🛠️ Универсальные парсеры (доступны во всех скриптах)

| Функция | Что делает | Пример |
|---------|-----------|--------|
| `toNum(v)` | Парсит float, поддерживает запятую | `"123,45" → 123.45` |
| `toInt(v)` | Парсит целое число | `"42" → 42` |
| `toBool(v)` | Парсит boolean | `"Да" → true` |
| `parseStockFlag(v)` | Наличие → 0/1 | `"Да" → 1`, `"Нет" → 0` |
| `parsePriority(v)` | Приоритет → 0/1/2/3 | `"низкий" → 1`, `"высокий" → 3` |
| `parseGridType(v)` | Тип сети инвертора | `"Гибрид" → "hybrid"` |
| `parseBatterySupport(v)` | Тип батареи | `"LV" → "lv"`, `"HV" → "hv"` |

---

## 📝 Структура attrs (единая для всех категорий)

```typescript
type PriceItemAttrs = {
  electrical?: {
    // Электрические параметры (мощность, напряжение, КПД, ток и т.п.)
  };
  mechanical?: {
    // Механические параметры (вес, габариты, нагрузки)
  };
  compat?: {
    // Совместимость и применимость (тип кровли, сегменты, флаги)
  };
  bos?: {
    // Обвязка и работы (кабели, стоимость работ, деградация)
  };
  meta?: {
    // Вспомогательные данные (бренд, гарантия, сырые значения)
  };
};
```

---

## 🚀 Шаблон команды для создания нового импортера

```bash
# 1. Скопируй шаблон
cp scripts/importFromCsv.TEMPLATE_v2.js scripts/import<Xxx>FromCsv.js

# 2. Измени константы в файле:
#    CSV_PATH, CATEGORY_CODE, TYPE_CODE, CATEGORY_NAME

# 3. Скопируй функцию маппинга из scripts/import<Xxx>.js

# 4. Запусти импорт
node scripts/import<Xxx>FromCsv.js
```

---

## ✅ Чеклист перед запуском

- [ ] CSV-файл лежит в `./data/` и правильно назван
- [ ] Заголовки колонок в CSV совпадают с Excel
- [ ] Категория существует в `price_categories` (проверь: `node scripts/check-categories.js`)
- [ ] Функция маппинга скопирована из Excel-скрипта БЕЗ ИЗМЕНЕНИЙ
- [ ] Структура `attrs` не изменена
- [ ] Константы `CSV_PATH`, `CATEGORY_CODE`, `TYPE_CODE` настроены
- [ ] Тестовый запуск на 5-10 строках прошёл успешно

---

## 📊 Сводная таблица всех категорий

| № | Категория | code | typeCode | Excel-лист | CSV-скрипт |
|---|-----------|------|----------|-----------|-----------|
| 1 | Инверторы | `inverter` | `inverter` | `PRICE_INVERTERS` | ✅ |
| 2 | Модули | `panel` | `panel` | `PRICE_MODULES` | ✅ |
| 3 | ESS | `ess` | `ess` | `PRICE_ESS` | ✅ |
| 4 | Батареи | `batt` | `batt` | `PRICE_BATT` | ✅ |
| 5 | Крепёж/BOS | `mount` | `mount` | `PRICE_MOUNT_BOS` | ✅ |
| 6 | Кабели | `cable` | `cable` | `PRICE_CABLE` | ✅ |
| 7 | Коннекторы | `connector` | `connector` | `PRICE_CONNECTOR` | ✅ |
| 8 | Предохранители | `fuse` | `fuse` | `PRICE_FUSE` | ✅ |
| 9 | Лотки | `lotki` | `lotki` | `PRICE_LOTKI` | ✅ |
| 10 | Эл. панели | `el_panel` | `el_panel` | `PRICE_EL_PANEL` | ✅ |
| 11 | Трансформаторы | `trans` | `trans` | `PRICE_TRANS` | ✅ |
| 12 | УЗИПы | `uzip` | `uzip` | `PRICE_UZIP` | ✅ |
| 13 | Счётчики | `smartmeters` | `smartmeters` | `PRICE_SMARTMETERS` | ✅ |
| 14 | CPO90 | `cpo90` | `cpo90` | `PRICE_CPO90` | ✅ |
| 15 | PowOff | `pow_off` | `pow_off` | `PRICE_POW_OFF` | ✅ |

---

**🎉 Все категории готовы к импорту из CSV!**

Для создания нового импортера просто:
1. Открой эту таблицу
2. Скопируй параметры нужной категории
3. Следуй инструкции в `CSV_IMPORT_GUIDE.md`




# 📚 Документация CSV-импорта — Полный индекс

Добро пожаловать в систему импорта прайса из CSV в `price_items`!

---

## 🎯 С чего начать?

### Новичок? Начни отсюда:
1. **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)** — импорт за 2 минуты ⚡
2. **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)** — шпаргалка с командами 📋

### Создаёшь новый импортер?
1. **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** — подробное руководство с примерами 📖
2. **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** — справочник всех категорий 📊
3. **[importFromCsv.TEMPLATE.js](./importFromCsv.TEMPLATE.js)** — простой шаблон 📄
4. **[importFromCsv.TEMPLATE_v2.js](./importFromCsv.TEMPLATE_v2.js)** — шаблон с примерами кода 📝

### Нужны команды?
- **[CSV_IMPORT_COMMANDS.md](./CSV_IMPORT_COMMANDS.md)** — все команды для копипаста 🚀

### Хочешь понять архитектуру?
- **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** — общий обзор системы 🏗️
- **[csvImportHelpers.js](./csvImportHelpers.js)** — исходный код всех функций 💻

---

## 📖 Документы по уровню сложности

### 🟢 Уровень 1: Быстрый старт (5 минут)

| Документ | Описание | Для кого |
|----------|----------|---------|
| **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)** | Импорт готового CSV за 2 минуты | Все |
| **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)** | Шпаргалка: команды, функции, структуры | Все |
| **[CSV_IMPORT_COMMANDS.md](./CSV_IMPORT_COMMANDS.md)** | Список всех команд импорта | Все |

### 🟡 Уровень 2: Создание нового импортера (15 минут)

| Документ | Описание | Для кого |
|----------|----------|---------|
| **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** | Пошаговое руководство с примерами | Разработчики |
| **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** | Справочник всех категорий с параметрами | Разработчики |
| **[importFromCsv.TEMPLATE.js](./importFromCsv.TEMPLATE.js)** | Шаблон для быстрого копирования | Разработчики |
| **[importFromCsv.TEMPLATE_v2.js](./importFromCsv.TEMPLATE_v2.js)** | Шаблон с примерами кода для разных категорий | Разработчики |

### 🔴 Уровень 3: Глубокое погружение (для экспертов)

| Документ | Описание | Для кого |
|----------|----------|---------|
| **[CSV_IMPORT_ARCHITECTURE.md](./CSV_IMPORT_ARCHITECTURE.md)** | Диаграммы архитектуры, поток данных, принципы дизайна | Архитекторы |
| **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** | Архитектура системы, принципы работы | Архитекторы |
| **[csvImportHelpers.js](./csvImportHelpers.js)** | Исходный код всех вспомогательных функций | Разработчики |
| **[importInvertersFromCsv.js](./importInvertersFromCsv.js)** | Референсная реализация (инверторы) | Разработчики |
| **[importEssFromCsv.js](./importEssFromCsv.js)** | Референсная реализация (ESS) | Разработчики |

---

## 🎯 Документы по задачам

### Задача: Запустить импорт существующей категории
→ **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)**  
→ **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)**

### Задача: Создать импортер для новой категории
→ **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** (раздел "Быстрый старт: создание нового импортера за 3 шага")  
→ **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** (найди похожую категорию)  
→ **[importFromCsv.TEMPLATE.js](./importFromCsv.TEMPLATE.js)** (скопируй шаблон)

### Задача: Понять структуру attrs
→ **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** (раздел "Структура attrs")  
→ **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** (примеры для каждой категории)  
→ **[csvImportHelpers.js](./csvImportHelpers.js)** (строки 1-122 — парсеры)

### Задача: Кастомизировать логику импорта
→ **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** (раздел "Архитектура")  
→ **[csvImportHelpers.js](./csvImportHelpers.js)** (функция `importFromCsv`, строки 250-380)

### Задача: Отладить ошибки импорта
→ **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)** (раздел "Проблемы и решения")  
→ **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)** (раздел "Частые ошибки")

---

## 🗂️ Структура файлов проекта

```
📦 generate_service_cp/
├── 📁 data/                         # CSV-файлы для импорта
│   ├── PRICE_INVERTERS.csv
│   ├── PRICE_MODULES.csv
│   ├── PRICE_ESS.csv
│   └── ...
│
├── 📁 scripts/
│   ├── 📄 csvImportHelpers.js       # ⭐ Все вспомогательные функции
│   │
│   ├── 📄 importFromCsv.TEMPLATE.js     # 📋 Шаблон (простой)
│   ├── 📄 importFromCsv.TEMPLATE_v2.js  # 📋 Шаблон (с примерами)
│   │
│   ├── 📄 importInvertersFromCsv.js     # ✅ Готовые CSV-импортеры
│   ├── 📄 importModulesFromCsv.js       # ✅
│   ├── 📄 importEssFromCsv.js           # ✅
│   ├── 📄 importBattFromCsv.js          # ✅
│   ├── 📄 importMountBosFromCsv.js      # ✅
│   ├── 📄 importCableFromCsv.js         # ✅
│   └── ...                              # ✅ (все остальные)
│   │
│   ├── 📘 CSV_IMPORT_INDEX.md           # 📚 Этот файл (главный индекс)
│   ├── 📗 CSV_IMPORT_QUICK_START.md     # ⚡ Быстрый старт
│   ├── 📙 CSV_IMPORT_GUIDE.md           # 📖 Подробное руководство
│   ├── 📕 CSV_CATEGORIES_REFERENCE.md   # 📊 Справочник категорий
│   ├── 📔 CSV_IMPORT_COMMANDS.md        # 🚀 Все команды
│   ├── 📓 CSV_CHEATSHEET.md             # 📋 Шпаргалка
│   └── 📒 CSV_IMPORT_README.md          # 🏗️ Архитектура системы
│
└── 📁 src/
    └── 📁 db/
        └── schema.js                    # Схема БД (price_items, price_categories)
```

---

## 🎓 Учебный путь

### Путь 1: Для новичков (30 минут)
1. Прочитай **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)** (5 мин)
2. Запусти импорт инверторов: `node scripts/importInvertersFromCsv.js` (2 мин)
3. Проверь результат: `node scripts/check-categories.js` (1 мин)
4. Изучи **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)** (10 мин)
5. Попробуй создать импортер для своей категории по **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** (15 мин)

### Путь 2: Для разработчиков (1 час)
1. Прочитай **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** (15 мин)
2. Изучи **[csvImportHelpers.js](./csvImportHelpers.js)** (20 мин)
3. Разбери референсную реализацию **[importInvertersFromCsv.js](./importInvertersFromCsv.js)** (10 мин)
4. Изучи **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** (10 мин)
5. Создай свой импортер по **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** (15 мин)

### Путь 3: Для архитекторов (2 часа)
1. Изучи **[CSV_IMPORT_ARCHITECTURE.md](./CSV_IMPORT_ARCHITECTURE.md)** — диаграммы и поток данных (25 мин)
2. Прочитай **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** полностью (25 мин)
3. Изучи **[csvImportHelpers.js](./csvImportHelpers.js)** построчно (40 мин)
4. Разбери все существующие импортеры (15 мин)
5. Изучи Excel-скрипты для понимания маппинга (15 мин)
6. Прочитай **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** для понимания best practices (10 мин)

---

## 🔗 Быстрые ссылки

### 📄 Шаблоны
- [importFromCsv.TEMPLATE.js](./importFromCsv.TEMPLATE.js) — простой шаблон
- [importFromCsv.TEMPLATE_v2.js](./importFromCsv.TEMPLATE_v2.js) — с примерами кода

### 💻 Исходный код
- [csvImportHelpers.js](./csvImportHelpers.js) — все вспомогательные функции
- [importInvertersFromCsv.js](./importInvertersFromCsv.js) — референсная реализация (инверторы)
- [importEssFromCsv.js](./importEssFromCsv.js) — референсная реализация (ESS)

### 📚 Документация
- [CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md) — быстрый старт
- [CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md) — подробное руководство
- [CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md) — справочник категорий
- [CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md) — шпаргалка
- [CSV_IMPORT_COMMANDS.md](./CSV_IMPORT_COMMANDS.md) — команды
- [CSV_IMPORT_ARCHITECTURE.md](./CSV_IMPORT_ARCHITECTURE.md) — диаграммы архитектуры
- [CSV_IMPORT_README.md](./CSV_IMPORT_README.md) — архитектура

---

## ✅ Готовые CSV-импортеры (полный список)

| № | Категория | Скрипт | Статус |
|---|-----------|--------|--------|
| 1 | Инверторы | `importInvertersFromCsv.js` | ✅ |
| 2 | Модули | `importModulesFromCsv.js` | ✅ |
| 3 | ESS | `importEssFromCsv.js` | ✅ |
| 4 | Батареи | `importBattFromCsv.js` | ✅ |
| 5 | Крепёж/BOS | `importMountBosFromCsv.js` | ✅ |
| 6 | Кабели | `importCableFromCsv.js` | ✅ |
| 7 | Коннекторы | `importConnectorFromCsv.js` | ✅ |
| 8 | Предохранители | `importFuseFromCsv.js` | ✅ |
| 9 | Лотки | `importLotkiFromCsv.js` | ✅ |
| 10 | Эл. панели | `importElPanelFromCsv.js` | ✅ |
| 11 | Трансформаторы | `importTransFromCsv.js` | ✅ |
| 12 | УЗИПы | `importUzipFromCsv.js` | ✅ |
| 13 | Счётчики | `importSmartmetersFromCsv.js` | ✅ |
| 14 | CPO90 | `importCpo90FromCsv.js` | ✅ |
| 15 | PowOff | `importPowOffFromCsv.js` | ✅ |

---

## 💡 Рекомендации

### Для менеджеров
Читай только: **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)** и **[CSV_IMPORT_COMMANDS.md](./CSV_IMPORT_COMMANDS.md)**

### Для разработчиков
Начни с: **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** и **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)**

### Для архитекторов
Прочитай всё в таком порядке:
1. **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)** — общая архитектура
2. **[csvImportHelpers.js](./csvImportHelpers.js)** — исходный код
3. **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)** — best practices
4. **[CSV_CATEGORIES_REFERENCE.md](./CSV_CATEGORIES_REFERENCE.md)** — детали категорий

---

## 🆘 Помощь

**Не знаешь, с чего начать?**  
→ Открой **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)**

**Нужна конкретная команда?**  
→ Открой **[CSV_CHEATSHEET.md](./CSV_CHEATSHEET.md)**

**Создаёшь новый импортер?**  
→ Следуй **[CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md)**, раздел "Быстрый старт"

**Что-то сломалось?**  
→ Смотри **[CSV_IMPORT_QUICK_START.md](./CSV_IMPORT_QUICK_START.md)**, раздел "Проблемы и решения"

**Хочешь понять, как это работает?**  
→ Читай **[CSV_IMPORT_README.md](./CSV_IMPORT_README.md)**

---

**🎉 Добро пожаловать в систему CSV-импорта! Выбери свой путь и начни работу.**

---

_Документация создана: 2025-11-19_  
_Версия: 2.0_  
_Статус: Production Ready ✅_


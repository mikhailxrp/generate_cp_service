# 📋 Команды импорта из CSV

## 🔥 Готовые скрипты

Эти скрипты полностью готовы к использованию:

```bash
# Инверторы
node scripts/importInvertersFromCsv.js

# Солнечные панели
node scripts/importModulesFromCsv.js

# Системы накопления энергии (ESS)
node scripts/importEssFromCsv.js
```

---

## 📂 Соответствие CSV → Категория

| CSV-файл                     | Категория | Скрипт                    | Статус           |
| ---------------------------- | --------- | ------------------------- | ---------------- |
| `./data/PRICE_INVERTERS.csv` | inverter  | importInvertersFromCsv.js | ✅ Готов         |
| `./data/PRICE_MODULES.csv`   | panel     | importModulesFromCsv.js   | ✅ Готов         |
| `./data/PRICE_ESS.csv`       | ess       | importEssFromCsv.js       | ✅ Готов         |
| `./data/PRICE_BATT.csv`      | batt      | -                         | 🔨 Нужно создать |
| `./data/PRICE_MOUNT_BOS.csv` | mount_bos | -                         | 🔨 Нужно создать |

---

## 🛠️ Создание нового скрипта (за 3 минуты)

### Шаг 1: Скопируйте шаблон

```bash
cp scripts/importFromCsv.TEMPLATE.js scripts/importBattFromCsv.js
```

### Шаг 2: Откройте файл и измените константы

```javascript
// Было:
const CSV_PATH = "./data/PRICE_ESS.csv";
const CATEGORY_CODE = "ess";
const TYPE_CODE = "ess";
const CATEGORY_NAME = "Системы накопления энергии (ESS)";

// Стало:
const CSV_PATH = "./data/PRICE_BATT.csv";
const CATEGORY_CODE = "batt";
const TYPE_CODE = "batt";
const CATEGORY_NAME = "Батареи";
```

### Шаг 3: Скопируйте функцию маппинга из Excel-скрипта

Найдите `scripts/importBatt.js` (или аналогичный) и скопируйте функцию `mapBattRowToPriceItem` в ваш CSV-скрипт.

**ВАЖНО:** Сохраните структуру `attrs` без изменений!

### Шаг 4: Запустите

```bash
node scripts/importBattFromCsv.js
```

---

## 🔄 Массовый импорт всех категорий

Создайте скрипт `scripts/importAllFromCsv.js`:

```javascript
import { execSync } from "child_process";

const scripts = [
  "scripts/importInvertersFromCsv.js",
  "scripts/importModulesFromCsv.js",
  "scripts/importEssFromCsv.js",
  // Добавьте остальные скрипты по мере готовности
];

console.log("🚀 Запускаю массовый импорт...\n");

for (const script of scripts) {
  console.log(`\n📂 Запускаю: ${script}`);
  try {
    execSync(`node ${script}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Ошибка в ${script}:`, err.message);
  }
}

console.log("\n✅ Массовый импорт завершён!");
```

Затем запустите:

```bash
node scripts/importAllFromCsv.js
```

---

## 🔍 Проверка перед импортом

### 1. Убедитесь, что категория существует

```sql
SELECT * FROM price_categories WHERE code = 'ess';
```

Если нет — добавьте:

```sql
INSERT INTO price_categories (code, title, group_code)
VALUES ('ess', 'Системы накопления энергии', 'core');
```

### 2. Проверьте формат CSV

```bash
head -n 1 ./data/PRICE_ESS.csv
```

Вывод должен содержать заголовки, идентичные Excel:

```
SKU,Наименование,Бренд,Категория,Цена_базовая,Валюта,Наличие,Приоритет,...
```

### 3. Убедитесь, что кодировка UTF-8

Если видите кракозябры:

```bash
# Linux/Mac
iconv -f WINDOWS-1251 -t UTF-8 input.csv > output.csv

# Windows PowerShell
Get-Content input.csv -Encoding Default | Set-Content output.csv -Encoding UTF8
```

---

## 📊 Мониторинг импорта

### Просмотр логов в реальном времени

```bash
node scripts/importInvertersFromCsv.js | tee import.log
```

### Проверка количества записей после импорта

```sql
SELECT type_code, COUNT(*) as count
FROM price_items
GROUP BY type_code;
```

**Ожидаемый вывод:**

```
+-----------+-------+
| type_code | count |
+-----------+-------+
| inverter  |   142 |
| panel     |   87  |
| ess       |   23  |
+-----------+-------+
```

---

## 🐛 Отладка

### Тестирование на 5 строках

Измените `csvImportHelpers.js` → функцию `importFromCsv`:

```javascript
let processedCount = 0;
const MAX_TEST_ROWS = 5; // добавить константу

for await (const row of parser) {
  if (processedCount >= MAX_TEST_ROWS) break; // добавить проверку
  processedCount++;
  // ... остальной код
}
```

### Просмотр структуры attrs перед вставкой

В функции маппинга добавьте:

```javascript
console.log("📋 Attrs:", JSON.stringify(attrs, null, 2));
```

---

## 💾 Резервное копирование перед импортом

```bash
# Linux/Mac
mysqldump -u user -p database_name price_items > backup_price_items.sql

# Восстановление
mysql -u user -p database_name < backup_price_items.sql
```

---

## ⚙️ Параметры запуска

### Verbose режим (детальные логи)

По умолчанию скрипт показывает только анимированный loader и итоговую статистику. Для просмотра каждой обрабатываемой записи добавьте параметр `verbose: true`:

```javascript
await importFromCsv({
  csvPath,
  categoryCode: "inverter",
  categoryName: "Инверторы",
  mapRowToPriceItem: mapInverterRowToPriceItem,
  db,
  schema: { priceCategories, priceItems },
  verbose: true, // 🔹 Детальные логи
});
```

**Вывод с `verbose: true`:**

```
⠋ Обработано строк: 15 | Время: 3s
➕ Добавлено: Huawei SUN2000-5KTL-L1 (INV-001)
⠙ Обработано строк: 16 | Время: 3s
🔄 Обновлено: Growatt MIN 6000TL-XH (INV-002)
⠹ Обработано строк: 17 | Время: 3s
```

### Кастомный путь к CSV

Можно расширить скрипты для приёма аргументов:

```javascript
// В начале скрипта:
const csvPath =
  process.argv[2] || resolve(process.cwd(), "./data/PRICE_ESS.csv");
```

Тогда запуск:

```bash
node scripts/importEssFromCsv.js ./data/custom_ess.csv
```

---

## 🎯 Чеклист готовности скрипта

- [ ] CSV-файл лежит в `./data/`
- [ ] Заголовки CSV совпадают с Excel
- [ ] Категория существует в `price_categories`
- [ ] Функция маппинга скопирована из Excel-скрипта
- [ ] Константы `CSV_PATH`, `CATEGORY_CODE`, `TYPE_CODE` указаны правильно
- [ ] Тестовый запуск успешен (5-10 строк)
- [ ] Сделан бэкап БД (если импорт боевой)

---

**Документация:**

- 📖 [Полная документация](CSV_IMPORT_README.md)
- 🚀 [Быстрый старт](../CSV_IMPORT_QUICKSTART.md)
- 📝 [Шаблон скрипта](importFromCsv.TEMPLATE.js)

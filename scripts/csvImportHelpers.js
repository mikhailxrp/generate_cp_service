/**
 * 🛠️ Общие вспомогательные функции для импорта из CSV
 *
 * Эти функции используются всеми CSV-импортерами для единообразного
 * парсинга данных из строк CSV в нужные типы.
 *
 * ВАЖНО: эти функции идентичны тем, что используются в Excel-импортерах.
 * Не меняйте логику — это обеспечивает консистентность данных!
 */

// ============================================================================
// ПАРСИНГ ЧИСЕЛ
// ============================================================================

/**
 * Парсит строку в float (с поддержкой запятой как десятичного разделителя)
 * @param {any} v - значение из CSV
 * @returns {number|null}
 */
export const toNum = (v) => {
  if (v == null) return null;
  const str = String(v).replace(",", ".").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
};

/**
 * Парсит строку в целое число
 * @param {any} v - значение из CSV
 * @returns {number|null}
 */
export const toInt = (v) => {
  if (v == null) return null;
  const str = String(v).trim();
  if (!str) return null;
  const num = parseInt(str, 10);
  return Number.isNaN(num) ? null : num;
};

// ============================================================================
// ПАРСИНГ БУЛЕВЫХ ЗНАЧЕНИЙ
// ============================================================================

/**
 * Парсит строку в boolean
 * Поддерживает: "Да", "1", "yes", "true" → true
 * @param {any} v - значение из CSV
 * @returns {boolean}
 */
export const toBool = (v) => {
  if (v == null) return false;
  const str = String(v).toLowerCase().trim();
  return ["да", "1", "yes", "true"].includes(str);
};

// ============================================================================
// ПАРСИНГ НАЛИЧИЯ И ПРИОРИТЕТА (для price_items.stock и price_items.priority)
// ============================================================================

/**
 * Парсит "Наличие" из CSV в числовой флаг
 * "Да", "есть", "в наличии" → 1
 * "Нет", "нет в наличии" → 0
 * @param {any} v - значение из колонки "Наличие"
 * @returns {number} - 0 или 1
 */
export const parseStockFlag = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (["да", "yes", "есть", "в наличии", "1", "true"].includes(s)) return 1;
  if (["нет", "no", "0", "false"].includes(s)) return 0;
  return 0;
};

/**
 * Парсит "Приоритет" из CSV в число
 * "низкий" → 1
 * "средний" → 2
 * "высокий" → 3
 * @param {any} v - значение из колонки "Приоритет"
 * @returns {number} - 0, 1, 2 или 3
 */
export const parsePriority = (v) => {
  if (v == null) return 0;
  const s = String(v).toLowerCase().trim();
  if (s.startsWith("низ")) return 1;
  if (s.startsWith("сред")) return 2;
  if (s.startsWith("выс")) return 3;
  return 0;
};

// ============================================================================
// ПАРСИНГ СПЕЦИФИЧНЫХ ЗНАЧЕНИЙ ДЛЯ ИНВЕРТОРОВ
// ============================================================================

/**
 * Парсит тип сети инвертора
 * @param {any} v - значение из колонки "Тип_инвертора"
 * @returns {"on_grid"|"hybrid"|"off_grid"}
 */
export const parseGridType = (v) => {
  if (!v) return "on_grid";
  const str = String(v).toLowerCase();
  if (str.includes("гибрид")) return "hybrid";
  if (str.includes("off")) return "off_grid";
  return "on_grid";
};

/**
 * Парсит поддержку батарей инвертором
 * @param {any} v - значение из колонки "Тип_BATT_LV/HV"
 * @returns {"lv"|"hv"|"none"}
 */
export const parseBatterySupport = (v) => {
  if (!v) return "none";
  const s = String(v).toUpperCase();
  if (s.includes("LV")) return "lv";
  if (s.includes("HV")) return "hv";
  return "none";
};

// ============================================================================
// ФУНКЦИЯ UPSERT (используется всеми импортерами)
// ============================================================================

/**
 * Вставка или обновление записи в price_items через raw SQL.
 *
 * Drizzle ORM не поддерживает ON DUPLICATE KEY UPDATE нативно,
 * поэтому используем db.execute() с сырым SQL.
 *
 * @param {object} db - экземпляр Drizzle DB
 * @param {object} mapped - объект с полями price_items
 */
export async function upsertPriceItem(db, mapped) {
  const attrsJson = JSON.stringify(mapped.attrs);

  const query = `
    INSERT INTO price_items (
      category_id, type_code, sku, title, price_rub, currency,
      stock, priority, warehouse_region, lead_days, spec_url, comment, attrs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category_id = VALUES(category_id),
      type_code = VALUES(type_code),
      title = VALUES(title),
      price_rub = VALUES(price_rub),
      currency = VALUES(currency),
      stock = VALUES(stock),
      priority = VALUES(priority),
      warehouse_region = VALUES(warehouse_region),
      lead_days = VALUES(lead_days),
      spec_url = VALUES(spec_url),
      comment = VALUES(comment),
      attrs = VALUES(attrs),
      updated_at = CURRENT_TIMESTAMP
  `;

  await db.execute(query, [
    mapped.categoryId,
    mapped.typeCode,
    mapped.sku,
    mapped.title,
    mapped.priceRub,
    mapped.currency,
    mapped.stock,
    mapped.priority,
    mapped.warehouseRegion,
    mapped.leadDays,
    mapped.specUrl,
    mapped.comment,
    attrsJson,
  ]);
}

// ============================================================================
// ОБЩАЯ ФУНКЦИЯ ИМПОРТА (универсальный каркас)
// ============================================================================

/**
 * Универсальная функция импорта из CSV в price_items
 *
 * @param {object} config - конфигурация импорта
 * @param {string} config.csvPath - путь к CSV-файлу
 * @param {string} config.categoryCode - код категории (например, 'inverter', 'panel')
 * @param {string} config.categoryName - название категории для логов
 * @param {function} config.mapRowToPriceItem - функция маппинга (row, categoryId) => priceItem
 * @param {object} config.db - экземпляр Drizzle DB
 * @param {object} config.schema - схема БД { priceCategories, priceItems }
 */
// ============================================================================
// LOADER / ПРОГРЕСС-БАР
// ============================================================================

/**
 * Создаёт анимированный loader для консоли
 */
class ImportLoader {
  constructor(categoryName) {
    this.categoryName = categoryName;
    this.frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.currentFrame = 0;
    this.interval = null;
    this.processed = 0;
    this.lastUpdate = Date.now();
  }

  start() {
    // Очистка консоли и начальное сообщение
    console.clear();
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🚀 Импорт: ${this.categoryName}`);
    console.log(`${"=".repeat(60)}\n`);

    // Показываем первый кадр сразу
    this._render();

    this.interval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this._render();
    }, 80);
  }

  _render() {
    const spinner = this.frames[this.currentFrame];
    const elapsed = Math.floor((Date.now() - this.lastUpdate) / 1000);
    const line = `${spinner} Обработано строк: ${this.processed} | Время: ${elapsed}s`;
    
    // Простой метод — перезаписываем строку с запасом пробелов
    // Работает во всех терминалах (включая PowerShell без ANSI)
    const paddedLine = line.padEnd(60, " ");
    process.stdout.write(`\r${paddedLine}`);
  }

  update(count) {
    this.processed = count;
    // Немедленно обновляем вывод при ручном апдейте
    if (this.interval) {
      this._render();
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      // Очищаем строку лоадера перед финальным выводом
      process.stdout.write("\r" + " ".repeat(60) + "\r");
    }
  }
}

/**
 * Универсальная функция импорта из CSV в price_items с loader
 *
 * @param {object} config - конфигурация импорта
 * @param {string} config.csvPath - путь к CSV-файлу
 * @param {string} config.categoryCode - код категории (например, 'inverter', 'panel')
 * @param {string} config.categoryName - название категории для логов
 * @param {function} config.mapRowToPriceItem - функция маппинга (row, categoryId) => priceItem
 * @param {object} config.db - экземпляр Drizzle DB
 * @param {object} config.schema - схема БД { priceCategories, priceItems }
 * @param {boolean} config.verbose - показывать детальные логи (по умолчанию false)
 */
export async function importFromCsv(config) {
  const {
    csvPath,
    categoryCode,
    categoryName,
    mapRowToPriceItem,
    db,
    schema,
    verbose = false,
  } = config;

  // Динамический импорт для избежания circular dependencies
  const { createReadStream } = await import("fs");
  const { parse } = await import("csv-parse");
  const { eq } = await import("drizzle-orm");

  const loader = new ImportLoader(categoryName);

  try {
    loader.start();

    // Получаем категорию из БД
    const [category] = await db
      .select()
      .from(schema.priceCategories)
      .where(eq(schema.priceCategories.code, categoryCode))
      .limit(1);

    if (!category) {
      loader.stop();
      throw new Error(
        `❌ Категория '${categoryCode}' не найдена в price_categories!`
      );
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let totalProcessed = 0;
    const errors = [];

    // Принудительно обновляем лоадер после получения категории
    loader.update(0);

    // Читаем CSV построчно через stream
    const parser = createReadStream(csvPath).pipe(
      parse({
        columns: true, // первая строка = заголовки
        skip_empty_lines: true,
        trim: true,
        bom: true, // убираем BOM, если есть
        encoding: "utf8",
      })
    );

    // Обрабатываем каждую строку
    for await (const row of parser) {
      totalProcessed++;
      loader.update(totalProcessed);

      // Пропускаем строки без SKU или Наименования
      if (!row["SKU"] || !row["Наименование"]) {
        skipped++;
        continue;
      }

      try {
        const mapped = mapRowToPriceItem(row, category.id);

        // Проверяем, есть ли уже такой SKU
        const [existing] = await db
          .select({ id: schema.priceItems.id })
          .from(schema.priceItems)
          .where(eq(schema.priceItems.sku, mapped.sku))
          .limit(1);

        await upsertPriceItem(db, mapped);

        if (existing) {
          updated++;
          if (verbose) {
            console.log(`\n🔄 Обновлено: ${mapped.title} (${mapped.sku})`);
          }
        } else {
          inserted++;
          if (verbose) {
            console.log(`\n➕ Добавлено: ${mapped.title} (${mapped.sku})`);
          }
        }
      } catch (err) {
        skipped++;
        errors.push({ sku: row["SKU"], error: err.message });
        if (verbose) {
          console.log(`\n❌ Ошибка: ${row["SKU"]} - ${err.message}`);
        }
      }
    }

    loader.stop();

    // Итоговый отчёт
    console.log(`\n${"=".repeat(60)}`);
    console.log(`✅ Импорт завершён: ${categoryName}`);
    console.log(`${"=".repeat(60)}\n`);

    console.log(`📊 Статистика:`);
    console.log(`   ➕ Добавлено новых записей: ${inserted}`);
    console.log(`   🔄 Обновлено существующих: ${updated}`);
    console.log(`   ⚠️  Пропущено (ошибки/пустые): ${skipped}`);
    console.log(`   📝 Всего обработано строк: ${totalProcessed}`);

    if (errors.length > 0 && errors.length <= 10) {
      console.log(`\n❌ Ошибки (${errors.length}):`);
      errors.forEach(({ sku, error }) => {
        console.log(`   • ${sku}: ${error}`);
      });
    } else if (errors.length > 10) {
      console.log(
        `\n❌ Ошибок: ${errors.length} (показаны первые 10, остальные пропущены)`
      );
      errors.slice(0, 10).forEach(({ sku, error }) => {
        console.log(`   • ${sku}: ${error}`);
      });
    }

    console.log(`\n${"=".repeat(60)}\n`);

    return { inserted, updated, skipped, errors };
  } catch (err) {
    loader.stop();
    console.error(`\n❌ Критическая ошибка импорта ${categoryName}:`, err);
    throw err;
  }
}

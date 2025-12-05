/**
 * МОДУЛЬ РАСЧЁТА ОКУПАЕМОСТИ СЭС
 * 
 * Логика повторяет Excel-таблицу "Окупаемость":
 * - Колонка C: % остаточной мощности панелей
 * - Колонка D: Годовая выработка СЭС (кВт·ч)
 * - Колонка E: Тариф (руб/кВт·ч)
 * - Колонка F: Сумма за год (экономия)
 * - Колонка G: Нарастающий итог (кумулятивная экономия)
 */

/**
 * Расчёт окупаемости СЭС
 * @param {Object} data - Объект с данными проекта
 * @param {Object} options - Дополнительные опции (systemCost если не в data)
 * @returns {Object} Результат расчёта
 */
export function calculatePayback(data, options = {}) {
  // === 1. БАЗОВЫЕ ПЕРЕМЕННЫЕ ===
  const paybackData = data?.project?.paybackData || {};

  // Годовая генерация в первый год (кВт·ч) — обязательный параметр
  // В Excel это ячейка D4
  const annualGenerationYear1 = paybackData.annualGeneration || 0;

  // Общая стоимость СЭС с установкой (руб)
  const systemCost = paybackData.systemCost ?? options.systemCost ?? 0;

  // Тариф в первый год (руб/кВт·ч)
  // В Excel это E4 = 10
  const tariffYear1 = paybackData.tariffYear1 ?? 10;

  // Ежегодный рост тарифа (доля)
  // В Excel: E5 = E4 * 1.07, т.е. +7% в год
  const tariffInflationRate = paybackData.tariffInflationRate ?? 0.07;

  // Остаточная мощность во 2-й год (доля от 1.0)
  // В Excel: C5 = 0.994
  const secondYearResidual = paybackData.secondYearResidual ?? 0.994;

  // Ежегодное падение остаточной мощности (абсолютное, начиная с 3-го года)
  // В Excel: C6 = C5 - 0.0032
  const yearlyDegradationDelta = paybackData.yearlyDegradationDelta ?? 0.0032;

  // Горизонт расчёта (лет)
  // В Excel таблица на 25 лет
  const yearsHorizon = paybackData.yearsHorizon ?? 25;

  // === 2. ПОСЛЕДОВАТЕЛЬНОСТЬ ОСТАТОЧНОЙ МОЩНОСТИ (колонка C в Excel) ===
  // C4 = 1 (100%)
  // C5 = 0.994 (фиксированное значение)
  // C6 = C5 - 0.0032, C7 = C6 - 0.0032, ...
  const residuals = [];
  for (let year = 1; year <= yearsHorizon; year++) {
    if (year === 1) {
      // Год 1: 100% мощности (C4 = 1)
      residuals[year] = 1.0;
    } else if (year === 2) {
      // Год 2: фиксированное значение (C5 = 0.994)
      residuals[year] = secondYearResidual;
    } else {
      // Год 3+: C_n = C_(n-1) - 0.0032
      residuals[year] = Math.max(0, residuals[year - 1] - yearlyDegradationDelta);
    }
  }

  // === 3. ГОДОВАЯ ВЫРАБОТКА (колонка D в Excel) ===
  // D4 = базовая генерация
  // D5 = D4 * C5
  // D6 = D4 * C6
  // ...
  const yearlyGeneration = [];
  for (let year = 1; year <= yearsHorizon; year++) {
    yearlyGeneration[year] = annualGenerationYear1 * (residuals[year] ?? 0);
  }

  // === 4. ТАРИФ ПО ГОДАМ (колонка E в Excel) ===
  // E4 = 10
  // E5 = E4 * 1.07
  // E6 = E5 * 1.07
  // ...
  const tariffs = [];
  for (let year = 1; year <= yearsHorizon; year++) {
    if (year === 1) {
      tariffs[year] = tariffYear1;
    } else {
      tariffs[year] = tariffs[year - 1] * (1 + tariffInflationRate);
    }
  }

  // === 5. ЕЖЕГОДНАЯ ЭКОНОМИЯ И НАРАСТАЮЩИЙ ИТОГ (колонки F и G в Excel) ===
  // F_n = D_n * E_n (экономия за год)
  // G_n = G_(n-1) + F_n (нарастающий итог)
  const yearlySavings = [];
  const cumulativeSavings = [];
  for (let year = 1; year <= yearsHorizon; year++) {
    const gen = yearlyGeneration[year];
    const tariff = tariffs[year];
    const saving = gen * tariff;
    
    yearlySavings[year] = saving;
    
    if (year === 1) {
      cumulativeSavings[year] = saving;
    } else {
      cumulativeSavings[year] = cumulativeSavings[year - 1] + saving;
    }
  }

  // === 6. СРОК ОКУПАЕМОСТИ ===
  // Первый год, когда cumulativeSavings >= systemCost
  let paybackYear = null;
  let paybackYearExact = null;

  if (systemCost > 0) {
    for (let year = 1; year <= yearsHorizon; year++) {
      const cum = cumulativeSavings[year];
      if (cum >= systemCost) {
        paybackYear = year;
        
        // Линейная интерполяция для точного значения
        if (year === 1) {
          // Окупились в первый же год
          const fraction = systemCost / cum;
          paybackYearExact = fraction;
        } else {
          const prevCum = cumulativeSavings[year - 1];
          const delta = cum - prevCum;
          const fraction = delta > 0 ? (systemCost - prevCum) / delta : 0;
          paybackYearExact = (year - 1) + fraction;
        }
        break;
      }
    }
  }

  // === 7. ФОРМИРОВАНИЕ МАССИВА yearly ДЛЯ ВОЗВРАТА ===
  const yearly = [];
  for (let year = 1; year <= yearsHorizon; year++) {
    yearly.push({
      year,
      residual: residuals[year],
      yearlyGeneration: yearlyGeneration[year],
      tariff: tariffs[year],
      yearlySavings: yearlySavings[year],
      cumulativeSavings: cumulativeSavings[year],
    });
  }

  // === 8. ВОЗВРАТ РЕЗУЛЬТАТА ===
  return {
    yearly,
    paybackYear,
    paybackYearExact,
    paybackReached: paybackYear != null,
    systemCost,
    // Итоговые значения за весь период
    totalSavings: cumulativeSavings[yearsHorizon] || 0,
    netProfit: (cumulativeSavings[yearsHorizon] || 0) - systemCost,
    params: {
      annualGenerationYear1,
      tariffYear1,
      tariffInflationRate,
      secondYearResidual,
      yearlyDegradationDelta,
      yearsHorizon,
    },
  };
}

/**
 * Форматирование числа с разделителями тысяч
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированное число
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Форматирование денежной суммы
 * @param {number} amount - Сумма в рублях
 * @returns {string} Отформатированная сумма
 */
export function formatMoney(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}





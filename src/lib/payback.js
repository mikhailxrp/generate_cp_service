import paybackTable from "./payback_table_from_excel.json";

/**
 * МОДУЛЬ ОКУПАЕМОСТИ
 *
 * Режимы работы:
 * - TABLE_MODE: поиск по таблице paybackTable (по умолчанию)
 * - CALC_MODE: расчёт экономии и деградации
 */

// ===== НАСТРОЙКИ =====
const PAYBACK_MODE = "TABLE_MODE"; // "TABLE_MODE" или "CALC_MODE"

// ===== ТАБЛИЧНЫЙ РЕЖИМ =====

/**
 * Поиск года окупаемости по таблице paybackTable
 * @param {Object} params - Параметры расчёта
 * @param {number} params.total_cost_rub - Общая стоимость проекта (оборудование + услуги)
 * @returns {number|null} Год окупаемости или null, если не найден
 */
function calcPaybackYearsTable({ total_cost_rub }) {
  const totalCost = Number(total_cost_rub) || 0;

  if (!Array.isArray(paybackTable) || paybackTable.length === 0) {
    console.warn("paybackTable is empty or not an array");
    return null;
  }

  if (totalCost <= 0) {
    return null;
  }

  // Сортируем таблицу по cumulative для поиска
  const sortedTable = [...paybackTable].sort(
    (a, b) => a.cumulative - b.cumulative
  );

  // Находим ближайшее значение cumulative >= totalCost
  let bestMatch = null;
  let minDistance = Infinity;

  for (const row of sortedTable) {
    const cumulative = Number(row.cumulative) || 0;
    const year = Number(row.year) || 0;

    if (cumulative >= totalCost) {
      const distance = cumulative - totalCost;

      // Если это первое подходящее значение или оно ближе к искомому
      if (bestMatch === null || distance < minDistance) {
        bestMatch = { year, cumulative, distance };
        minDistance = distance;
      }
      // Если расстояние одинаковое, выбираем большее cumulative (консервативный подход)
      else if (distance === minDistance && cumulative > bestMatch.cumulative) {
        bestMatch = { year, cumulative, distance };
      }
    }
  }

  return bestMatch ? bestMatch.year : null;
}

/**
 * Расчёт окупаемости с детализацией по таблице
 * @param {Object} params - Параметры расчёта
 * @param {number} params.total_cost_rub - Общая стоимость СЭС в рублях
 * @returns {Object} Результат расчёта с детализацией
 */
function calcPaybackWithDegradationTable({ total_cost_rub }) {
  const totalCost = Number(total_cost_rub) || 0;

  if (!Array.isArray(paybackTable) || paybackTable.length === 0) {
    console.warn("paybackTable is empty or not an array");
    return {
      paybackYear: null,
      totalCost,
      finalCumulativeSavings: 0,
      yearlyData: [],
      netProfit: -totalCost,
    };
  }

  if (totalCost <= 0) {
    return {
      paybackYear: null,
      totalCost,
      finalCumulativeSavings: 0,
      yearlyData: [],
      netProfit: -totalCost,
    };
  }

  // Сортируем таблицу по году
  const sortedTable = [...paybackTable].sort((a, b) => a.year - b.year);

  let paybackYear = null;
  const yearlyData = [];
  let finalCumulativeSavings = 0;

  for (let i = 0; i < sortedTable.length; i++) {
    const row = sortedTable[i];
    const year = Number(row.year) || 0;
    const cumulative = Number(row.cumulative) || 0;

    // Вычисляем annualSaving как разность между текущим и предыдущим cumulative
    const prevCumulative =
      i > 0 ? Number(sortedTable[i - 1].cumulative) || 0 : 0;
    const annualSaving = cumulative - prevCumulative;

    yearlyData.push({
      year,
      generation: 0, // Не используется в табличном подходе
      annualSaving,
      cumulativeSavings: cumulative,
      remainingCost: Math.max(0, totalCost - cumulative),
    });

    // Проверяем окупаемость
    if (paybackYear === null && cumulative >= totalCost) {
      paybackYear = year;
    }

    finalCumulativeSavings = cumulative;
  }

  return {
    paybackYear,
    totalCost,
    finalCumulativeSavings,
    yearlyData,
    netProfit: finalCumulativeSavings - totalCost,
  };
}

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====

/**
 * Расчёт годовой экономии (только для CALC_MODE)
 * @param {Object} params - Параметры расчёта
 * @returns {number} Годовая экономия в рублях
 */
export function calcAnnualSaving(params) {
  if (PAYBACK_MODE === "TABLE_MODE") {
    console.warn("calcAnnualSaving не используется в TABLE_MODE");
    return 0;
  }
  // Здесь будет код для CALC_MODE
  return 0;
}

/**
 * Расчёт окупаемости
 * @param {Object} params - Параметры расчёта
 * @returns {number|null} Окупаемость в годах или null
 */
export function calcPaybackYears(params) {
  if (PAYBACK_MODE === "TABLE_MODE") {
    return calcPaybackYearsTable(params);
  }
  // Здесь будет код для CALC_MODE
  return null;
}

/**
 * Расчёт окупаемости с детализацией
 * @param {Object} params - Параметры расчёта
 * @returns {Object} Результат расчёта с детализацией
 */
export function calcPaybackWithDegradation(params) {
  if (PAYBACK_MODE === "TABLE_MODE") {
    return calcPaybackWithDegradationTable(params);
  }
  // Здесь будет код для CALC_MODE
  return {
    paybackYear: null,
    totalCost: 0,
    finalCumulativeSavings: 0,
    yearlyData: [],
    netProfit: 0,
  };
}

// ===== ОРИГИНАЛЬНЫЙ КОД (ЗАКОММЕНТИРОВАН) =====
/*
export function calcAnnualSaving({
  year_generation_kwh,
  tariff_rub_per_kwh,
  self_consumption_share = 1,
  annual_onm_rub = 0,
  export_price_rub_per_kwh = null,
  monthlyGenKwh = null,
  monthlyLoadKwh = null,
}) {
  let savingRub = 0;

  if (
    Array.isArray(monthlyGenKwh) &&
    Array.isArray(monthlyLoadKwh) &&
    monthlyGenKwh.length === 12 &&
    monthlyLoadKwh.length === 12
  ) {
    // Точный режим: помесячно считаем собственное потребление и экспорт
    for (let i = 0; i < 12; i++) {
      const gen = Math.max(0, Number(monthlyGenKwh[i]) || 0);
      const load = Math.max(0, Number(monthlyLoadKwh[i]) || 0);
      const selfUsed = Math.min(gen, load); // кВт·ч, ушедшие в нагрузку
      const surplus = Math.max(0, gen - selfUsed); // излишки
      const earnSelf = selfUsed * tariff_rub_per_kwh; // экономия на сетевом тарифе
      const earnExp = export_price_rub_per_kwh
        ? surplus * export_price_rub_per_kwh
        : 0;
      savingRub += earnSelf + earnExp;
    }
  } else {
    // Простой режим: доля самопотребления без профилей
    const base =
      (Number(year_generation_kwh) || 0) *
      (Number(tariff_rub_per_kwh) || 0) *
      (Number(self_consumption_share) || 0);
    // Если задан экспорт и self_consumption_share < 1 — добавим доход от продажи излишков
    let exportRub = 0;
    if (export_price_rub_per_kwh && self_consumption_share < 1) {
      const gen = Number(year_generation_kwh) || 0;
      const surplusKwh = gen * (1 - self_consumption_share);
      exportRub = surplusKwh * export_price_rub_per_kwh;
    }
    savingRub = base + exportRub;
  }

  // Вычитаем ежегодные расходы на обслуживание
  return Math.max(0, savingRub - (Number(annual_onm_rub) || 0));
}

export function calcPaybackYears({ total_cost_rub, ...rest }) {
  const annualSaving = calcAnnualSaving(rest);
  if (!annualSaving || annualSaving <= 0) return null;
  const years = (Number(total_cost_rub) || 0) / annualSaving;
  // Ограничим снизу/сверху для аккуратного вывода
  return Number.isFinite(years) ? Number(years.toFixed(2)) : null;
}

export function calcPaybackWithDegradation({
  total_cost_rub,
  year_generation_kwh,
  tariff_rub_per_kwh,
  degradation_percent = 0.5,
  self_consumption_share = 1,
  annual_onm_rub = 0,
  export_price_rub_per_kwh = null,
  max_years = 25,
}) {
  const totalCost = Number(total_cost_rub) || 0;
  const baseGeneration = Number(year_generation_kwh) || 0;
  const tariff = Number(tariff_rub_per_kwh) || 0;
  const degradation = Number(degradation_percent) || 0;
  const selfConsumption = Number(self_consumption_share) || 1;
  const annualOM = Number(annual_onm_rub) || 0;
  const exportPrice = export_price_rub_per_kwh
    ? Number(export_price_rub_per_kwh)
    : null;

  let cumulativeSavings = 0;
  const yearlyData = [];
  let paybackYear = null;

  for (let year = 1; year <= max_years; year++) {
    // Учитываем деградацию: каждый год генерация уменьшается на degradation_percent%
    const currentGeneration =
      baseGeneration * Math.pow(1 - degradation / 100, year - 1);

    // Расчёт экономии для текущего года
    const annualSaving = calcAnnualSaving({
      year_generation_kwh: currentGeneration,
      tariff_rub_per_kwh: tariff,
      self_consumption_share: selfConsumption,
      annual_onm_rub: annualOM,
      export_price_rub_per_kwh: exportPrice,
    });

    cumulativeSavings += annualSaving;
    yearlyData.push({
      year,
      generation: currentGeneration,
      annualSaving,
      cumulativeSavings,
      remainingCost: Math.max(0, totalCost - cumulativeSavings),
    });

    // Проверяем окупаемость
    if (paybackYear === null && cumulativeSavings >= totalCost) {
      paybackYear = year;
    }
  }

  return {
    paybackYear,
    totalCost,
    finalCumulativeSavings: cumulativeSavings,
    yearlyData,
    netProfit: cumulativeSavings - totalCost,
  };
}
*/

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

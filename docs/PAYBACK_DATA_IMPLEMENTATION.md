# Реализация сохранения данных окупаемости в БД

**Дата:** 2025-12-12

## Описание

Реализовано сохранение результатов расчета окупаемости СЭС в базу данных для последующего использования на странице preview без необходимости пересчета.

## Выполненные изменения

### 1. Схема БД (src/db/schema.js)

Добавлено новое поле в таблицу `main_information`:

```javascript
paybackData: json("payback_data"), // результаты расчета окупаемости
```

### 2. Миграция БД

**Файл:** `src/db/migrations/add_payback_data.sql`

```sql
ALTER TABLE main_information 
ADD COLUMN payback_data JSON AFTER services_data;
```

**Скрипт выполнения:** `src/db/migrations/run-migration.js`

Миграция успешно выполнена, поле добавлено в таблицу.

### 3. Server Action

**Файл:** `src/app/actions/savePaybackData.js`

Создана функция для сохранения данных окупаемости:

```javascript
export async function savePaybackDataAction(id, paybackData)
```

### 4. Обновление CreateSesButton

**Файл:** `src/components/CreateSesButton.jsx`

- Добавлен импорт: `import { savePaybackDataAction } from "@/app/actions/savePaybackData"`
- В функции `handleGenerateKP` добавлено сохранение данных окупаемости после сохранения BOM и услуг:

```javascript
// Сохраняем результаты расчета окупаемости
if (paybackResult) {
  console.log("===== СОХРАНЕНИЕ РАСЧЕТА ОКУПАЕМОСТИ =====");
  console.log("Данные окупаемости:", paybackResult);
  await savePaybackDataAction(id, paybackResult);
  console.log("✅ Данные окупаемости сохранены");
}
```

### 5. Страница Preview

**Файл:** `src/app/preview/page.jsx`

- `paybackData` уже извлекалось из БД (строка 80)
- `paybackData` уже добавлялось в `extractedData` (строка 109)
- Обновлена передача props в компоненты:

```javascript
<CpBlockThree
  // ...существующие props
  paybackData={extractedData.paybackData}
/>
<CpBlockFour 
  paybackData={extractedData.paybackData}
  priceKwh={extractedData.priceKwh}
/>
```

## Структура объекта paybackData

```javascript
{
  yearly: [
    {
      year: 1,
      residual: 1.0,              // остаточная мощность (доля)
      yearlyGeneration: 50000,    // выработка за год (кВт·ч)
      tariff: 10,                 // тариф (руб/кВт·ч)
      yearlySavings: 500000,      // экономия за год (руб)
      cumulativeSavings: 500000   // накопленная экономия (руб)
    },
    // ... данные за 25 лет
  ],
  paybackYear: 5,                 // целый год окупаемости
  paybackYearExact: 4.73,         // точный срок окупаемости
  paybackReached: true,           // достигнута ли окупаемость
  systemCost: 2500000,            // стоимость системы (руб)
  totalSavings: 18500000,         // общая экономия за период (руб)
  netProfit: 16000000,            // чистая прибыль (руб)
  params: {
    annualGenerationYear1: 50000,
    tariffYear1: 10,
    tariffInflationRate: 0.07,
    secondYearResidual: 0.994,
    yearlyDegradationDelta: 0.0032,
    yearsHorizon: 25
  }
}
```

## Использование в компонентах

Теперь в компонентах `CpBlockThree` и `CpBlockFour` можно использовать сохраненные данные окупаемости:

```javascript
export default function CpBlockFour({ paybackData, priceKwh }) {
  if (!paybackData || !paybackData.paybackReached) {
    return null; // или показать заглушку
  }

  return (
    <div>
      <h3>Окупаемость: {paybackData.paybackYear} лет</h3>
      <p>Точный срок: {paybackData.paybackYearExact?.toFixed(2)} лет</p>
      <p>Общая экономия: {formatMoney(paybackData.totalSavings)}</p>
      <p>Чистая прибыль: {formatMoney(paybackData.netProfit)}</p>
      <p>ROI: {((paybackData.netProfit / paybackData.systemCost) * 100).toFixed(1)}%</p>
      
      {/* Таблица по годам из paybackData.yearly */}
    </div>
  );
}
```

## Преимущества

1. ✅ Данные окупаемости сохраняются один раз при генерации КП
2. ✅ На странице preview не требуется пересчет
3. ✅ Гарантируется консистентность данных
4. ✅ Возможность отображения детальных расчетов по годам
5. ✅ Быстрая загрузка страницы preview

## Проверка линтера

Все файлы проверены, ошибок линтера нет.


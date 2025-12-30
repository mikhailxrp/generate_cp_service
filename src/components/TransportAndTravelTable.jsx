"use client";

import React, { useState, useMemo, useEffect } from "react";

// ==================== КОНСТАНТЫ ДЛЯ РАСЧЁТОВ ====================
const VAT_RATE = 0.2;
const PER_DIEM_ON_SITE_NO_VAT = 1000;      // суточные на объекте, руб/день/чел, без НДС
const PER_DIEM_ON_ROAD_NO_VAT = 4500;      // суточные в дороге, руб/день/чел, без НДС
const LODGING_PER_APARTMENT_NO_VAT = 3500; // квартира до 4 чел, руб/сутки, без НДС
const CAR_COST_PER_KM_NO_VAT = 58;         // руб/км без НДС
const CAR_COST_PER_KM_VAT = 70;            // руб/км с НДС (фикс, НЕ считать как 58 * 1.2)

// Форматирование чисел с разделителями и 2 знаками после запятой
const formatMoney = (value) => {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function TransportAndTravelTable({ 
  initialData = null, 
  onChange = null 
}) {
  // ==================== STATE: ВХОДНЫЕ ДАННЫЕ ====================
  const [employeesCount, setEmployeesCount] = useState(initialData?.employeesCount || 2);
  const [daysOnSite, setDaysOnSite] = useState(initialData?.daysOnSite || 15);
  const [daysOnRoad, setDaysOnRoad] = useState(initialData?.daysOnRoad || 2);
  const [distanceOneWayKm, setDistanceOneWayKm] = useState(initialData?.distanceOneWayKm || 500);

  // Валидация: не позволять отрицательные значения
  const handleChange = (setter, isInteger = false) => (e) => {
    let value = parseFloat(e.target.value) || 0;
    if (value < 0) value = 0;
    if (isInteger) value = Math.round(value);
    setter(value);
  };

  // ==================== РАСЧЁТЫ ====================
  const calculations = useMemo(() => {
    const n = employeesCount;
    const dSite = daysOnSite;
    const dRoad = daysOnRoad;
    const distanceTotalKm = distanceOneWayKm; // расстояние как есть (без умножения на 2)

    // 1) Суточные на объекте
    const priceSiteNoVat = PER_DIEM_ON_SITE_NO_VAT;
    const priceSiteVat = priceSiteNoVat * (1 + VAT_RATE);
    const sumSiteNoVat = priceSiteNoVat * dSite * n;
    const sumSiteVat = priceSiteVat * dSite * n;

    // 2) Суточные в дороге
    const priceRoadNoVat = PER_DIEM_ON_ROAD_NO_VAT;
    const priceRoadVat = priceRoadNoVat * (1 + VAT_RATE);
    const sumRoadNoVat = priceRoadNoVat * dRoad * n;
    const sumRoadVat = priceRoadVat * dRoad * n;

    // 3) Проживание (квартира до 4 человек)
    // Важно: стоимость считается за квартиру, не за человека
    const priceLodgingNoVat = LODGING_PER_APARTMENT_NO_VAT;
    const priceLodgingVat = priceLodgingNoVat * (1 + VAT_RATE);
    const sumLodgingNoVat = priceLodgingNoVat * dSite;
    const sumLodgingVat = priceLodgingVat * dSite;

    // 4) Проезд на авто туда-обратно
    const priceCarNoVat = CAR_COST_PER_KM_NO_VAT;
    const priceCarVat = CAR_COST_PER_KM_VAT;
    const sumCarNoVat = priceCarNoVat * distanceTotalKm;
    const sumCarVat = priceCarVat * distanceTotalKm;

    // 5) Итоги
    const totalNoVat = sumSiteNoVat + sumRoadNoVat + sumLodgingNoVat + sumCarNoVat;
    const totalVat = sumSiteVat + sumRoadVat + sumLodgingVat + sumCarVat;

    return {
      distanceTotalKm,
      // Суточные на объекте
      priceSiteNoVat,
      priceSiteVat,
      sumSiteNoVat,
      sumSiteVat,
      // Суточные в дороге
      priceRoadNoVat,
      priceRoadVat,
      sumRoadNoVat,
      sumRoadVat,
      // Проживание
      priceLodgingNoVat,
      priceLodgingVat,
      sumLodgingNoVat,
      sumLodgingVat,
      // Проезд
      priceCarNoVat,
      priceCarVat,
      sumCarNoVat,
      sumCarVat,
      // Итого
      totalNoVat,
      totalVat,
    };
  }, [employeesCount, daysOnSite, daysOnRoad, distanceOneWayKm]);

  // Передаем данные наружу через onChange
  useEffect(() => {
    if (onChange) {
      onChange({
        employeesCount,
        daysOnSite,
        daysOnRoad,
        distanceOneWayKm,
        totalCost: calculations.totalVat, // используем стоимость с НДС
        totalCostNoVat: calculations.totalNoVat,
      });
    }
  }, [employeesCount, daysOnSite, daysOnRoad, distanceOneWayKm, calculations, onChange]);

  return (
    <div className="transport-travel-calculator">
      {/* ==================== БЛОК ВВОДА ИСХОДНЫХ ДАННЫХ ==================== */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-2">
          <label className="form-label">Количество сотрудников</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={employeesCount}
            onChange={handleChange(setEmployeesCount, true)}
            min="0"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-2">
          <label className="form-label">Дней на объекте</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={daysOnSite}
            onChange={handleChange(setDaysOnSite, true)}
            min="0"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-2">
          <label className="form-label">Дней в дороге</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={daysOnRoad}
            onChange={handleChange(setDaysOnRoad, true)}
            min="0"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-2">
          <label className="form-label">Расстояние до объекта (км)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={distanceOneWayKm}
            onChange={handleChange(setDistanceOneWayKm, false)}
            min="0"
          />
        </div>
      </div>

      {/* ==================== ТАБЛИЦА РАСХОДОВ ==================== */}
      <div className="table-responsive">
        <table className="table table-sm table-striped table-bordered align-middle" style={{ fontSize: "0.8rem" }}>
          <thead className="table-light">
            <tr>
              <th>Статья расхода</th>
              <th className="text-end">Цена без НДС, руб.</th>
              <th className="text-end">Цена с НДС, руб.</th>
              <th className="text-center">Кол-во дней / км</th>
              <th className="text-center">Кол-во человек</th>
              <th className="text-end">Сумма без НДС, руб.</th>
              <th className="text-end">Сумма с НДС, руб.</th>
            </tr>
          </thead>
          <tbody>
            {/* Строка 1: Суточные на объекте */}
            <tr>
              <td>Суточные на объекте</td>
              <td className="text-end">{formatMoney(calculations.priceSiteNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.priceSiteVat)}</td>
              <td className="text-center">{daysOnSite}</td>
              <td className="text-center">{employeesCount}</td>
              <td className="text-end">{formatMoney(calculations.sumSiteNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.sumSiteVat)}</td>
            </tr>

            {/* Строка 2: Суточные в дороге */}
            <tr>
              <td>Суточные в дороге</td>
              <td className="text-end">{formatMoney(calculations.priceRoadNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.priceRoadVat)}</td>
              <td className="text-center">{daysOnRoad}</td>
              <td className="text-center">{employeesCount}</td>
              <td className="text-end">{formatMoney(calculations.sumRoadNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.sumRoadVat)}</td>
            </tr>

            {/* Строка 3: Проживание (квартира до 4 человек) */}
            <tr>
              <td>Проживание (до 4 чел. в 1 квартире)</td>
              <td className="text-end">{formatMoney(calculations.priceLodgingNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.priceLodgingVat)}</td>
              <td className="text-center">{daysOnSite}</td>
              <td className="text-center text-muted">{employeesCount}</td>
              <td className="text-end">{formatMoney(calculations.sumLodgingNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.sumLodgingVat)}</td>
            </tr>

            {/* Строка 4: Проезд на авто туда-обратно */}
            <tr>
              <td>Проезд на авто туда-обратно, руб./км</td>
              <td className="text-end">{formatMoney(calculations.priceCarNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.priceCarVat)}</td>
              <td className="text-center">
                {formatMoney(calculations.distanceTotalKm)}
              </td>
              <td className="text-center text-muted">1</td>
              <td className="text-end">{formatMoney(calculations.sumCarNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.sumCarVat)}</td>
            </tr>
          </tbody>

          {/* Строка Итого */}
          <tfoot className="table-light">
            <tr className="fw-bold">
              <td colSpan="5">Итого</td>
              <td className="text-end">{formatMoney(calculations.totalNoVat)}</td>
              <td className="text-end">{formatMoney(calculations.totalVat)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}


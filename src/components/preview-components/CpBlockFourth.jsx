"use client";

import "./preview-components.css";
import GraphCardWrapper from "@/components/GraphCardWrapper";
import {
  calcPaybackYears,
  calcPaybackWithDegradation,
  formatNumber,
  formatMoney as formatMoneyPayback,
} from "@/lib/payback";
export default function CpBlockFourth({
  bomData = [],
  servicesData = [],
  combinedData = [],
  totalAnnualGeneration = 0, // тыс. кВт·ч в год
  priceKwh = 0, // ₽/кВт·ч
  monthlyConsumptionKwh = 0, // кВт·ч в месяц
}) {
  return (
    <div className="cp-block-two preview-block-container mb-4">
      <div className="content-container preview-content-card">
        <div className="devider-container">
          <div className="devider"></div>
          <div className="logo-container">
            <img src="/brand/logo.svg" alt="logo" />
          </div>
        </div>

        <div className="container-visual-wrapper">
          <div className="row mt-2">
            <div className="col-lg-12">
              <h2 className="preview-title-section">Прайс и спецификация</h2>
              {(() => {
                const safe = (v, fallback = "—") =>
                  v === undefined || v === null || v === "" ? fallback : v;
                const toNumber = (v, d = 0) => {
                  const n = parseFloat(v);
                  return isNaN(n) ? d : n;
                };
                const formatMoney = (v) =>
                  toNumber(v, 0).toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                    maximumFractionDigits: 0,
                  });
                const calcTotal = (items) => {
                  if (!Array.isArray(items)) return 0;
                  return items.reduce((acc, it) => {
                    const price = toNumber(
                      it.unitPriceRub || it.price || it.basePrice || 0,
                      0
                    );
                    const qty = toNumber(it.qty || it.quantity || 1, 1);
                    return acc + price * qty;
                  }, 0);
                };

                const bomTotal = calcTotal(bomData);
                const servicesTotal = calcTotal(servicesData);
                const grandTotal = bomTotal + servicesTotal;

                return (
                  <>
                    {Array.isArray(bomData) && bomData.length > 0 && (
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="preview-content-card p-3">
                            <h3
                              className="knowledge-title-section"
                              style={{ marginBottom: 12 }}
                            >
                              Оборудование (BOM)
                            </h3>
                            <div className="table-responsive">
                              <table className="table table-sm table-striped align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Наименование</th>
                                    <th style={{ width: 120 }}>Кол-во</th>
                                    <th style={{ width: 180 }}>Цена, ₽</th>
                                    <th style={{ width: 200 }}>Сумма, ₽</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bomData.map((item, idx) => {
                                    const price = toNumber(
                                      item.unitPriceRub ||
                                        item.price ||
                                        item.basePrice ||
                                        0,
                                      0
                                    );
                                    const qty = toNumber(
                                      item.qty || item.quantity || 1,
                                      1
                                    );
                                    const sum = price * qty;
                                    return (
                                      <tr key={idx}>
                                        <td>{safe(item.name || item.title)}</td>
                                        <td>{qty}</td>
                                        <td>
                                          {price ? formatMoney(price) : "—"}
                                        </td>
                                        <td>{sum ? formatMoney(sum) : "—"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                <tfoot className="table-light">
                                  <tr>
                                    <th colSpan="3">Итого по оборудованию:</th>
                                    <th>{formatMoney(bomTotal)}</th>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Array.isArray(servicesData) && servicesData.length > 0 && (
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="preview-content-card p-3">
                            <h3
                              className="knowledge-title-section"
                              style={{ marginBottom: 12 }}
                            >
                              Услуги
                            </h3>
                            <div className="table-responsive">
                              <table className="table table-sm table-striped align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Наименование</th>
                                    <th>Описание</th>
                                    <th style={{ width: 120 }}>Кол-во</th>
                                    <th style={{ width: 180 }}>Цена, ₽</th>
                                    <th style={{ width: 200 }}>Сумма, ₽</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {servicesData.map((srv, idx) => {
                                    const price = toNumber(
                                      srv.price || srv.basePrice || 0,
                                      0
                                    );
                                    const qty = toNumber(srv.quantity || 1, 1);
                                    const sum = price * qty;
                                    return (
                                      <tr key={idx}>
                                        <td>{safe(srv.name || srv.title)}</td>
                                        <td>{safe(srv.description, "")}</td>
                                        <td>{qty}</td>
                                        <td>
                                          {price ? formatMoney(price) : "—"}
                                        </td>
                                        <td>{sum ? formatMoney(sum) : "—"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                <tfoot className="table-light">
                                  <tr>
                                    <th colSpan="4">Итого по услугам:</th>
                                    <th>{formatMoney(servicesTotal)}</th>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(bomTotal > 0 || servicesTotal > 0) && (
                      <div className="row mt-4">
                        <div className="col-lg-6 mx-auto">
                          <div className="preview-content-card p-3 text-center">
                            <h4
                              className="knowledge-title-section"
                              style={{ marginBottom: 8 }}
                            >
                              Общая стоимость проекта
                            </h4>
                            <div className="preview-price-total">
                              {formatMoney(grandTotal)}
                            </div>
                          </div>
                          {(() => {
                            const annualGenerationKwh =
                              toNumber(totalAnnualGeneration, 0) * 1000; // перевод из тыс. кВт·ч
                            const tariff = toNumber(priceKwh, 0);
                            const annualConsumptionKwh =
                              toNumber(monthlyConsumptionKwh, 0) * 12;
                            const selfConsumptionShare =
                              annualConsumptionKwh > 0
                                ? Math.min(
                                    1,
                                    annualGenerationKwh / annualConsumptionKwh
                                  )
                                : 1;

                            // Используем те же функции расчета, что и в CreateSesButton.jsx
                            const paybackData = {
                              total_cost_rub: grandTotal,
                              year_generation_kwh: annualGenerationKwh,
                              tariff_rub_per_kwh: tariff,
                              self_consumption_share: selfConsumptionShare,
                              annual_onm_rub: 0,
                              export_price_rub_per_kwh: null,
                            };

                            const simplePaybackYears =
                              calcPaybackYears(paybackData);
                            const detailedPayback =
                              calcPaybackWithDegradation(paybackData);

                            const getYearWord = (value) => {
                              if (value === null || value === undefined)
                                return "лет";
                              const n = Math.floor(Math.abs(value));
                              const n10 = n % 10;
                              const n100 = n % 100;
                              if (n10 === 1 && n100 !== 11) return "год";
                              if (
                                n10 >= 2 &&
                                n10 <= 4 &&
                                (n100 < 12 || n100 > 14)
                              )
                                return "года";
                              return "лет";
                            };

                            if (!grandTotal || grandTotal <= 0 || !tariff)
                              return null;

                            return (
                              <div className="row mt-3">
                                <div className="col-12">
                                  <div className="preview-content-card p-3">
                                    <h3
                                      className="knowledge-title-section"
                                      style={{ marginBottom: 12 }}
                                    >
                                      Окупаемость
                                    </h3>
                                    <div className="row g-3">
                                      <div className="col-md-6">
                                        <ul
                                          className="list-unstyled preview-text-description"
                                          style={{ marginBottom: 0 }}
                                        >
                                          <li>
                                            <strong>Годовая генерация:</strong>{" "}
                                            {formatNumber(annualGenerationKwh)}{" "}
                                            кВт·ч
                                          </li>
                                          <li>
                                            <strong>
                                              Годовое потребление:
                                            </strong>{" "}
                                            {formatNumber(annualConsumptionKwh)}{" "}
                                            кВт·ч
                                          </li>
                                          <li>
                                            <strong>
                                              Доля самопотребления:
                                            </strong>{" "}
                                            {formatNumber(
                                              selfConsumptionShare * 100
                                            )}
                                            %
                                          </li>
                                          <li>
                                            <strong>Тариф:</strong>{" "}
                                            {formatMoneyPayback(tariff)}
                                            /кВт·ч
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="col-md-6 d-flex align-items-center justify-content-center">
                                        {simplePaybackYears ? (
                                          <div className="text-center">
                                            <strong>Срок окупаемости:</strong>
                                            <div
                                              className="preview-price-total mt-2"
                                              style={{ lineHeight: 1 }}
                                            >
                                              {formatNumber(simplePaybackYears)}
                                            </div>
                                            <div
                                              className="preview-text-description"
                                              style={{ marginTop: 4 }}
                                            >
                                              {getYearWord(simplePaybackYears)}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-center">
                                            <div
                                              className="preview-price-total"
                                              style={{ lineHeight: 1 }}
                                            >
                                              —
                                            </div>
                                            <div
                                              className="preview-text-description"
                                              style={{ marginTop: 4 }}
                                            >
                                              Не окупается
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="col-lg-6 graphik-wrapper">
                          <GraphCardWrapper graphData={combinedData} />
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import "./preview-components.css";

export default function CpBlockDetails({ paybackData, totalCost }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="cp-block cp-block-two">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            ДЕНЕЖНЫЙ ПОТОК ПРОЕКТА (CASHFLOW)/Реалистичный сценарий
          </span>
        </div>
        <div className="cp-line-header__line-wrapper">
          <div className="cp-line-header__dot--left"></div>
          <div className="cp-line-header__line"></div>
          <div className="cp-line-header__dot--right"></div>
        </div>
        <div className="cp-line-header__logo">
          <img
            src="/brand/logo.svg"
            alt="САНХОРС"
            className="cp-line-header__logo-image"
          />
        </div>
      </div>
      <div className="cp-block-details-wrapper">
        <h2 className="cp-block-payback__title">
          ДЕТАЛИЗАЦИЯ{" "}
          <span className="cp-block-payback__title--green">ПО ГОДАМ</span>
        </h2>
        <div className="cp-block-details-inner">
          <div className="cp-block-details-column-left">
            {paybackData &&
            paybackData.yearly &&
            paybackData.yearly.length > 0 ? (
              <table className="cp-details-table">
                <thead>
                  <tr>
                    <th className="cp-details-table__header">Год</th>
                    <th className="cp-details-table__header">
                      Тариф, руб/кВт*ч
                    </th>
                    <th className="cp-details-table__header">
                      Выработка, кВт*ч
                    </th>
                    <th className="cp-details-table__header">
                      Сумма за год, руб.
                    </th>
                    <th className="cp-details-table__header">
                      Нарастающий итог, руб.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Показываем годы: 1-6, затем 10, 15, 20, 25
                    const yearsToShow = [1, 2, 3, 4, 5, 6, 10, 15, 20, 25];
                    const rows = [];
                    let lastShownYear = 0;

                    yearsToShow.forEach((yearNum) => {
                      const yearData = paybackData.yearly.find(
                        (y) => y.year === yearNum
                      );
                      if (!yearData) return;

                      // Добавляем строку с "..." если пропущены годы
                      if (yearNum - lastShownYear > 1 && lastShownYear > 0) {
                        rows.push(
                          <tr
                            key={`gap-${yearNum}`}
                            className="cp-details-table__row--gap"
                          >
                            <td className="cp-details-table__cell cp-details-table__cell--gap">
                              ...
                            </td>
                            <td className="cp-details-table__cell cp-details-table__cell--gap">
                              ...
                            </td>
                            <td className="cp-details-table__cell cp-details-table__cell--gap">
                              ...
                            </td>
                            <td className="cp-details-table__cell cp-details-table__cell--gap">
                              ...
                            </td>
                            <td className="cp-details-table__cell cp-details-table__cell--gap">
                              ...
                            </td>
                          </tr>
                        );
                      }

                      const isPaybackYear =
                        paybackData.paybackYear &&
                        yearData.year === paybackData.paybackYear;

                      // Расчет чистого cashflow (накопленная экономия минус стоимость системы)
                      const netCashflow =
                        yearData.cumulativeSavings - paybackData.systemCost;
                      const isPositiveCashflow = netCashflow >= 0;

                      rows.push(
                        <tr
                          key={yearData.year}
                          className={
                            isPaybackYear
                              ? "cp-details-table__row--payback"
                              : ""
                          }
                        >
                          <td className="cp-details-table__cell cp-details-table__cell--year">
                            {yearData.year}
                          </td>
                          <td className="cp-details-table__cell">
                            {yearData.tariff.toFixed(2)}
                          </td>
                          <td className="cp-details-table__cell">
                            {Math.round(
                              yearData.yearlyGeneration
                            ).toLocaleString("ru-RU")}
                          </td>
                          <td className="cp-details-table__cell">
                            {Math.round(yearData.yearlySavings).toLocaleString(
                              "ru-RU"
                            )}
                          </td>
                          <td className="cp-details-table__cell cp-details-table__cell--cumulative">
                            {isPositiveCashflow && isPaybackYear ? (
                              <>
                                +{" "}
                                {Math.round(netCashflow).toLocaleString(
                                  "ru-RU"
                                )}{" "}
                                <span className="cp-details-table__payback-badge">
                                  Окупаемость
                                </span>
                              </>
                            ) : (
                              Math.round(
                                yearData.cumulativeSavings
                              ).toLocaleString("ru-RU")
                            )}
                          </td>
                        </tr>
                      );

                      lastShownYear = yearNum;
                    });

                    return rows;
                  })()}
                </tbody>
                <tfoot>
                  <tr className="cp-details-table__footer">
                    <td className="cp-details-table__footer-cell cp-details-table__footer-cell--label">
                      Итого
                    </td>
                    <td className="cp-details-table__footer-cell">...</td>
                    <td className="cp-details-table__footer-cell">
                      {Math.round(
                        paybackData.yearly.reduce(
                          (sum, y) => sum + y.yearlyGeneration,
                          0
                        )
                      ).toLocaleString("ru-RU")}
                    </td>
                    <td className="cp-details-table__footer-cell">
                      {Math.round(paybackData.totalSavings).toLocaleString(
                        "ru-RU"
                      )}
                    </td>
                    <td className="cp-details-table__footer-cell cp-details-table__footer-cell--profit">
                      +{" "}
                      {Math.round(paybackData.netProfit).toLocaleString(
                        "ru-RU"
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="cp-details-table__empty">
                Данные окупаемости не доступны
              </div>
            )}
          </div>
          <div className="cp-block-details-column-right">
            {paybackData && totalCost
              ? (() => {
                  // Расчет динамических координат
                  const yearsHorizon = paybackData.params?.yearsHorizon || 25;
                  const paybackYear =
                    paybackData.paybackYearExact ||
                    paybackData.paybackYear ||
                    5;

                  // Координаты графика
                  const graphWidth = 260; // от 40 до 300
                  const graphHeight = 200; // от 40 до 240

                  // Позиция точки окупаемости по X (пропорционально сроку)
                  const paybackX =
                    40 + (paybackYear / yearsHorizon) * graphWidth;
                  const paybackY = 140; // середина по Y

                  // Координаты для кривой затрат (красная линия)
                  const costCurveX1 =
                    40 + (paybackYear / yearsHorizon) * graphWidth * 0.5;
                  const costCurveY1 = 240 - (240 - paybackY) * 0.5;

                  // Координаты для кривой прибыли (зеленая линия)
                  const profitCurveX1 = paybackX + (300 - paybackX) * 0.4;
                  const profitCurveY1 = paybackY - (paybackY - 50) * 0.6;

                  return (
                    <div className="cp-payback-chart">
                      <h3 className="cp-payback-chart__title">
                        Реалистичный график окупаемости
                      </h3>
                      <div className="cp-payback-chart__content">
                        {/* Экономия за период */}
                        <div className="cp-payback-chart__savings">
                          <div className="cp-payback-chart__savings-amount">
                            {(paybackData.totalSavings / 1000000).toFixed(1)}{" "}
                            млн. ₽
                          </div>
                          <div className="cp-payback-chart__savings-label">
                            Экономия за {yearsHorizon} лет
                          </div>
                        </div>

                        {/* График */}
                        <div className="cp-payback-chart__graph">
                          <svg
                            viewBox="0 0 320 280"
                            className="cp-payback-chart__svg"
                          >
                            {/* Левая ось */}
                            <line
                              x1="40"
                              y1="40"
                              x2="40"
                              y2="240"
                              stroke="#999"
                              strokeWidth="1.5"
                            />

                            {/* Нижняя ось */}
                            <line
                              x1="40"
                              y1="240"
                              x2="300"
                              y2="240"
                              stroke="#999"
                              strokeWidth="1.5"
                            />

                            {/* Метки на оси X */}
                            <text
                              x="40"
                              y="260"
                              fontSize="11"
                              fill="#666"
                              textAnchor="middle"
                            >
                              {currentYear}
                            </text>
                            <text
                              x="300"
                              y="260"
                              fontSize="11"
                              fill="#666"
                              textAnchor="middle"
                            >
                              {currentYear + yearsHorizon}
                            </text>

                            {/* Горизонтальная пунктирная линия окупаемости */}
                            <line
                              x1="40"
                              y1={paybackY}
                              x2="300"
                              y2={paybackY}
                              stroke="#00a04a"
                              strokeWidth="1"
                              strokeDasharray="4,4"
                            />

                            {/* Красная линия (затраты) - от начала до точки окупаемости */}
                            <path
                              d={`M 40 240 Q ${costCurveX1} ${costCurveY1}, ${paybackX} ${paybackY}`}
                              fill="none"
                              stroke="#e74c3c"
                              strokeWidth="2.5"
                            />

                            {/* Зеленая область (прибыль после окупаемости) */}
                            <path
                              d={`M ${paybackX} ${paybackY} Q ${profitCurveX1} ${profitCurveY1}, 300 50 L 300 240 L ${paybackX} 240 Z`}
                              fill="rgba(0, 160, 74, 0.25)"
                              stroke="none"
                            />

                            {/* Зеленая линия (накопленная экономия) */}
                            <path
                              d={`M ${paybackX} ${paybackY} Q ${profitCurveX1} ${profitCurveY1}, 300 50`}
                              fill="none"
                              stroke="#00a04a"
                              strokeWidth="2.5"
                            />

                            {/* Точка окупаемости */}
                            <circle
                              cx={paybackX}
                              cy={paybackY}
                              r="6"
                              fill="#00a04a"
                            />

                            {/* Метка окупаемости */}
                            <text
                              x={paybackX}
                              y={paybackY + 25}
                              fontSize="16"
                              fontWeight="600"
                              fill="#000"
                              textAnchor="middle"
                            >
                              {paybackData.paybackYearExact
                                ? paybackData.paybackYearExact.toFixed(1)
                                : paybackData.paybackYear}{" "}
                              лет
                            </text>
                            <text
                              x={paybackX}
                              y={paybackY + 40}
                              fontSize="14"
                              fill="#000"
                              textAnchor="middle"
                            >
                              Окупаемость
                            </text>
                          </svg>
                        </div>

                        {/* Стоимость СНЭ */}
                        <div className="cp-payback-chart__cost">
                          <div className="cp-payback-chart__cost-amount">
                            {(totalCost / 1000000).toFixed(1)} млн. ₽
                          </div>
                          {/* <div className="cp-payback-chart__cost-label">
                            Стоимость СНЭ
                          </div> */}
                        </div>
                      </div>
                    </div>
                  );
                })()
              : null}
          </div>
        </div>
      </div>
      <div className="cp-block-details-footer">
        <p className="cp-block-details-footer__text">
          * В расчете утонченная индексация тарифов 7% в год и деградация
          панелей 0,5% в год
        </p>
      </div>
    </div>
  );
}

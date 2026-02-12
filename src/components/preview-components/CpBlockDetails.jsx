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
                    // Показываем все годы до 15 включительно
                    const rows = [];
                    const yearsUpTo15 = paybackData.yearly
                      .filter((y) => y.year <= 15)
                      .sort((a, b) => a.year - b.year);

                    yearsUpTo15.forEach((yearData) => {
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
                const graphHeight = 260; // от 40 до 300 (увеличено на 30%)

                // Позиция точки окупаемости по X (пропорционально сроку)
                const paybackX =
                  40 + (paybackYear / yearsHorizon) * graphWidth;
                const paybackY = 170; // середина по Y (40 + 260/2)

                // Координаты для кривой затрат (красная линия)
                const costCurveX1 =
                  40 + (paybackYear / yearsHorizon) * graphWidth * 0.5;
                const costCurveY1 = 300 - (300 - paybackY) * 0.5;

                // Координаты для кривой прибыли (зеленая линия)
                const profitCurveX1 = paybackX + (300 - paybackX) * 0.4;
                const profitCurveY1 = paybackY - (paybackY - 50) * 0.6;

                const currentYear = new Date().getFullYear();

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
                          viewBox="0 0 320 340"
                          className="cp-payback-chart__svg"
                          style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                        >
                          {/* Определение градиентов и фильтров */}
                          <defs>
                            {/* Градиент для зеленой области - более яркий */}
                            <linearGradient
                              id="profitGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{
                                  stopColor: "#00a04a",
                                  stopOpacity: 0.5,
                                }}
                              />
                              <stop
                                offset="100%"
                                style={{
                                  stopColor: "#00a04a",
                                  stopOpacity: 0.25,
                                }}
                              />
                            </linearGradient>

                            {/* Градиент для красной линии - более насыщенный */}
                            <linearGradient
                              id="costGradient"
                              x1="0%"
                              y1="100%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop
                                offset="0%"
                                style={{
                                  stopColor: "#d32f2f",
                                  stopOpacity: 1,
                                }}
                              />
                              <stop
                                offset="100%"
                                style={{
                                  stopColor: "#e74c3c",
                                  stopOpacity: 1,
                                }}
                              />
                            </linearGradient>

                            {/* Градиент для зеленой линии - более насыщенный */}
                            <linearGradient
                              id="savingsGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop
                                offset="0%"
                                style={{
                                  stopColor: "#008a3e",
                                  stopOpacity: 1,
                                }}
                              />
                              <stop
                                offset="100%"
                                style={{
                                  stopColor: "#00a04a",
                                  stopOpacity: 1,
                                }}
                              />
                            </linearGradient>

                            {/* Тень для линий - убираем для PDF */}
                            <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                              <feOffset dx="0" dy="1" result="offsetblur" />
                              <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                              </feComponentTransfer>
                              <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>

                            {/* Тень для точки - убираем для PDF */}
                            <filter id="dotShadow">
                              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                              <feOffset dx="0" dy="1" result="offsetblur" />
                              <feComponentTransfer>
                                <feFuncA type="linear" slope="0.4" />
                              </feComponentTransfer>
                              <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Фоновая сетка */}
                          <g opacity="0.25">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <line
                                key={`grid-h-${i}`}
                                x1="40"
                                y1={40 + (i * 260) / 4}
                                x2="300"
                                y2={40 + (i * 260) / 4}
                                stroke="#999"
                                strokeWidth="0.8"
                                strokeDasharray="2,2"
                              />
                            ))}
                          </g>

                          {/* Оси */}
                          <line
                            x1="40"
                            y1="40"
                            x2="40"
                            y2="300"
                            stroke="#222"
                            strokeWidth="2.5"
                          />
                          <line
                            x1="40"
                            y1="300"
                            x2="300"
                            y2="300"
                            stroke="#222"
                            strokeWidth="2.5"
                          />

                          {/* Метки на оси X */}
                          <text
                            x="40"
                            y="320"
                            fontSize="12"
                            fontWeight="600"
                            fill="#333"
                            textAnchor="middle"
                          >
                            {currentYear}
                          </text>
                          <text
                            x="300"
                            y="320"
                            fontSize="12"
                            fontWeight="600"
                            fill="#333"
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
                            strokeWidth="1.5"
                            strokeDasharray="6,3"
                            opacity="0.6"
                          />

                          {/* Зеленая область (прибыль после окупаемости) с градиентом */}
                          <path
                            d={`M ${paybackX} ${paybackY} Q ${profitCurveX1} ${profitCurveY1}, 300 50 L 300 300 L ${paybackX} 300 Z`}
                            fill="url(#profitGradient)"
                            stroke="none"
                            className="profit-area"
                          />

                          {/* Красная линия (затраты) без фильтра для PDF */}
                          <path
                            d={`M 40 300 Q ${costCurveX1} ${costCurveY1}, ${paybackX} ${paybackY}`}
                            fill="none"
                            stroke="url(#costGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            className="cost-line"
                          />

                          {/* Зеленая линия (накопленная экономия) без фильтра для PDF */}
                          <path
                            d={`M ${paybackX} ${paybackY} Q ${profitCurveX1} ${profitCurveY1}, 300 50`}
                            fill="none"
                            stroke="url(#savingsGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            className="savings-line"
                          />

                          {/* Точка окупаемости с внешним кольцом */}
                          <circle
                            cx={paybackX}
                            cy={paybackY}
                            r="11"
                            fill="none"
                            stroke="#00a04a"
                            strokeWidth="3"
                            opacity="0.4"
                          />
                          <circle
                            cx={paybackX}
                            cy={paybackY}
                            r="8"
                            fill="#00a04a"
                          />
                          <circle
                            cx={paybackX}
                            cy={paybackY}
                            r="3.5"
                            fill="#fff"
                          />

                          {/* Вертикальная линия от точки окупаемости */}
                          <line
                            x1={paybackX}
                            y1={paybackY}
                            x2={paybackX}
                            y2="300"
                            stroke="#00a04a"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            opacity="0.6"
                          />

                          {/* Белый фон под текстом */}
                          <rect
                            x={paybackX - 35}
                            y={paybackY + 12}
                            width="70"
                            height="38"
                            fill="white"
                            opacity="0.95"
                            rx="6"
                          />

                          {/* Метка окупаемости */}
                          <text
                            x={paybackX}
                            y={paybackY + 28}
                            fontSize="17"
                            fontWeight="700"
                            fill="#00a04a"
                            textAnchor="middle"
                          >
                            {paybackData.paybackYearExact
                              ? paybackData.paybackYearExact.toFixed(1)
                              : paybackData.paybackYear}{" "}
                            лет
                          </text>
                          <text
                            x={paybackX}
                            y={paybackY + 44}
                            fontSize="12"
                            fontWeight="500"
                            fill="#666"
                            textAnchor="middle"
                          >
                            Окупаемость
                          </text>

                          {/* Метки на графике - Затраты */}
                          <text
                            x="45"
                            y="290"
                            fontSize="11"
                            fontWeight="600"
                            fill="#e74c3c"
                          >
                            Затраты
                          </text>

                          {/* Метки на графике - Прибыль */}
                          <text
                            x="250"
                            y="60"
                            fontSize="11"
                            fontWeight="600"
                            fill="#00a04a"
                            textAnchor="end"
                          >
                            Экономия
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

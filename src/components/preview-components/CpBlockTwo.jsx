"use client";
import "./preview-components.css";

export default function CpBlockTwo({ priceKwh, totalCost, paybackData }) {
  const currentYear = new Date().getFullYear();

  console.log("paybackData", paybackData);

  // Форматирование числа с разделителями тысяч
  const formatCost = (cost) => {
    if (!cost) return "0";
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  // Расчет возврата НДС (22% от общей стоимости)
  const calculateVAT = (cost) => {
    if (!cost) return 0;
    return cost * 0.22;
  };

  // Расчет налога на прибыль (25% от общей стоимости)
  const calculateTax = (cost) => {
    if (!cost) return 0;
    return cost * 0.25;
  };

  // Расчет реальной стоимости проекта (общая стоимость - НДС - налог на прибыль)
  const calculateRealCost = (cost) => {
    if (!cost) return 0;
    const vat = calculateVAT(cost);
    const tax = calculateTax(cost);
    return cost - vat - tax;
  };

  // Расчет экономии за первый год
  const getSavingsYear1 = () => {
    if (!paybackData || !paybackData.params) {
      return 0;
    }
    const { annualGenerationYear1, tariffYear1 } = paybackData.params;
    // Экономия = годовая генерация (кВт·ч) × тариф (руб/кВт·ч)
    return annualGenerationYear1 * tariffYear1;
  };

  // Расчет ROI (Return on Investment) за 30 лет
  const getROI = () => {
    if (!paybackData || !paybackData.netProfit || !paybackData.systemCost) {
      return 0;
    }
    // ROI = (Чистая прибыль / Стоимость системы) × 100%
    const roi = (paybackData.netProfit / paybackData.systemCost) * 100;
    return Math.round(roi);
  };

  return (
    <div className="cp-block cp-block-two">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            РАСЧЕТНЫЕ ПОКАЗАТЕЛИ ПРОЕКТА
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
      <div className="cp-block-two-wrapper">
        <div className="cp-block-two__title">
          <h1 className="cp-block-two__h1">
            <span className="cp-block-two__h1-black">КЛЮЧЕВЫЕ </span>
            <span className="cp-block-two__h1-green">
              ФИНАНСОВЫЕ ПОКАЗАТЕЛИ
            </span>
          </h1>
        </div>

        <div className="cp-block-two__grid mt-4">
          <div className="cp-block-two__left">
            <div className="cp-fin-cost">
              <div className="cp-fin-cost__cap">Полная стоимость проекта</div>
              <div className="cp-fin-cost__value">
                {formatCost(totalCost)} ₽
              </div>
            </div>
            <div className="cp-fin-lines mt-3">
              <div className="cp-fin-line">
                <div className="cp-fin-line__label">Возврат НДС (22%)</div>
                <div className="cp-fin-line__box">
                  {formatCost(calculateVAT(totalCost))} ₽
                </div>
              </div>
              <div className="cp-fin-line">
                <div className="cp-fin-line__label">Налог на прибыль (25%)</div>
                <div className="cp-fin-line__box">
                  {formatCost(calculateTax(totalCost))} ₽
                </div>
              </div>
            </div>
          </div>

          <div className="cp-block-two__right">
            <div className="cp-fin-metrics">
              <div className="cp-fin-metric">
                <div className="cp-fin-metric__value cp-fin-metric__value--green">
                  {formatCost(getSavingsYear1())} ₽
                </div>
                <div className="cp-fin-metric__caption">
                  Экономия за 1-й год
                </div>
              </div>
              <div className="cp-fin-metric">
                <div className="cp-fin-metric__value">
                  {paybackData?.paybackYear || "—"} лет
                </div>
                <div className="cp-fin-metric__caption">Срок окупаемости</div>
              </div>
              <div className="cp-fin-metric">
                <div className="cp-fin-metric__value cp-fin-metric__value--green">
                  {getROI()} %
                </div>
                <div className="cp-fin-metric__caption">Доходность (ROI)</div>
              </div>
              <div className="cp-fin-metric">
                <div className="cp-fin-metric__value">30+ лет</div>
                <div className="cp-fin-metric__caption">Срок службы</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-two__photo mt-3">
          <div className="cp-block-two__realcost">
            <div className="cp-realcost">
              <div className="cp-realcost__label">
                Реальные инвестиции в бизнес
              </div>
              <div className="cp-realcost__accent"></div>
              <div className="cp-realcost__value">
                {formatCost(calculateRealCost(totalCost))} ₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import "./preview-components.css";

export default function CpBlockPrice({
  totalCost,
  servicesData,
  transportData,
  bomData,
  summary,
}) {
  const getValidDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  console.log("BOMDATA ", summary);

  const costWithoutVAT = totalCost ? (totalCost * 0.78).toFixed(2) : 0;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getDescriptionItems = () => {
    const items = [];

    // Добавляем все позиции из servicesData
    if (servicesData && Array.isArray(servicesData)) {
      const serviceItems = servicesData.map((item) => item.title);
      items.push(...serviceItems);
    }

    // Добавляем статический текст
    items.push("транспортные расходы");

    return items.join(", ");
  };

  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">СПЕЦИФИКАЦИЯ И ЦЕНА</span>
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

      <div className="cp-block-price-wrapper">
        <img src="/image/price-title.png" alt="Price" />

        <div className="cp-price-content mt-2">
          <div className="cp-price-description">
            <div className="cp-price-description__title">
              Солнечная электростанция "под ключ" в составе:
            </div>
            <div className="cp-price-description__text">
              {summary}, {getDescriptionItems()}
            </div>
          </div>
          <div className="cp-price-description__sum">
            {formatNumber(costWithoutVAT)} ₽
          </div>
        </div>

        <div className="cp-price-total">
          <div className="cp-price-total__label">
            Итого стоимость проекта (с НДС 22%):
          </div>
          <div className="cp-price-total__value">
            {formatNumber(totalCost)} ₽
          </div>
        </div>

        <div className="cp-price-warning">
          <span className="cp-price-warning__label">ВНИМАНИЕ:</span> Стоимость
          оборудования зафиксирована до {getValidDate()}. После этой даты
          возможен пересчет по курсу валют
        </div>
      </div>
    </div>
  );
}

"use client";
import "./preview-components.css";

export default function CpBlockEssg({ paybackData }) {
  const yearlyGeneration = paybackData?.yearly?.[0]?.yearlyGeneration || 0;
  const co2Tons = Math.round(yearlyGeneration * 0.0005);
  const treesCount = Math.round(yearlyGeneration * 0.025);

  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ESG И ЭКОЛОГИЯ</span>
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

      <div className="cp-block-essg-wrapper">
        <div className="cp-block-essg-title">
          <h2 className="cp-block-essg-title__h2">
            <span className="cp-block-essg-title__black">
              УСТОЙЧИВОЕ РАЗВИТИЕ{" "}
            </span>
            <span className="cp-block-essg-title__green">И ESG</span>
          </h2>
        </div>

        <div className="cp-block-essg-card">
          <div className="cp-block-essg-card__content">
            <div className="cp-block-essg-card__label">
              Снижение выбросов CO₂
            </div>
            <div className="cp-block-essg-card__value">{co2Tons} тонн/год</div>
          </div>
        </div>

        <div className="cp-block-essg-card-right">
          <div className="cp-block-essg-card__content">
            <div className="cp-block-essg-card__label">Сохранено леса</div>
            <div className="cp-block-essg-card__value">
              {treesCount} деревьев
            </div>
          </div>
        </div>

        <div className="cp-block-essg-bottom">
          <p className="cp-block-essg-bottom__text">
            Соблюдение "зеленых" стандартов повышает инвестиционную
            привлекательность компании и лояльность партнеров
          </p>
        </div>
      </div>
    </div>
  );
}

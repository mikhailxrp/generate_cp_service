"use client";
import "./preview-components.css";

export default function CpBlockHybrid() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            ГИБРИДНАЯ СОЛНЕЧНАЯ СТАНЦИЯ
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
      <div className="cp-block-six-title">
        <h2 className="cp-block-six-title__h2">
          <span className="cp-block-six-title__black">ПРИНЦИП РАБОТЫ </span>
          <span className="cp-block-six-title__green">ГИБРИДНОЙ СИСТЕМЫ</span>
        </h2>
      </div>
      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/quote-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Умное накопление:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Система заряжает аккумуляторы ночью (по дешевому тарифу) или
                  от излишков солнца днем
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/quote-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Пиковая экономия:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  В часы дорогих тарифов или перегрузок питание автоматически
                  переходит на аккумуляторы
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/quote-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Полная защита (UPS):
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  При аварии внешней сети предприятие мгновенно переходит на
                  резервное питание
                </p>
              </div>
            </div>
          </div>

          <div className="cp-block-six-inner-solution">
            <div className="cp-block-six-solution-card">
              <div className="cp-block-six-solution-card__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-solution-card__content">
                <h3 className="cp-block-six-solution-card__title">
                  <span className="cp-block-six-solution-card__title--green">
                    СНИЖЕНИЕ СТОИМОСТИ ЭНЕРГИИ
                  </span>{" "}
                  + ИБП
                </h3>
                <p className="cp-block-six-solution-card__text">
                  Защита от простоев и штрафов за превышение мощности
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/hydr-ses.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

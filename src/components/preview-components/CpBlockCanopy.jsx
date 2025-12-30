"use client";
import "./preview-components.css";

export default function CpBlockCanopy() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            КАРПОРТ/СОЛНЕЧНЫЙ НАВЕС
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
          <span className="cp-block-six-title__black">
            СОЛНЕЧНЫЙ НАВЕС ДЛЯ{" "}
          </span>
          <span className="cp-block-six-title__green">ПАРКОВКИ</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Электроэнергия и защита автомобилей от солнца, снега и града
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Двойной функционал:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Обеспечивает защиту транспорта от осадков и солнечного
                  излучения, вырабатывая электроэнергию
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Современный дизайн:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Эстетичная конструкция из окрашенной стали или алюминия,
                  повышающая статус объекта
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Опция для электрокаров:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Возможность простой интеграции зарядных станций для
                  электромобилей рядом с навесом
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/canopy.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

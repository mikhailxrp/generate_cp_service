"use client";
import "./preview-components.css";

export default function CpBlockEastWest() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            ПЛОСКАЯ КРОВЛЯ «ЗАПАД-ВОСТОК»
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
          <span className="cp-block-six-title__black">БАЛЛАСТНАЯ СИСТЕМА </span>
          <span className="cp-block-six-title__green">«ЗАПАД-ВОСТОК»</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Максимальная плотность размещения и сглаженный график генерации
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Без сверления кровли:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Конструкция удерживается собственным весом и балластом.
                  Гидроизоляция не нарушается
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Высокая плотность:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Позволяет разместить на 20-30% больше панелей на той же
                  площади (нет межрядных затенений)
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Аэродинамика:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Минимальная парусность, высочайшая устойчивость к ветровым
                  нагрузкам
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Ровная выработка:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  В сравнении с южной ориентацией, схема запад–восток
                  обеспечивает более ранний старт и более позднее окончание
                  генерации.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/east-west.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

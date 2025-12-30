"use client";
import "./preview-components.css";

export default function CpBlockSouth() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ПЛОСКАЯ КРОВЛЯ «ЮГ»</span>
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
          <span className="cp-block-six-title__green">«ЮГ»</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Классическое решение для максимальной пиковой выработки в полдень
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Оптимальный угол:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Панели установлены под углом 10-15° строго на юг для
                  максимальной годовой генерации
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Защита мембраны:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Используются специальные демпфирующие подложки под опорыдля
                  защиты кровли от трения
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Ветрозащита:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Конструкция оснащена дефлекторами для снижения ветровой
                  нагрузки
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Быстрый монтаж:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Высокая скорость сборки на больших площадях
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/south.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

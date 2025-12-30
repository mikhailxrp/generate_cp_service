"use client";
import "./preview-components.css";

export default function CpBlockCarpot() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            МЯГКАЯ КРОВЛЯ/БИТУМНАЯ/ГИБКАЯ
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
          <span className="cp-block-six-title__black">СИСТЕМА ДЛЯ </span>
          <span className="cp-block-six-title__green">МЯГКОЙ КРОВЛИ</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Герметичное крепление к силовому каркасу здания
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Силовое крепление:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Анкерные элементы проходят через слой утеплителя и фиксируются
                  непосредственно к стропильной системе.
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Двойная гидроизоляция:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Узел прохода герметизируется специализированными{" "}
                  <strong>EPDM-манжетами и битумной мастикой</strong>. Гарантия
                  от протечек
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Распределение нагрузки:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Система рассчитана на высокие снеговые нагрузки, не
                  продавливая мягкий утеплитель
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/carpot.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

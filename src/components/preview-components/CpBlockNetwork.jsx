"use client";
import "./preview-components.css";

export default function CpBlockNetwork() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            СЕТЕВАЯ СОЛНЕЧНАЯ СТАНЦИЯ
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
          <span className="cp-block-six-title__green">СЕТЕВОЙ СИСТЕМЫ</span>
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
                  Параллельная работа:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Станция работает синхронно с городской сетью
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/quote-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Приоритет солнца:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Вся выработанная энергия в первую очередь потребляется вашим
                  оборудованием
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/quote-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Автоматический добор:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  При нехватке солнца (ночь/тучи) энергия автоматически
                  добирается из сети
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
                  АКБ{" "}
                  <span className="cp-block-six-solution-card__title--green">
                    НЕ ТРЕБУЮТСЯ
                  </span>
                </h3>
                <p className="cp-block-six-solution-card__text">
                  Это снижает стоимость оборудования и ускоряет окупаемость
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/bg-right-network.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

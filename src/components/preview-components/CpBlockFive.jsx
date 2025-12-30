"use client";
import "./preview-components.css";

export default function CpBlockFive() {
  return (
    <div className="cp-block cp-block-five">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ЦИФРОВОЙ ДВОЙНИК</span>
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
      <div className="cp-block-five-title">
        <h2 className="cp-block-five-title__h2">
          ТОЧНОСТЬ РАСЧЕТА{" "}
          <span className="cp-block-five-title__percent">97%</span>
        </h2>
      </div>
      <div className="cp-block-five-wrapper mt-5">
        <div className="cp-block-five-inner-left">
          {/* Подзаголовок */}
          <p className="cp-block-five-subtitle mb-4">
            Мы создаем цифровой двойник вашего объекта перед началом работ
          </p>

          {/* Список фич */}
          <div className="cp-block-five-features">
            {/* Фича 1 */}
            <div className="cp-block-five-feature">
              <div className="cp-block-five-feature__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-five-feature__content">
                <div className="cp-block-five-feature__title">
                  Климатический архив (PVGIS):
                </div>
                <div className="cp-block-five-feature__text">
                  В основе расчётов — спутниковые метеорологические данные по
                  координатам объекта за 10 лет.
                </div>
              </div>
            </div>

            {/* Фича 2 */}
            <div className="cp-block-five-feature">
              <div className="cp-block-five-feature__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-five-feature__content">
                <div className="cp-block-five-feature__title">
                  Учет всех теней:
                </div>
                <div className="cp-block-five-feature__text">
                  3D-модель учитывает влияние вентиляции, труб и соседних зданий
                  на выработку.
                </div>
              </div>
            </div>

            {/* Фича 3 */}
            <div className="cp-block-five-feature">
              <div className="cp-block-five-feature__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-five-feature__content">
                <div className="cp-block-five-feature__title">
                  Почасовая симуляция:
                </div>
                <div className="cp-block-five-feature__text">
                  Мы моделируем работу станции для каждого часа в году, учитывая
                  углы падения солнца.
                </div>
              </div>
            </div>
          </div>

          {/* Карточка с цитатой */}
          <div className="cp-block-five-quote mt-5">
            <div className="cp-block-five-quote__icon">
              <img src="/image/quote-icon.svg" alt="" />
            </div>
            <div className="cp-block-five-quote__text">
              «Исключаем риск ошибок на этапе проектирования. Вы получаете ровно
              столько же энергии, сколько мы обещали»
            </div>
          </div>
        </div>
        <div className="cp-block-five-inner-rigth">
          <img
            src="/image/gr-image.png"
            alt="3D визуализация объекта"
            className="cp-block-five-inner-rigth__image"
          />
        </div>
      </div>
    </div>
  );
}

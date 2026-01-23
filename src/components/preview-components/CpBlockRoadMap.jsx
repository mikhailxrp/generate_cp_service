"use client";
import "./preview-components.css";

export default function CpBlockRoadMap() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header mb-0">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ДОРОЖНАЯ КАРТА</span>
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
      <div className="cp-block-roadmap-wrapper">
        <div className="cp-block-roadmap-header-top">
          <h2 className="cp-block-roadmap__title">
            <span className="cp-block-roadmap__title--green">ПЛАН РЕАЛИЗАЦИИ</span>{" "} <br />
            ПРОЕКТА
          </h2>
        </div>

        <div className="cp-block-roadmap-content-inner">
          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">1</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Неделя 1</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-1.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Технический аудит и замеры
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>

          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">2</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Неделя 2</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-2.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Проектирование и согласование схемы
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>

          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">3-5</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Неделя 3-5</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-3.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Логистика и комплектация оборудования
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>

          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">6</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Неделя 6</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-4.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Монтажные работы
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>

          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">7</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Неделя 7</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-5.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Пусконаладка и настройка ПО
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>

          <div className="cp-roadmap-card">
            <div className="cp-roadmap-card__header">
              <span className="cp-roadmap-card__number">8</span>
            </div>
            <div className="cp-roadmap-card__body">
              <h3 className="cp-roadmap-card__title">Финал</h3>
              <div className="cp-roadmap-card__icon">
                <img src="/image/icon-6.png" alt="" />
              </div>
              <p className="cp-roadmap-card__description">
                Сдача объекта, обучение, передача доступов
              </p>
            </div>
            <div className="cp-roadmap-card__progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

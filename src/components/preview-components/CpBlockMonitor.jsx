"use client";
import "./preview-components.css";

export default function CpBlockMonitor() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">МОНИТОРИНГ</span>
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
          <span className="cp-block-six-title__green">ПОЛНЫЙ КОНТРОЛЬ </span>{" "}
          <br />
          <span className="cp-block-six-title__black">В ВАШЕМ УСТРОЙСТВЕ</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-4">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Облачная платформа мониторинга 24/7
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/phone-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  В реальном времени:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Данные обновляются каждые 5 минут. Вы видите текущую
                  выработку, потребление объекта и заряд аккумуляторов из любой
                  точки мира
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/forty-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Аналитика в кВт⋅ч:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Анализируйте реальный КПД станции и планируйте возврат
                  инвестиций на основе чистых цифр.
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/noti-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Журнал событий:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Все системные сообщения и ошибки фиксируются в облаке. Вы
                  всегда сможете проверить статус сети и работу оборудования в
                  истории событий.
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/document-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">Отчетность:</h3>
                <p className="cp-block-six-bullet-item__text">
                  Выгрузка детальных отчетов (Excel/PDF) для бухгалтерии и
                  энергоаудита
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right monitor-block">
          <img
            src="/image/bg-monitor.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

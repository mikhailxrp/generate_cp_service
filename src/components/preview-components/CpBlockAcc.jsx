"use client";
import "./preview-components.css";

export default function CpBlockAcc() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            СИСТЕМА НАКОПЛЕНИЯ ЭЛЕКТРИЧЕСКОЙ ЭНЕРГИИ
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
          <span className="cp-block-six-title__black">ПРОМЫШЛЕННЫЙ </span>
          <span className="cp-block-six-title__green">НАКОПИТЕЛЬ</span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Технология LiFePO4: ресурс 15 лет и пожаробезопасность
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/acc-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Литий-железо-фосфатные АКБ:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Самый безопасный тип ячеек. Не горит и не взрывается при
                  повреждении (в отличие от Li-Ion NMC)
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/cycle_icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Ресурс 6000+ циклов:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Аккумуляторная система рассчитана на более чем 6000 циклов
                  заряда-разряда при штатных режимах эксплуатации
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/temp-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Система климат-контроля:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Встроенный климат-контроль поддерживает оптимальную
                  температуру ячеек зимой и летом, продлевая срок службы
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/module-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Модульность:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Архитектура позволяет масштабировать емкость от{" "}
                  <strong>50 кВтч до нескольких МВтч</strong> простым
                  добавлением стоек (Racks)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/module-storage.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

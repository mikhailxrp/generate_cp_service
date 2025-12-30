"use client";
import "./preview-components.css";

export default function CpBlockMikroGen() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">МИКРОГЕНЕРАЦИЯ</span>
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
          <span className="cp-block-six-title__green">
            ВАШ ОБЪЕКТ ЗАРАБАТЫВАЕТ,{" "}
          </span>{" "}
          <br />
          <span className="cp-block-six-title__black">
            КОГДА ВЫ НЕ ПОТРЕБЛЯЕТЕ
          </span>
        </h2>
      </div>

      <div className="cp-block-six-wrapper mt-5">
        <div className="cp-block-six-inner-left">
          <p className="cp-block-five-subtitle mb-4">
            Официальное подключение по Федеральному закону №471-ФЗ
          </p>
          <div className="cp-block-six-inner-bullet">
            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Закон о микрогенерации:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Любое физическое или юридическое лицо имеет право продавать
                  излишки солнечной энергии в общую сеть
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Когда это работает:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  В выходные дни, праздники или в солнечный летний полдень,
                  когда выработка станции превышает потребление вашего объекта
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Монетизация:
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Сбытовая компания обязана выкупить у вас эти излишки. Деньги
                  поступают на ваш счет или идут в зачет будущих платежей
                </p>
              </div>
            </div>

            <div className="cp-block-six-bullet-item">
              <div className="cp-block-six-bullet-item__icon">
                <img src="/image/check-icon.svg" alt="" />
              </div>
              <div className="cp-block-six-bullet-item__content">
                <h3 className="cp-block-six-bullet-item__title">
                  Никаких налогов (для физлиц):
                </h3>
                <p className="cp-block-six-bullet-item__text">
                  Доход от продажи солнечной энергии не облагается НДФЛ (до 2029
                  года)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cp-block-six-inner-right">
          <img
            src="/image/microgen-img.png"
            alt="Схема работы сетевой системы"
            className="cp-block-six-inner-right__image"
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import "./preview-components.css";

export default function CpBlockGuarantees() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ГАРАНТИИ</span>
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

      <div className="cp-block-guarantees-wrapper">
        <h2 className="cp-block-guarantees-title__h2">
          <span className="cp-block-guarantees-title__black">
            ФИНАНСОВАЯ{" "}
          </span>
          <span className="cp-block-guarantees-title__green">ГАРАНТИЯ РЕЗУЛЬТАТА</span>
        </h2>
        <div className="cp-block-guarantees-inner-top row">
          <div className="col-4 col-guarantees-content mt-4">
            <div className="col-guarantees-content-icon">
              <img src="/image/check-icon.svg" alt="" />
            </div>
            <div>
              <h6 className="col-guarantees-content-title">
                Мы гарантируем выработку:
              </h6>
              <p className="col-guarantees-content-text">
                Если фактическая генерация за год окажется ниже расчётной более чем на 10% по нашей вине, мы компенсируем разницу по заранее согласованной фор-муле в договоре
              </p>
            </div>
          </div>
          <div className="col-8 col-guarantees-img">
            <div className="guarantees-img-wrapper">
              <img src="/image/guarantees-top-bg.png" alt="" />
            </div>
          </div>
        </div>

        <div className="cp-block-guarantees-inner-bottom mt-5 row">
          <div className="col-4 guarantees-inner-bottom-bullits">
            <div className="guarantees-inner-bottom-bullits-icon">
              <img src="/image/target-icon.svg" alt="" />
            </div>
            <div>
              <h6 className="guarantees-bottom-title">Условия:</h6>
              <div className="guarantees-bottom-list">
                <div className="guarantees-bottom-item">
                  <p className="guarantees-bottom-item-text">
                    Станция обслуживается по регламенту
                  </p>
                </div>
                <div className="guarantees-bottom-item">
                  <p className="guarantees-bottom-item-text">
                    Доступ к оборудованию и мониторингу не ограничивается
                  </p>
                </div>
                <div className="guarantees-bottom-item">
                  <p className="guarantees-bottom-item-text">
                    Режим работы объекта не ограничивает СЭС
                  </p>
                </div>
              </div>
            </div>

            <div className="guarantees-inner-el">
              <img src="/image/guarantie-el.png" alt="" />
            </div>
          </div>

          <div className="col-8">
            <div className="guarantees-bottom-card-inner">
              <div className="guarantees-card">
                <div className="guarantees-card-corner"></div>
                <div className="guarantees-card-content-img">
                  <img src="/image/panel.png" alt="" />
                </div>
                <div className="guarantees-card-content">
                  <p className="guarantees-card-text">
                    Эффективность панелей.
                  </p>
                  <h3 className="guarantees-card-years">25 лет</h3>
                </div>
              </div>

              <div className="guarantees-card">
                <div className="guarantees-card-corner"></div>
                <div className="guarantees-card-content-img">
                  <img src="/image/konstr.png" alt="" />
                </div>
                <div className="guarantees-card-content">
                  <p className="guarantees-card-text">
                    Опорные конструкции
                  </p>
                  <h3 className="guarantees-card-years">25 лет</h3>
                </div>
              </div>

              <div className="guarantees-card">
                <div className="guarantees-card-corner"></div>
                <div className="guarantees-card-content-img">
                  <img src="/image/guarantie-icon-3.png" alt="" />
                </div>
                <div className="guarantees-card-content">
                  <p className="guarantees-card-text">
                    Инверторы: <strong>Deye</strong>
                  </p>
                  <h3 className="guarantees-card-years">5-10 лет</h3>
                </div>
              </div>

              <div className="guarantees-card">
                <div className="guarantees-card-corner"></div>
                <div className="guarantees-card-content-img mb-2">
                  <img src="/image/guarantie-icon-4.png" alt="" />
                </div>
                <div className="guarantees-card-content">
                  <p className="guarantees-card-text">
                    Монтажные работы:
                  </p>
                  <h3 className="guarantees-card-years">2 года</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

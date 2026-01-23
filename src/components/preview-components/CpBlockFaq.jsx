"use client";
import "./preview-components.css";

export default function CpBlockFaq() {
  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">FAQ/ВОПРОСЫ</span>
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

      <div className="cp-block-faq-wrapper">
        <h2 className="cp-block-guarantees-title__h2">
          <span className="cp-block-guarantees-title__black">
            ЧАСТО ЗАДАВАЕМЫЕ{" "}
          </span>
          <span className="cp-block-guarantees-title__green">ВОПРОСЫ</span>
        </h2>

        <div className="cp-block-faq-content-inner mt-5">
          <div className="cp-faq-card">
            <div className="cp-faq-card__question">
              <span className="cp-faq-card__label">Вопрос:</span>
              <p className="cp-faq-card__question-text">
                <strong>А если пойдет град?</strong>
              </p>
            </div>
            <div className="cp-faq-card__answer">
              <span className="cp-faq-card__label">Ответ:</span>
              <p className="cp-faq-card__answer-text">
                Панели покрыты закаленным стеклом 3,2 мм и выдерживают удары
                ледяного шара диаметром 35 мм на скорости 100 км/ч. Это
                прочнее, чем лобовое стекло авто
              </p>
            </div>
          </div>

          <div className="cp-faq-card">
            <div className="cp-faq-card__question">
              <span className="cp-faq-card__label">Вопрос:</span>
              <p className="cp-faq-card__question-text">
                <strong>Нужно ли мыть панели?</strong>
              </p>
            </div>
            <div className="cp-faq-card__answer">
              <span className="cp-faq-card__label">Ответ:</span>
              <p className="cp-faq-card__answer-text">
                В обычных условиях дождь смывает основную пыль
              </p>
            </div>
          </div>

          <div className="cp-faq-card">
            <div className="cp-faq-card__question">
              <span className="cp-faq-card__label">Вопрос:</span>
              <p className="cp-faq-card__question-text">
                <strong>Что происходит зимой?</strong>
              </p>
            </div>
            <div className="cp-faq-card__answer">
              <span className="cp-faq-card__label">Ответ:</span>
              <p className="cp-faq-card__answer-text">
                Станция продолжает работать, но выработка снижается. Годовой
                баланс достигается за счет весны и лета
              </p>
            </div>
          </div>
        </div>

        <div className="cp-block-faq-bottom-bg mt-5">
          <img src="/image/faq-bottom-bg.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}

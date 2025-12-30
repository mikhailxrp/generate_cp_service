"use client";
import "./preview-components.css";

export default function CpBlockPayback({ paybackData }) {
  const currentYear = new Date().getFullYear();

  console.log("paybackData", paybackData);

  // Расчет трех сценариев на основе базового paybackData
  const calculateScenarios = () => {
    if (!paybackData || !paybackData.paybackYearExact) {
      return {
        pessimistic: null,
        realistic: null,
        optimistic: null,
        roiPessimistic: null,
        roiRealistic: null,
        roiOptimistic: null,
      };
    }

    // Реалистичный сценарий - базовые данные
    const realistic = Math.round(paybackData.paybackYearExact * 10) / 10;

    // Пессимистичный - увеличиваем срок окупаемости на ~30-40%
    const pessimistic = Math.round(realistic * 1.35 * 10) / 10;

    // Оптимистичный - уменьшаем срок окупаемости на ~20-25%
    const optimistic = Math.round(realistic * 0.75 * 10) / 10;

    // ROI расчет (за 25 лет)
    const systemCost = paybackData.systemCost || 0;
    const totalSavings = paybackData.totalSavings || 0;

    // Реалистичный ROI
    const roiRealistic =
      systemCost > 0
        ? Math.round(((totalSavings - systemCost) / systemCost) * 100)
        : 0;

    // Пессимистичный ROI (снижаем на ~25-30%)
    const roiPessimistic = Math.round(roiRealistic * 0.7);

    // Оптимистичный ROI (увеличиваем на ~20-25%)
    const roiOptimistic = Math.round(roiRealistic * 1.25);

    return {
      pessimistic,
      realistic,
      optimistic,
      roiPessimistic,
      roiRealistic,
      roiOptimistic,
    };
  };

  const scenarios = calculateScenarios();

  return (
    <div className="cp-block cp-block-two">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">ФИНАНСОВЫЕ СЦЕНАРИИ</span>
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
      <div className="cp-block-payback-wrapper">
        <h2 className="cp-block-payback__title">
          ТРИ СЦЕНАРИЯ{" "}
          <span className="cp-block-payback__title--green">ОКУПАЕМОСТИ</span>
        </h2>
        <table className="cp-payback-table">
          <thead>
            <tr>
              <th className="cp-payback-table__header cp-payback-table__header--param">
                Параметр
              </th>
              <th className="cp-payback-table__header cp-payback-table__header--pessimistic">
                ☁️ Пессимистичный
              </th>
              <th className="cp-payback-table__header cp-payback-table__header--realistic">
                ⛅ Климатическая норма
              </th>
              <th className="cp-payback-table__header cp-payback-table__header--optimistic">
                ☀️ Оптимистичный
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cp-payback-table__cell cp-payback-table__cell--param">
                Погодные условия
              </td>
              <td className="cp-payback-table__cell">
                Пасмурный год (-10% от нормы)
              </td>
              <td className="cp-payback-table__cell cp-payback-table__cell--realistic">
                Климатическая норма
              </td>
              <td className="cp-payback-table__cell">
                Солнечный год (+10% к норме)
              </td>
            </tr>
            <tr>
              <td className="cp-payback-table__cell cp-payback-table__cell--param">
                Рост тарифа на ЭЭ
              </td>
              <td className="cp-payback-table__cell">5% (Ниже инфляции)</td>
              <td className="cp-payback-table__cell cp-payback-table__cell--realistic">
                7-8% (Прогноз)
              </td>
              <td className="cp-payback-table__cell">
                10-12% (Рыночный тренд)
              </td>
            </tr>
            <tr>
              <td className="cp-payback-table__cell cp-payback-table__cell--param">
                Потребление объекта
              </td>
              <td className="cp-payback-table__cell">Снижение на 20%</td>
              <td className="cp-payback-table__cell cp-payback-table__cell--realistic">
                Стабильное (100%)
              </td>
              <td className="cp-payback-table__cell">Рост производства</td>
            </tr>
            <tr>
              <td className="cp-payback-table__cell cp-payback-table__cell--param">
                Срок окупаемости
              </td>
              <td className="cp-payback-table__cell">
                {scenarios.pessimistic || "—"} лет
              </td>
              <td className="cp-payback-table__cell cp-payback-table__cell--realistic">
                {scenarios.realistic || "—"} лет
              </td>
              <td className="cp-payback-table__cell">
                {scenarios.optimistic || "—"} лет
              </td>
            </tr>
            <tr>
              <td className="cp-payback-table__cell cp-payback-table__cell--param">
                ROI (За 25 лет)
              </td>
              <td className="cp-payback-table__cell">
                {scenarios.roiPessimistic || "—"} %
              </td>
              <td className="cp-payback-table__cell cp-payback-table__cell--realistic">
                {scenarios.roiRealistic || "—"} %
              </td>
              <td className="cp-payback-table__cell">
                {scenarios.roiOptimistic || "—"} %
              </td>
            </tr>
          </tbody>
        </table>

        <div className="cp-payback-scenarios">
          <div className="cp-payback-scenario">
            <div className="cp-payback-scenario__icon">☁️</div>
            <div className="cp-payback-scenario__content">
              <h3 className="cp-payback-scenario__title">Пессимистичный</h3>
              <p className="cp-payback-scenario__description">
                Даже если тарифы почти перестанут расти, а год будет
                экстремально пасмурным, станция окупится за{" "}
                {scenarios.pessimistic || "{{Payback_Pess}}"} лет и сохранит
                вашу инвестиция лучше депозита
              </p>
            </div>
          </div>

          <div className="cp-payback-scenario cp-payback-scenario--realistic">
            <div className="cp-payback-scenario__icon">⛅</div>
            <div className="cp-payback-scenario__content">
              <h3 className="cp-payback-scenario__title">Реалистичный</h3>
              <p className="cp-payback-scenario__description">
                Сценарий, основанный на статистике погоды за 10 лет и текущей
                динамике цен на электроэнергию. Окупаемость:{" "}
                {scenarios.realistic || "{{Payback_Real}}"} года
              </p>
            </div>
          </div>

          <div className="cp-payback-scenario">
            <div className="cp-payback-scenario__icon">☀️</div>
            <div className="cp-payback-scenario__content">
              <h3 className="cp-payback-scenario__title">Оптимистичный</h3>
              <p className="cp-payback-scenario__description">
                При сохранении текущих темпов роста тарифов (10%+ в год)
                инвестиции окупятся быстрее и вернутся уже через{" "}
                {scenarios.optimistic || "{{Payback_Opt}}"} лет
              </p>
            </div>
          </div>
        </div>

        <div className="cp-payback-timeline">
          <div className="cp-payback-timeline__header">
            <span className="cp-payback-timeline__label">
              Срок службы станции 25 лет
            </span>
          </div>
          <div className="cp-payback-timeline__track">
            <div className="cp-payback-timeline__bar">
              <div
                className="cp-payback-timeline__marker cp-payback-timeline__marker--optimistic"
                style={{
                  left: `${((scenarios.optimistic || 0) / 25) * 100}%`,
                }}
              >
                <div className="cp-payback-timeline__marker-label">
                  {scenarios.optimistic || "{{Payback_Opt}}"} лет
                </div>
                <div className="cp-payback-timeline__marker-dot"></div>
              </div>
              <div
                className="cp-payback-timeline__marker cp-payback-timeline__marker--realistic"
                style={{
                  left: `${((scenarios.realistic || 0) / 25) * 100}%`,
                }}
              >
                <div className="cp-payback-timeline__marker-label">
                  {scenarios.realistic || "{{Payback_Real}}"} лет
                </div>
                <div className="cp-payback-timeline__marker-dot"></div>
              </div>
              <div
                className="cp-payback-timeline__marker cp-payback-timeline__marker--pessimistic"
                style={{
                  left: `${((scenarios.pessimistic || 0) / 25) * 100}%`,
                }}
              >
                <div className="cp-payback-timeline__marker-label">
                  {scenarios.pessimistic || "{{Payback_Pess}}"} лет
                </div>
                <div className="cp-payback-timeline__marker-dot"></div>
              </div>
            </div>
            <div className="cp-payback-timeline__scale">
              <span className="cp-payback-timeline__scale-item">0</span>
              <span className="cp-payback-timeline__scale-item">5</span>
              <span className="cp-payback-timeline__scale-item">10</span>
              <span className="cp-payback-timeline__scale-item">15</span>
              <span className="cp-payback-timeline__scale-item">20</span>
              <span className="cp-payback-timeline__scale-item">25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

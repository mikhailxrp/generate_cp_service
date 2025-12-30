"use client";
import "./preview-components.css";

export default function CpBlockFour({ paybackData, priceKwh }) {
  console.log(paybackData);

  // Расчет экономии за первый год
  const getSavingsYear1 = () => {
    if (!paybackData || !paybackData.params) {
      return 0;
    }
    const { annualGenerationYear1, tariffYear1 } = paybackData.params;
    // Экономия = годовая генерация (кВт·ч) × тариф (руб/кВт·ч)
    return annualGenerationYear1 * tariffYear1;
  };

  // Форматирование числа с разделителями разрядов
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Расчет потерь за 10 лет
  const getLoss10y = () => {
    const net1 = getSavingsYear1();
    return formatNumber((net1 * 13.82).toFixed(0));
  };

  // Расчет потерь за 25 лет
  const getTotalSavings25y = () => {
    const net1 = getSavingsYear1();
    return formatNumber((net1 * 63.25).toFixed(0));
  };

  return (
    <div className="cp-block cp-block-one">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            ПОТЕРИ БЕЗ ИЗМЕНЕНИЙ
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
      <div className="cp-block-four-wrapper">
        {/* Заголовок */}
        <div className="cp-loss-title mt-5">
          <h1 className="cp-loss-title__h1">
            <span className="cp-loss-title__green">СКОЛЬКО ВЫ ТЕРЯЕТЕ</span>,
            ЕСЛИ НИЧЕГО НЕ МЕНЯТЬ?
          </h1>
        </div>

        {/* Основной контент: две колонки */}
        <div className="cp-loss-main mt-5">
          {/* Левая колонка */}
          <div className="cp-loss-left">
            <div className="cp-loss-left-inner">
              {/* Рост тарифов */}
              <div className="cp-loss-item">
                <div className="cp-loss-item__title">Рост тарифов</div>
                <div className="cp-loss-item__text">
                  Ежегодная индексация тарифов на электроэнергию составляет{" "}
                  <b className="cp-loss-item__accent">7–10%</b>
                </div>
              </div>

              {/* Удвоение расходов */}
              <div className="cp-loss-item mb-4">
                <div className="cp-loss-item__title">Удвоение расходов</div>
                <div className="cp-loss-item__text">
                  При текущей динамике, стоимость 1 кВт⋅ч для вас удвоится уже
                  через <b className="cp-loss-item__accent">7–8 лет</b>
                </div>
              </div>

              <div className="cp-loss-item-el-inner">
                <div className="cp-loss-item-el-top">
                  <img
                    src="/image/el-top.png"
                    alt=""
                    className="cp-loss-item-el-top__image"
                  />
                </div>
                <div className="cp-loss-item-el-bottom">
                  <img
                    src="/image/el-bottom.png"
                    alt=""
                    className="cp-loss-item-el-bottom__image"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="cp-loss-right">
            {/* Подпись: Потери за 10 лет */}
            <div className="cp-loss-10y">
              <div className="cp-loss-10y__box">
                <div className="cp-loss-10y__text">
                  Потери за 10 лет:
                  <br />~ {getLoss10y()} ₽
                </div>
              </div>
            </div>

            {/* Подпись: Потери за 25 лет */}
            <div className="cp-loss-25y">
              <div className="cp-loss-25y__value">
                ~ {getTotalSavings25y()} ₽
              </div>
              <div className="cp-loss-25y__caption">ПОТЕРИ ЗА 25 ЛЕТ</div>
            </div>
          </div>
          {/* Решение */}
          <div className="cp-loss-solution">
            <div className="cp-loss-solution__content">
              <div className="cp-loss-solution__title">Решение</div>
              <div className="cp-loss-solution__text">
                Солнечная станция <b>фиксирует стоимость</b> энергии на уровне
                сегодняшнего дня{" "}
                <b className="cp-loss-solution__accent">на 25 лет вперед</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

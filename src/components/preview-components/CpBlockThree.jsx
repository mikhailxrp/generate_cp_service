"use client";
import "./preview-components.css";

export default function CpBlockThree({
  sesPower,
  typeArea,
  bomData,
  combinedData,
  totalAnnualGeneration,
  solarAngle,
}) {
  const typeAreaMap = {
    flat_south: "Крышная",
    flat_east_west: "Крышная",
    "flat_east-west": "Крышная",
    metal: "Крышная",
    classic_tiles: "Крышная",
    slate: "Крышная",
    carpot_south: "Крышная",
    carpot_east_west: "Крышная",
    "carpot_east-west": "Крышная",
    canopy: "Крышная",
    other: "Крышная",
    ground: "Наземная",
    facade: "Фасадная",
  };

  const getTypeAreaText = () => {
    if (!typeArea) return "";
    return (
      typeAreaMap[typeArea] || typeAreaMap[typeArea.toLowerCase()] || typeArea
    );
  };

  const getPanelCount = () => {
    if (!bomData || !Array.isArray(bomData)) return 0;
    const panel = bomData.find((item) => item.role === "panel");
    return panel ? panel.qty : 0;
  };

  const getTotalPanelArea = () => {
    if (!bomData || !Array.isArray(bomData)) return 0;
    const panel = bomData.find((item) => item.role === "panel");
    if (!panel || !panel.dimensions || !panel.qty) return 0;

    // Парсим размеры формата "2382х1134х30" (мм)
    const dimensionsMatch = panel.dimensions.match(/(\d+)х(\d+)/i);
    if (!dimensionsMatch) return 0;

    const width = parseInt(dimensionsMatch[1]);
    const height = parseInt(dimensionsMatch[2]);

    // Площадь одной панели в кв.м (переводим из мм² в м²)
    const areaOnePanel = (width * height) / 1000000;

    // Общая площадь всех панелей
    const totalArea = areaOnePanel * panel.qty;

    // Форматируем с пробелами как разделитель тысяч
    return Math.round(totalArea).toLocaleString("ru-RU");
  };

  const getPanelPower = () => {
    if (!bomData || !Array.isArray(bomData)) return "590";
    const panel = bomData.find((item) => item.role === "panel");
    if (!panel || !panel.title) return "590";

    // Ищем цифру перед "Вт" в названии
    const powerMatch = panel.title.match(/(\d+)\s*Вт/i);
    if (!powerMatch) return "590";

    return powerMatch[1];
  };

  const getPanelVoltage = () => {
    if (!bomData || !Array.isArray(bomData)) return "0,4";
    const panel = bomData.find((item) => item.role === "panel");
    if (!panel || !panel.panelVocV) return "0,4";

    // Переводим Вольты в киловольты
    const voltageKv = (parseFloat(panel.panelVocV) / 1000).toFixed(1);

    // Заменяем точку на запятую для русского формата
    return voltageKv.replace(".", ",");
  };

  const getSpecificGeneration = () => {
    if (!totalAnnualGeneration || !sesPower) return "1250";

    const power = parseFloat(sesPower);
    const annualGen = parseFloat(totalAnnualGeneration);

    if (power === 0 || isNaN(power) || isNaN(annualGen)) return "1250";

    // Переводим МВт*ч в кВт*ч и делим на мощность
    const specificGen = (annualGen * 1000) / power;

    return Math.round(specificGen).toLocaleString("ru-RU");
  };

  const getMonthlyData = () => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    if (
      !combinedData ||
      !Array.isArray(combinedData) ||
      combinedData.length === 0
    ) {
      return months.map((month) => ({ month, value: 0 }));
    }

    return months.map((month, index) => {
      const monthData = combinedData[index];
      const value = monthData?.E_m || 0;
      return { month, value: Math.round(value) };
    });
  };

  const renderChart = () => {
    const data = getMonthlyData();
    const maxValue = Math.max(...data.map((d) => d.value));

    if (maxValue === 0) return null;

    // Максимальная высота столбца в пикселях (из высоты контейнера минус место для значений и подписей)
    const maxHeight = 260;

    return data.map((item, index) => {
      const heightPx = (item.value / maxValue) * maxHeight;
      const formattedValue = item.value.toLocaleString("ru-RU");

      return (
        <div key={index} className="cp-chart-bar">
          <div className="cp-chart-bar__value">{formattedValue}</div>
          <div
            className="cp-chart-bar__column"
            style={{ height: `${heightPx}px` }}
          ></div>
          <div className="cp-chart-bar__label">{item.month}</div>
        </div>
      );
    });
  };

  return (
    <div className="cp-block cp-block-two">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">
            МЕТРИКА И ТЕХНИЧЕСКИЕ ПАРАМЕТРЫ
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
      <div className="cp-block-three-wrapper">
        <h2 className="cp-block-two__title">
          Пример выработки СЭС {parseInt(sesPower)} кВт
        </h2>

        <div className="cp-block-three-inner mt-4">
          <div className="cp-block-three-inner-left">
            <div className="cp-block-three-inner-left-top">
              <div className="cp-metrics">
                <div className="cp-metric-card cp-metric-card--left">
                  <div className="cp-metric-card__title">
                    Годовая выработка
                    {"\n"}электроэнергии СЭС {parseInt(sesPower)} кВт
                  </div>
                  <div className="cp-metric-card__value">
                    {totalAnnualGeneration} МВт*ч
                  </div>
                </div>
                <div className="cp-metric-card cp-metric-card--right">
                  <div className="cp-metric-card__title">
                    Экономия электроэнергии
                    {"\n"}на объекте до
                  </div>
                  <div className="cp-metric-card__value">95%</div>
                </div>
              </div>
            </div>
            <div className="cp-block-three-inner-left-bottom">
              <div className="cp-chart">
                <div className="cp-chart__title">кВт*ч в месяц</div>
                <div className="cp-chart__plot">{renderChart()}</div>
                <div className="cp-chart__axis"></div>
                <div className="cp-chart__note">
                  Выработка СЭС разная от месяца к месяцу и зависит от
                  количества солнечных дней
                </div>
              </div>
            </div>
          </div>
          <div className="cp-params-card">
            <div className="cp-params-card__title">
              Технические параметры СЭС
            </div>
            <div className="cp-params-card__caption">
              Параметры электроустановки
            </div>
            <div className="cp-params-card__rows">
              <div className="cp-params-row cp-params-row--highlight">
                <div className="cp-params-row__label">
                  Установленная мощность СЭС
                </div>
                <div className="cp-params-row__value">
                  {parseInt(sesPower)} кВт
                </div>
              </div>
              <div className="cp-params-row cp-params-row--highlight">
                <div className="cp-params-row__label">Количество ФЭМ</div>
                <div className="cp-params-row__value">{getPanelCount()} шт</div>
              </div>
              <div className="cp-params-row cp-params-row--highlight">
                <div className="cp-params-row__label">
                  Требуемая площадь под ФЭМ
                </div>
                <div className="cp-params-row__value">
                  ~ {getTotalPanelArea()} кв. м
                </div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">
                  Тип опорной конструкции
                </div>
                <div className="cp-params-row__value">{getTypeAreaText()}</div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">Угол наклона</div>
                <div className="cp-params-row__value">
                  {Math.round(solarAngle)}°
                </div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">Тип ФЭМ</div>
                <div className="cp-params-row__value">
                  Монокристал, {getPanelPower()} Вт
                </div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">Уровень напряжения</div>
                <div className="cp-params-row__value">
                  {getPanelVoltage()} кВ, 50 Гц
                </div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">
                  Годовая выработка электроэнергии СЭС
                </div>
                <div className="cp-params-row__value">
                  ~ {totalAnnualGeneration} МВт*ч / год
                </div>
              </div>
              <div className="cp-params-row">
                <div className="cp-params-row__label">
                  Удельная выработка СЭС
                </div>
                <div className="cp-params-row__value">
                  ~ {getSpecificGeneration()} кВт*ч / кВт / год
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const fmtMoney = (v) =>
  v == null ? "" : new Intl.NumberFormat("ru-RU").format(Number(v)) + " ₽";

export const safe = (v, fallback = "—") =>
  v === null || v === undefined || v === "" ? fallback : v;

export const titleByType = (type) =>
  ({
    panel: "Солнечные панели",
    inverter: "Инверторы",
    ess: "ESS (накопители/системы)",
    mount: "Крепёж и BoS",
    batt: "Батареи",
    cable: "Кабели",
    connector: "Коннекторы",
    pow_off: "Выключатели",
    fuse: "Предохранители",
    uzip: "Узип",
    panel_ac: "Распред. Щиты",
    lotki: "Лотки",
    mount: "Крепеж",
    cpo90: "Лотки CPO90",
    smartmeter: "Счётчики",
    ct: "Трансформаторы",
  }[type] || type);

export const formatYears = (years) => {
  if (!years) return "-";

  const num = Math.floor(years);
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${num} лет`;
  }

  if (lastDigit === 1) {
    return `${num} год`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${num} года`;
  }

  return `${num} лет`;
};

export const getServiceTypeLabel = (serviceType) => {
  const labels = {
    installation: "Монтаж",
    commissioning: "ПНР",
    service: "Сервис",
    consultation: "Консультация",
    design: "Проектирование",
    other: "Другое",
  };

  return labels[serviceType] || serviceType;
};

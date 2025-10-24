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
  }[type] || type);

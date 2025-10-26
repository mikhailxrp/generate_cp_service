export default function CardInformation({ cpData, id }) {
  if (!cpData) return null;

  // Маппинг полей для отображения
  const fieldLabels = {
    essBattery: "ESS (АКБ)",
    networkPhazes: "Количество фаз сети",
    connectedPowerKw: "Подключенная мощность",
    microgeneration: "Микрогенерация",
    monthlyConsumptionKwh: "Месячное потребление",
    priceKwh: "Стоимость кВт⋅ч",
    buildingHeight: "Высота здания",
    transportCosts: "Транспортные расходы",
    dgUnit: "ДГУ",
    electricCar: "Электромобиль",
    projectNumber: "Номер проекта",
  };

  // Функция для форматирования значений
  const formatValue = (key, value) => {
    if (!value || value === "") return "—";

    switch (key) {
      case "networkPhazes":
        return value === "1" ? "1 фаза" : value === "3" ? "3 фазы" : value;
      case "microgeneration":
        return value === "yes" ? "Да" : value === "no" ? "Нет" : value;
      case "transportCosts":
      case "dgUnit":
      case "electricCar":
        return value === "yes" ? "Да" : value === "no" ? "Нет" : value;
      case "connectedPowerKw":
        return `${value} кВт`;
      case "monthlyConsumptionKwh":
        return `${value} кВт⋅ч`;
      case "priceKwh":
        return `${value} руб./кВт⋅ч`;
      case "buildingHeight":
        return `${value} м`;
      default:
        return value;
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Полная информация</h5>
        <div className="row g-3 mt-2">
          {Object.entries(fieldLabels).map(([key, label]) => {
            const value = cpData[key];
            return (
              <div key={key} className="col-md-6">
                <div className="d-flex flex-column">
                  <span className="text-muted small">{label}</span>
                  <span className="fw-semibold">{formatValue(key, value)}</span>
                </div>
              </div>
            );
          })}

          {/* Боли клиента */}
          {cpData.clientPainsLabels && cpData.clientPainsLabels.length > 0 && (
            <div className="col-12">
              <div className="d-flex flex-column">
                <span className="text-muted small">Боли клиента</span>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {cpData.clientPainsLabels.map((pain, index) => (
                    <span key={index} className="badge bg-primary">
                      {pain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MainInfoCard({ cpData }) {
  if (!cpData) return null;

  const getAreaTypeLabel = (typeArea) => {
    const areaTypeMap = {
      flat_south: "Плоская(юг)",
      "flat_east-west": "Плоская(восток-запад)",
      metal: "Металл/мягкая черепица",
      classic_tiles: "Классическая черепица",
      slate: "Шифер",
      carpot_south: "Карпот(юг)",
      "carpot_east-west": "Карпот(восток-запад)",
      canopy: "Навес",
      ground: "Наземка",
      facade: "Фасад",
      other: "Другое",
    };
    return areaTypeMap[typeArea] || typeArea;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
          <i className="bi bi-info-circle me-2"></i>
          Основная информация
        </h5>
      </div>
      <div
        className="card-body"
        style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}
      >
        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Клиент:</div>
            <div className="col-7">{cpData.clientName || "—"}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Адрес:</div>
            <div className="col-7">{cpData.clientAddress || "—"}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Тип клиента:</div>
            <div className="col-7">
              {cpData.clientType === "B2B"
                ? "Юридическое лицо"
                : "Физическое лицо"}
            </div>
          </div>
        </div>

        {cpData.clientType === "legal" && cpData.clientClass && (
          <div className="mb-3">
            <div className="row">
              <div className="col-5 fw-bold text-muted">Класс клиента:</div>
              <div className="col-7">
                {cpData.clientClass === "simple" && "Простой"}
                {cpData.clientClass === "with-requests" && "С запросами"}
                {cpData.clientClass === "with-project" && "С проектом"}
              </div>
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Тип системы:</div>
            <div className="col-7">
              {cpData.systemType === "network" && "Сетевая"}
              {cpData.systemType === "hybrid" && "Гибридная"}
              {cpData.systemType === "independent" && "Автономная"}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Тип площадки:</div>
            <div className="col-7">{getAreaTypeLabel(cpData.typeArea)}</div>
          </div>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Направлений:</div>
            <div className="col-7">{cpData.directionsCount}</div>
          </div>
        </div>

        <div className="mb-0">
          <div className="row">
            <div className="col-5 fw-bold text-muted">Мощность СЭС:</div>
            <div className="col-7">
              <span
                className="badge bg-success"
                style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)" }}
              >
                {cpData.sesPower} кВт
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

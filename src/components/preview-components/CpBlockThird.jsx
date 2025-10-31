"use client";
import "./preview-components.css";

export default function CpBlockThird({
  sesType = [],
  clientType = "",
  systemType = "",
}) {
  console.log("sesType", sesType);
  return (
    <div className="cp-block-two preview-block-container mb-4">
      <div className="content-container preview-content-card">
        <div className="devider-container">
          <div className="devider"></div>
          <div className="logo-container">
            <img src="/brand/logo.svg" alt="logo" />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-12">
            <h2 className="preview-title-section">
              Принцип работы{" "}
              {systemType === "network"
                ? "Сетевой"
                : systemType === "hybrid"
                ? "Гибридной"
                : "Автономной"}{" "}
              СЭС
            </h2>
            <div className="how-to-work-wrapper">
              {(() => {
                const systemTypeMap = {
                  network: "Сетевая солнечная электростанция",
                  hybrid: "Гибридная солнечная электростанция",
                  autonomous: "Автономная солнечная электростанция",
                };
                const expectedType =
                  systemTypeMap[systemType] ||
                  "Автономная солнечная электростанция";
                const match = sesType.find(
                  (item) =>
                    item?.segment === clientType && item?.type === expectedType
                );

                if (!match) {
                  return (
                    <div className="preview-text-description">
                      Данные по выбранной конфигурации не найдены.
                    </div>
                  );
                }

                return (
                  <>
                    <div className="row g-4">
                      <div className="col-12 col-lg-7 how-to-work-text">
                        <h3 className="knowledge-title-section">
                          Как это работает
                        </h3>
                        <p className="preview-text-description">
                          {match.how_it_works}
                        </p>

                        <h3 className="knowledge-title-section">
                          Почему это выгодно
                        </h3>
                        <p className="preview-text-description">
                          {match.why_for_business}
                        </p>
                      </div>
                      <div className="col-12 col-lg-5">
                        <div className="preview-content-card how-to-work-card">
                          <h4 className="knowledge-title-section">
                            Главное возражение
                          </h4>
                          <p
                            className="preview-text-description"
                            style={{ marginBottom: 16 }}
                          >
                            {match.main_objection}
                          </p>
                          <h4
                            className="knowledge-title-section"
                            style={{ marginTop: 8 }}
                          >
                            Результат
                          </h4>
                          <p
                            className="preview-text-description"
                            style={{ marginBottom: 0 }}
                          >
                            {match.result}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2 justify-content-center">
                      <div className="col-lg-10 how-to-work-img-wrapper">
                        <img
                          src="/image/principle-work.jpg"
                          alt="Принцип работы СЭС"
                          className="how-to-work-img"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

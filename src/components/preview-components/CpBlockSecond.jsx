"use client";
import "./preview-components.css";

export default function CpBlockTwo({ pains = [], kbPains = [] }) {
  const mappedPains = Array.isArray(pains)
    ? pains.map((key) => {
        const normalizedKey = typeof key === "string" ? key.trim() : key;
        const entry = kbPains && normalizedKey ? kbPains[normalizedKey] : null;
        return entry && entry.title ? entry.title : normalizedKey;
      })
    : [];

  console.log("kbPains", kbPains);
  return (
    <div className="cp-block-two preview-block-container mb-4 mt-4">
      <div className="content-container preview-content-card">
        <div className="devider-container mb-2">
          <div className="devider"></div>
          <div className="logo-container">
            <img src="/brand/logo.svg" alt="logo" />
          </div>
        </div>

        <h2 className="preview-title-section">Компанния Санхорс</h2>
        <p className="preview-text-description">
          Ваш надежный партнер в области возобновляемой энергетики. Мы
          используем только проверенное оборудование ведущих производителей из
          <strong> России, Китая и Европы</strong>, обеспечивая надежность и
          эффективность наших решений.{" "}
        </p>
        <p className="preview-text-description mt-3">
          За более чем <strong>10 лет</strong> на рынке мы реализовали проекты
          для таких компаний, как:
        </p>
        <div className="container-partners-logo">
          {[
            "emi_logo.png",
            "logo_banc_center.png",
            "logo-sber.png",
            "logo-tigarbo.png",
            "techno-nikol.png",
            "yandex_logo.png",
          ].map((logo, index) => (
            <div key={index} className="partner-logo">
              <img
                src={`/image/partners-logo/${logo}`}
                alt={`partner logo ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="row row-with-separator mt-4">
          <div className="container-knowledge-base mt-3 col-lg-6">
            <h3 className="knowledge-title-section">
              Ваши проблемы и наши решения
            </h3>
            <div
              className="pains-wrapper"
              data-mapped-count={mappedPains.length}
            >
              {Array.isArray(pains) &&
                pains.map((key, index) => {
                  const normalizedKey =
                    typeof key === "string" ? key.trim() : key;
                  const exactEntry =
                    kbPains && normalizedKey ? kbPains[normalizedKey] : null;
                  const entry =
                    exactEntry || (kbPains ? kbPains.other : null) || {};
                  const title =
                    exactEntry && exactEntry.title
                      ? exactEntry.title
                      : kbPains && kbPains.other && kbPains.other.title
                      ? kbPains.other.title
                      : typeof key === "string"
                      ? key
                      : String(key);

                  return (
                    <div key={index} className="pain-item mb-3">
                      <h4 className="pain-title">{title}</h4>
                      {entry.solution_short && (
                        <p className="pain-solution-short">
                          {entry.solution_short}
                        </p>
                      )}
                      {entry.kpi_line && (
                        <p className="pain-kpi-line">{entry.kpi_line}</p>
                      )}
                      {Array.isArray(entry.bullets) &&
                        entry.bullets.length > 0 && (
                          <ul className="pain-bullets">
                            {entry.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-lg-6 container-knowledge-img">
            <img
              src="/image/solar-panel.jpg"
              alt="solar panel"
              className="preview-image-hero"
            />
          </div>
          {/* <div className="accent-bar accent-bar--orange"></div> */}
        </div>
      </div>
    </div>
  );
}

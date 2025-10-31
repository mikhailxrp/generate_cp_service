"use client";
import "./preview-components.css";

export default function CpBlockOne({
  clientName,
  clientType,
  sesPower,
  systemType,
}) {
  return (
    <div className="cp-block-one preview-block-container">
      {/* Main hero card */}
      <div className="hero-card">
        {/* Background image container */}
        <div className="hero-image-container">
          <img
            src="/image/herro-solar-panel.jpg"
            alt="Solar panel installation"
            className="preview-image-hero"
          />
        </div>

        {/* Content area with gradient overlay */}
        <div className="content-area">
          <div className="content-container">
            <h1 className="preview-title-main">
              Технико-коммерческое предложение
            </h1>
            <h3
              className="preview-title-section"
              style={{ marginBottom: "15px" }}
            >
              {systemType === "network"
                ? "Сетевая"
                : systemType === "hybrid"
                ? "Гибридная"
                : "Автономная"}{" "}
              <span className="preview-badge">
                СЭС {Math.round(sesPower)} кВт
              </span>{" "}
              {clientType === "B2B"
                ? `для компнаии ${clientName}`
                : `для ${clientName}`}
            </h3>
            {/* <h4 className="preview-title-section">
              
            </h4> */}
            <p className="preview-text-description">
              Профессиональное решение для вашего объекта с учетом всех
              технических требований и экономической эффективности проекта.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon preview-accent-green">✓</span>
                <span className="preview-text-feature">
                  Индивидуальный расчет
                </span>
              </div>
              <div className="feature-item">
                <span className="feature-icon preview-accent-green">✓</span>
                <span className="preview-text-feature">Гарантия качества</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon preview-accent-green">✓</span>
                <span className="preview-text-feature">
                  Полное сопровождение
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Green accent bar */}
        <div className="accent-bar"></div>
      </div>

      <style jsx>{`
        .decorative-bg-shape {
          position: absolute;
          top: -50px;
          right: -100px;
          width: 300px;
          height: 200px;
          background: #ffffff;
          border-radius: 50% 30% 70% 40%;
          z-index: 1;
          opacity: 0.8;
        }

        .hero-card {
          position: relative;
          display: flex;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          min-height: 400px;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .hero-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          transform: scale(1.01);
        }

        .hero-image-container {
          position: relative;
          flex: 0 0 50%;
          overflow: hidden;
        }

        .content-area {
          position: relative;
          flex: 0 0 50%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.75) 100%
          );
          display: flex;
          align-items: center;
          padding: 32px;
        }

        .content-container {
          max-width: 100%;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
        }

        .accent-bar {
          position: absolute;
          right: 50%;
          top: 0;
          bottom: 0;
          width: 6px;
          background: #009639;
          border-radius: 0 8px 8px 0;
          z-index: 3;
        }

        /* Responsive design */
        @media (max-width: 1023px) {
          .hero-card {
            flex-direction: column;
            min-height: auto;
          }

          .hero-image-container {
            flex: 0 0 300px;
          }

          .content-area {
            flex: 1;
            padding: 24px;
          }

          .accent-bar {
            right: 0;
            top: auto;
            bottom: 0;
            width: 100%;
            height: 6px;
            border-radius: 8px 8px 0 0;
          }
        }
      `}</style>
    </div>
  );
}

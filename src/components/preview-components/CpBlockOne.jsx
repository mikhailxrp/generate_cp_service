"use client";

export default function CpBlockOne() {
  return (
    <div className="cp-block-one">
      {/* Decorative white curved background shape */}
      <div className="decorative-bg-shape"></div>

      {/* Main hero card */}
      <div className="hero-card">
        {/* Background image container */}
        <div className="hero-image-container">
          <img
            src="/api/placeholder/800/400"
            alt="Solar panel installation"
            className="hero-image"
          />
        </div>

        {/* Content area with gradient overlay */}
        <div className="content-area">
          <div className="content-container">
            <h1 className="main-title">Технико-коммерческое предложение</h1>
            <h2 className="section-title">Солнечная энергетическая система</h2>
            <p className="description">
              Профессиональное решение для вашего объекта с учетом всех
              технических требований и экономической эффективности проекта.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Индивидуальный расчет</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Гарантия качества</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Полное сопровождение</span>
              </div>
            </div>
          </div>
        </div>

        {/* Green accent bar */}
        <div className="accent-bar"></div>
      </div>

      <style jsx>{`
        .cp-block-one {
          position: relative;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 32px;
        }

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

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
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

        .main-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
          color: #2b2b2b;
          letter-spacing: -0.5px;
          margin: 0 0 16px 0;
        }

        .section-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
          color: #2b2b2b;
          letter-spacing: -0.3px;
          margin: 0 0 16px 0;
        }

        .description {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.6;
          color: #2b2b2b;
          margin: 0 0 24px 0;
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #2b2b2b;
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: #009639;
          color: #ffffff;
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
          .cp-block-one {
            padding: 16px;
          }

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

          .main-title {
            font-size: 28px;
          }

          .section-title {
            font-size: 24px;
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

        @media (max-width: 767px) {
          .main-title {
            font-size: 24px;
          }

          .section-title {
            font-size: 20px;
          }

          .description {
            font-size: 14px;
          }

          .feature-item {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

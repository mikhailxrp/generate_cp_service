"use client";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section footer-about">
            <h3 className="footer-title">CP Generator</h3>
            <p className="footer-description">
              Автоматизированная система генерации коммерческих предложений для
              солнечных энергетических систем
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} CP Generator. Все права защищены.</p>
          </div>
          <div className="footer-credits">
            <span>Разработано с</span>
            <i className="bi bi-heart-fill"></i>
            <span>для эффективной работы</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

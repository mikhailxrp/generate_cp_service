"use client";
import "./preview-components.css";
import faq from "../../know_base/faq.json";

export default function CpBlockFifth() {
  const allFaq = [...(faq?.faq?.b2b ?? []), ...(faq?.faq?.b2c ?? [])];
  const totalToShow = Math.floor(allFaq.length / 2);
  const visibleFaq = allFaq.slice(0, totalToShow);
  const middleIndex = Math.ceil(visibleFaq.length / 2);
  const leftFaq = visibleFaq.slice(0, middleIndex);
  const rightFaq = visibleFaq.slice(middleIndex);
  return (
    <div
      className="cp-block-two preview-block-container mb-4"
      data-faq-size={
        (faq?.faq?.b2b?.length || 0) + (faq?.faq?.b2c?.length || 0)
      }
    >
      <div className="content-container preview-content-card">
        <div className="devider-container">
          <div className="devider"></div>
          <div className="logo-container">
            <img src="/brand/logo.svg" alt="logo" />
          </div>
        </div>
        <h2 className="preview-title-section mt-2">Часто задаваемые вопросы</h2>
        <div className="row mt-4">
          <div className="col-lg-6 faq-wrapper">
            {leftFaq.map((item, index) => (
              <div
                className="faq-item"
                key={`left-${index}`}
                style={{ marginBottom: "12px" }}
              >
                <div
                  className="faq-q"
                  style={{ fontSize: "1rem", fontWeight: 700 }}
                >
                  {item.question}
                </div>
                <div
                  className="faq-a"
                  style={{ fontSize: "0.9rem", fontWeight: 400 }}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-6 faq-wrapper">
            {rightFaq.map((item, index) => (
              <div
                className="faq-item"
                key={`right-${index}`}
                style={{ marginBottom: "12px" }}
              >
                <div
                  className="faq-q"
                  style={{ fontSize: "1rem", fontWeight: 700 }}
                >
                  {item.question}
                </div>
                <div
                  className="faq-a"
                  style={{ fontSize: "0.9rem", fontWeight: 400 }}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

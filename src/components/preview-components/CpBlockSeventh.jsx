"use client";
import "./preview-components.css";

export default function CpBlockSeventh() {
  return (
    <div className="cp-block-two preview-block-container">
      <div className="content-container preview-content-card">
        <div className="devider-container">
          <div className="devider"></div>
          <div className="logo-container">
            <img src="/brand/logo.svg" alt="logo" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <h2 className="preview-title-section mt-2">Контакты</h2>
          </div>
          <div className="col-lg-6">
            <p>
              В данной секции контакты появяться полсе того как добавлю
              функционал добавляения пользователя. так мы будем тянуть данные
              менеджера прямо из базы данных.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

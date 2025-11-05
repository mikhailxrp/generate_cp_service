"use client";
import { Suspense } from "react";
import CpBlockSeventh from "./CpBlockSeventh";

export default function CpBlockSeventhWrapper() {
  return (
    <Suspense
      fallback={
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
                <p className="preview-text-description">Загрузка...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CpBlockSeventh />
    </Suspense>
  );
}

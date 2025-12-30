"use client";
import "./preview-components.css";

export default function CpBlockLogos({ typeArea }) {
  let headerLabel = null;
  let bgImg = null;

  if (typeArea === "flat_south" || typeArea === "flat_east-west") {
    headerLabel = "ПЛОСКАЯ КРОВЛЯ  ЗАПАД-ВОСТОК/ЮГ";
    bgImg = "/image/flat-bg.png";
  }
  if (typeArea === "metal") {
    headerLabel = "МЕТАЛИЧЕСКАЯ КРОВЛЯ";
    bgImg = "/image/metal-bg.png";
  }
  if (
    typeArea === "carpot_south" ||
    typeArea === "carpot_east-west" ||
    typeArea === "canopy" ||
    typeArea === "ground"
  ) {
    headerLabel = "КАРПОТ";
    bgImg = "/image/carpot-bg.png";
  }
  if (typeArea === "classic_tiles" || typeArea === "slate") {
    headerLabel = "МЯГКАЯ КРОВЛЯ";
    bgImg = "/image/soft-roof-bg.png";
  }

  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">{headerLabel}</span>
        </div>
        <div className="cp-line-header__line-wrapper">
          <div className="cp-line-header__dot--left"></div>
          <div className="cp-line-header__line"></div>
          <div className="cp-line-header__dot--right"></div>
        </div>
        <div className="cp-line-header__logo">
          <img
            src="/brand/logo.svg"
            alt="САНХОРС"
            className="cp-line-header__logo-image"
          />
        </div>
      </div>

      <div
        className="cp-block-faq-wrapper"
        style={{
          height: "100%",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
        }}
      ></div>
    </div>
  );
}

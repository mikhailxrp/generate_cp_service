"use client";
import "./preview-components.css";

export default function CpBlockContact({ userData }) {
  const getInitials = (name, surname) => {
    if (!name || !surname) return "?";
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getPosition = (role) => {
    switch (role) {
      case "admin":
        return "Руководитель отдела продаж";
      case "manager":
        return "Менеджер по продажам";
      default:
        return "Сотрудник компании";
    }
  };

  return (
    <div className="cp-block cp-block-six">
      <div className="cp-line-header">
        <div className="cp-line-header__pill">
          <span className="cp-line-header__pill-text">КОНТАКТЫ</span>
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

      <div className="cp-block-contact-wrapper">
        <h2 className="cp-block-contact-title">
          СЛЕДУЮЩИЙ <span className="cp-block-contact-title--green">ШАГ</span>
        </h2>

        <div className="cp-block-contact-inner mt-5">
          <div className="cp-block-contact-column-left">
            <div className="avatart-image">
              {userData?.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={`${userData.name} ${userData.surname}`}
                  className="cp-block-contact-avatar"
                />
              ) : (
                <img
                  src="/image/placeholder.png"
                  alt="Placeholder"
                  className="cp-block-contact-avatar"
                />
              )}
            </div>
          </div>

          <div className="cp-block-contact-column-right">
            <div className="cp-contact-header">
              <span className="cp-contact-header-green">
                ПРЕДЛАГАЕМ ОБСУДИТЬ ЭТО С ВАМИ
              </span>
            </div>

            <div className="cp-contact-format">
              <span className="cp-contact-format-text">
                ФОРМАТ — 15 МИНУТ ОНЛАЙН
              </span>
            </div>

            <div className="cp-contact-info">
              <div className="cp-contact-name">
                <span className="cp-contact-name-surname">
                  {userData?.surname || "Фамилия"}
                </span>
                <br />
                <span className="cp-contact-name-first">
                  {userData?.name || "Имя"}
                </span>
              </div>

              <div className="cp-contact-position">
                {userData?.role
                  ? getPosition(userData.role)
                  : "Сотрудник компании"}
              </div>

              <div className="cp-contact-details">
                <div className="cp-contact-phone">
                  Тел:{" "}
                  <span className="cp-contact-value">
                    {userData?.phone || "+7 (XXX) XXX-XX-XX"}
                  </span>
                </div>
                <div className="cp-contact-email">
                  E-mail:{" "}
                  <span className="cp-contact-value">
                    {userData?.email || "x.XXXX@xxxxxxxxx.com"}
                  </span>
                </div>
              </div>

              <div className="cp-contact-footer">
                <div className="cp-contact-company">ООО «Санхорс»</div>
                <div className="cp-contact-website">
                  <a href="https://sunhors.ru/" target="_blank">
                    www.sunhors.ru
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import "./preview-components.css";
import { getUserProfile } from "@/app/actions/getUserProfile";
import { useEffect, useState } from "react";

export default function CpBlockSeventh() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const result = await getUserProfile();
        if (result.success) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Пока загружается, показываем базовую структуру
  if (loading || !user) {
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
              <p className="preview-text-description">
                Информация загружается...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="preview-title-section mt-2">
              Ваш персональный менеджер
            </h2>
          </div>
        </div>

        <div className="row mt-4 align-items-center">
          <div className="col-lg-5">
            <div className="manager-info-card">
              {user?.avatarUrl && (
                <div className="manager-avatar-wrapper">
                  <img
                    src={user.avatarUrl}
                    alt="Manager avatar"
                    className="manager-avatar"
                  />
                </div>
              )}
              <div className="manager-details">
                <h3 className="manager-name">
                  {user?.name} {user?.surname}
                </h3>
                <p className="manager-role">
                  {user?.role === "admin" ? "Администратор" : "Менеджер"}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contacts-grid">
              <div className="contact-item">
                <div className="contact-icon contact-icon--email">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">Email</span>
                  <a href={`mailto:${user?.email}`} className="contact-value">
                    {user?.email}
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon contact-icon--phone">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">Телефон</span>
                  <a href={`tel:${user?.phone}`} className="contact-value">
                    {user?.phone}
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon contact-icon--telegram">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"></path>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">Telegram</span>
                  <a
                    href={`https://t.me/${user?.telegram?.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value"
                  >
                    {user?.telegram}
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon contact-icon--whatsapp">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">WhatsApp</span>
                  <a
                    href={`https://wa.me/${user?.whatsapp?.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value"
                  >
                    {user?.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="contact-cta">
              <p className="preview-text-description mb-2">
                Свяжитесь со мной любым удобным способом для обсуждения деталей
                проекта. Я готов ответить на все ваши вопросы и помочь с
                реализацией энергетического решения.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .manager-info-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #009639 0%, #00b347 100%);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 150, 57, 0.2);
        }

        .manager-avatar-wrapper {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          background: #ffffff;
        }

        .manager-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .manager-details {
          color: #ffffff;
        }

        .manager-name {
          font-family: "Montserrat", sans-serif;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #ffffff;
        }

        .manager-role {
          font-family: "Montserrat", sans-serif;
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          opacity: 0.9;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .contact-item:hover {
          background: #e9ecef;
          transform: translateX(4px);
        }

        .contact-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #ffffff;
        }

        .contact-icon--email {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .contact-icon--phone {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .contact-icon--telegram {
          background: linear-gradient(135deg, #0088cc 0%, #00aced 100%);
        }

        .contact-icon--whatsapp {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        }

        .contact-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-label {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6c757d;
          letter-spacing: 0.5px;
        }

        .contact-value {
          font-family: "Montserrat", sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #2b2b2b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-value:hover {
          color: #009639;
        }

        .contact-cta {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          border-left: 4px solid #009639;
        }

        @media (max-width: 991px) {
          .manager-info-card {
            flex-direction: column;
            text-align: center;
            margin-bottom: 24px;
          }

          .contacts-grid {
            margin-top: 0;
          }
        }

        @media (max-width: 767px) {
          .manager-avatar-wrapper {
            width: 80px;
            height: 80px;
          }

          .manager-name {
            font-size: 20px;
          }

          .manager-role {
            font-size: 14px;
          }

          .contact-item {
            padding: 12px;
          }

          .contact-icon {
            width: 38px;
            height: 38px;
          }

          .contact-value {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

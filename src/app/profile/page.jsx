import Header from "@/components/header/Header";
import { getUserProfile } from "@/app/actions/getUserProfile";
import { redirect } from "next/navigation";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileInfoSection from "@/components/ProfileInfoSection";
import SecuritySection from "@/components/SecuritySection";
import "./profile.css";

export const metadata = {
  title: "Профиль",
  description: "Профиль пользователя",
};

export default async function Profile() {
  const result = await getUserProfile();

  if (!result.success) {
    redirect("/login");
  }

  const user = result.user;

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Header />
      <div className="container profile-container">
        <div className="row mt-5">
          <div className="col-12">
            <h1 className="main-title text-center">Профиль пользователя</h1>
            <p className="text-center main-description">
              Информация о вашем аккаунте и настройки профиля
            </p>
          </div>
        </div>

        <div className="row mt-4 mb-5">
          <div className="col-lg-4 mb-4 mb-lg-0">
            {/* Карточка с аватаром */}
            <div className="profile-card">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrl}
                name={user.name}
                surname={user.surname}
              />

              <div className="profile-user-info">
                <h3 className="profile-user-name">
                  {user.name} {user.surname}
                </h3>
                <span
                  className={`profile-role-badge ${
                    user.role === "admin" ? "badge-admin" : "badge-manager"
                  }`}
                >
                  <i
                    className={`bi ${
                      user.role === "admin"
                        ? "bi-shield-check"
                        : "bi-person-badge"
                    }`}
                  ></i>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <div className="profile-stats">
                <div className="profile-stat-item">
                  <i className="bi bi-calendar-plus"></i>
                  <div>
                    <span className="stat-label">Дата регистрации</span>
                    <span className="stat-value">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {/* Основная информация */}
            <ProfileInfoSection user={user} />

            {/* Безопасность */}
            <SecuritySection />
          </div>
        </div>
      </div>
    </>
  );
}

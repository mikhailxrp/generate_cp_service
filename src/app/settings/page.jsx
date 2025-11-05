import Header from "@/components/header/Header";
import { getUserProfile } from "@/app/actions/getUserProfile";
import { getUsers } from "@/app/actions/getUsers";
import { redirect } from "next/navigation";
import UsersManagementSection from "@/components/UsersManagementSection";

export const metadata = {
  title: "Настройки",
  description: "Настройки генератора КП",
};

export default async function Settings() {
  const result = await getUserProfile();

  if (!result.success) {
    redirect("/login");
  }

  const user = result.user;

  // Только админы могут видеть настройки
  if (user.role !== "admin") {
    redirect("/");
  }

  // Получаем всех пользователей
  const usersResult = await getUsers();
  const users = usersResult.success ? usersResult.users : [];

  return (
    <>
      <Header />
      <div className="container profile-container">
        <div className="row mt-5">
          <div className="col-12">
            <h1 className="main-title text-center">Настройки системы</h1>
            <p className="text-center main-description">
              Управление пользователями и параметрами системы
            </p>
          </div>
        </div>

        <div className="row mt-4 mb-5">
          <div className="col-12">
            <UsersManagementSection users={users} currentUserId={user.id} />
          </div>
        </div>
      </div>
    </>
  );
}

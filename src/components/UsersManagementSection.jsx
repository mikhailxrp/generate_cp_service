"use client";

import { useState } from "react";
import AddUserModal from "./AddUserModal";
import { deleteUser } from "@/app/actions/deleteUser";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function UsersManagementSection({ users, currentUserId }) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

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

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "manager":
        return "badge-manager";
      default:
        return "";
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

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить этого пользователя? Это действие необратимо."
      )
    ) {
      return;
    }

    setDeletingUserId(userId);

    try {
      const result = await deleteUser(userId);

      if (!result.success) {
        showToast.error(result.error || "Ошибка при удалении пользователя");
        return;
      }

      showToast.success("Пользователь успешно удален");
      router.refresh();
    } catch (error) {
      console.error("Delete user error:", error);
      showToast.error("Ошибка при удалении пользователя");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="profile-card">
        <div className="profile-card-header">
          <h5 className="profile-card-title">
            <i className="bi bi-people-fill"></i>
            Управление пользователями
          </h5>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="bi bi-person-plus-fill"></i> Добавить пользователя
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Дата регистрации</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={`${user.name} ${user.surname}`}
                          className="rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "1rem",
                            fontWeight: "700",
                          }}
                        >
                          {user.name[0]}
                          {user.surname[0]}
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">
                          {user.name} {user.surname}
                        </div>
                        {user.id === currentUserId && (
                          <small className="text-muted">(Вы)</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span
                      className={`profile-role-badge ${getRoleBadgeClass(
                        user.role
                      )}`}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}
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
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="text-center">
                    {user.id !== currentUserId && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Удаление...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash"></i> Удалить
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-4">
            <i
              className="bi bi-people text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="text-muted mt-2">Пользователи не найдены</p>
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}

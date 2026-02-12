"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileInfoSection({ user }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="profile-card mb-4">
        <div className="profile-card-header">
          <h5 className="profile-card-title">
            <i className="bi bi-person-circle"></i>
            Основная информация
          </h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setIsEditModalOpen(true)}
          >
            <i className="bi bi-pencil"></i> Редактировать
          </button>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <label className="profile-info-label">
              <i className="bi bi-envelope"></i>
              Email
            </label>
            <span className="profile-info-value">{user.email}</span>
          </div>

          <div className="profile-info-item">
            <label className="profile-info-label">
              <i className="bi bi-telephone"></i>
              Телефон
            </label>
            <span className="profile-info-value">{user.phone}</span>
          </div>

          <div className="profile-info-item">
            <label className="profile-info-label">
              <i className="bi bi-telegram"></i>
              Telegram
            </label>
            <span className="profile-info-value">
              {user.telegram || "Не указан"}
            </span>
          </div>

          <div className="profile-info-item">
            <label className="profile-info-label">
              <i className="bi bi-whatsapp"></i>
              WhatsApp || Max
            </label>
            <span className="profile-info-value">
              {user.whatsapp || "Не указан"}
            </span>
          </div>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

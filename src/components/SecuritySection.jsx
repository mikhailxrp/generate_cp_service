"use client";

import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySection() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <div className="profile-card">
        <div className="profile-card-header">
          <h5 className="profile-card-title">
            <i className="bi bi-shield-lock"></i>
            Безопасность
          </h5>
        </div>

        <div className="profile-security-section">
          <div className="security-item">
            <div className="security-info">
              <i className="bi bi-key"></i>
              <div>
                <h6 className="security-title">Пароль</h6>
                <p className="security-description">
                  Регулярно меняйте пароль для безопасности вашего аккаунта
                </p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Изменить пароль
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}

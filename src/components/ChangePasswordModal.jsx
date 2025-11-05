"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/updatePassword";
import { showToast } from "@/lib/toast";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очистить ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Введите текущий пароль";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Введите новый пароль";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите новый пароль";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = "Новый пароль должен отличаться от текущего";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePassword(
        formData.oldPassword,
        formData.newPassword
      );

      if (!result.success) {
        showToast.error(result.error || "Ошибка при изменении пароля");
        return;
      }

      showToast.success("Пароль успешно изменен");
      // Очистить форму
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error) {
      console.error("Submit password error:", error);
      showToast.error("Ошибка при изменении пароля");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      old: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-shield-lock me-2"></i>
                Изменить пароль
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={isSubmitting}
              ></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Текущий пароль */}
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">
                    <i className="bi bi-key me-1"></i>
                    Текущий пароль <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      className={`form-control ${
                        errors.oldPassword ? "is-invalid" : ""
                      }`}
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Введите текущий пароль"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("old")}
                      disabled={isSubmitting}
                    >
                      <i
                        className={`bi ${
                          showPasswords.old ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                    {errors.oldPassword && (
                      <div className="invalid-feedback">
                        {errors.oldPassword}
                      </div>
                    )}
                  </div>
                </div>

                {/* Новый пароль */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    <i className="bi bi-key-fill me-1"></i>
                    Новый пароль <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      className={`form-control ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Введите новый пароль"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      disabled={isSubmitting}
                    >
                      <i
                        className={`bi ${
                          showPasswords.new ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="form-text">Минимум 6 символов</div>
                </div>

                {/* Подтверждение пароля */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="bi bi-key-fill me-1"></i>
                    Подтвердите новый пароль{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Повторите новый пароль"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      disabled={isSubmitting}
                    >
                      <i
                        className={`bi ${
                          showPasswords.confirm ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="alert alert-warning mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <small>
                    <strong>Важно:</strong> После изменения пароля вам нужно
                    будет войти заново с новым паролем.
                  </small>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Изменение...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Изменить пароль
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

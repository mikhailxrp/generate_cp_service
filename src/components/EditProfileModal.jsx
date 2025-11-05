"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions/updateUserProfile";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function EditProfileModal({ user, isOpen, onClose }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    phone: user.phone || "",
    telegram: user.telegram || "",
    whatsapp: user.whatsapp || "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Фамилия обязательна для заполнения";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен для заполнения";
    } else {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-()]/g, ""))) {
        newErrors.phone = "Некорректный формат телефона";
      }
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
      const result = await updateUserProfile(formData);

      if (!result.success) {
        showToast.error(result.error || "Ошибка при обновлении профиля");
        return;
      }

      showToast.success("Профиль успешно обновлен");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Submit profile error:", error);
      showToast.error("Ошибка при обновлении профиля");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-person-circle me-2"></i>
                Редактирование профиля
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isSubmitting}
              ></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Имя */}
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      <i className="bi bi-person me-1"></i>
                      Имя <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Введите имя"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {/* Фамилия */}
                  <div className="col-md-6">
                    <label htmlFor="surname" className="form-label">
                      <i className="bi bi-person me-1"></i>
                      Фамилия <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.surname ? "is-invalid" : ""
                      }`}
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Введите фамилию"
                    />
                    {errors.surname && (
                      <div className="invalid-feedback">{errors.surname}</div>
                    )}
                  </div>

                  {/* Телефон */}
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">
                      <i className="bi bi-telephone me-1"></i>
                      Телефон <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="+79001234567"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                    <div className="form-text">
                      Формат: +79001234567 или 89001234567
                    </div>
                  </div>

                  {/* Telegram */}
                  <div className="col-md-6">
                    <label htmlFor="telegram" className="form-label">
                      <i className="bi bi-telegram me-1"></i>
                      Telegram
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telegram"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="@username"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="col-md-6">
                    <label htmlFor="whatsapp" className="form-label">
                      <i className="bi bi-whatsapp me-1"></i>
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="+79001234567"
                    />
                  </div>
                </div>

                <div className="alert alert-info mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>
                    <strong>Обратите внимание:</strong> Email изменить нельзя.
                    Для изменения email обратитесь к администратору.
                  </small>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
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
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Сохранить изменения
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

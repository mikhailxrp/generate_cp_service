"use client";

import { useState } from "react";
import { createUser } from "@/app/actions/createUser";
import { showToast } from "@/lib/toast";

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: "",
    telegram: "",
    whatsapp: "",
    role: "manager",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Некорректный формат email";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен для заполнения";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

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
      const result = await createUser(formData);

      if (!result.success) {
        showToast.error(result.error || "Ошибка при создании пользователя");
        return;
      }

      showToast.success("Пользователь успешно создан");
      // Сбросить форму
      setFormData({
        email: "",
        password: "",
        name: "",
        surname: "",
        phone: "",
        telegram: "",
        whatsapp: "",
        role: "manager",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Submit create user error:", error);
      showToast.error("Ошибка при создании пользователя");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        email: "",
        password: "",
        name: "",
        surname: "",
        phone: "",
        telegram: "",
        whatsapp: "",
        role: "manager",
      });
      setErrors({});
      onClose();
    }
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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-person-plus-fill me-2"></i>
                Добавить нового пользователя
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
                <div className="row g-3">
                  {/* Email */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-1"></i>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="user@example.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Пароль */}
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-key me-1"></i>
                      Пароль <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Минимум 6 символов"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

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

                  {/* Роль */}
                  <div className="col-12">
                    <label htmlFor="role" className="form-label">
                      <i className="bi bi-shield-check me-1"></i>
                      Роль <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="manager">Менеджер</option>
                      <option value="admin">Администратор</option>
                    </select>
                    <div className="form-text">
                      Менеджер имеет доступ к созданию КП. Администратор имеет
                      полный доступ к системе.
                    </div>
                  </div>
                </div>

                <div className="alert alert-info mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>
                    <strong>Обратите внимание:</strong> После создания
                    пользователя, отправьте ему данные для входа: email и
                    пароль.
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
                      Создание...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Создать пользователя
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

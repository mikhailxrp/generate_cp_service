"use client";

import { useState, useEffect } from "react";
import { updateService } from "@/app/actions/updateService";

export default function EditServiceModal({
  isOpen,
  onClose,
  onSuccess,
  service,
}) {
  const [formData, setFormData] = useState({
    sku: "",
    title: "",
    serviceType: "",
    description: "",
    basePrice: "",
    currency: "RUB",
    executionDays: "",
    warrantyYears: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполняем форму данными услуги при открытии модального окна
  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        sku: service.sku || "",
        title: service.title || "",
        serviceType: service.serviceType || "",
        description: service.description || "",
        basePrice: service.basePrice || "",
        currency: service.currency || "RUB",
        executionDays: service.executionDays || "",
        warrantyYears: service.warrantyYears || "",
        comment: service.comment || "",
      });
    }
  }, [service, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateService(service.id, formData);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        alert("Ошибка при обновлении услуги: " + result.error);
      }
    } catch (error) {
      alert("Ошибка при обновлении услуги: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Редактировать услугу</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="sku" className="form-label">
                    SKU <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    Название <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="serviceType" className="form-label">
                    Тип услуги <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Выберите тип услуги</option>
                    <option value="installation">Монтаж</option>
                    <option value="commissioning">ПНР</option>
                    <option value="service">Сервис</option>
                    <option value="consultation">Консультация</option>
                    <option value="design">Проектирование</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="basePrice" className="form-label">
                    Базовая цена <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      id="basePrice"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      disabled={isSubmitting}
                    />
                    <select
                      className="form-select"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="RUB">₽</option>
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Описание
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="executionDays" className="form-label">
                    Срок выполнения (дни)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="executionDays"
                    name="executionDays"
                    value={formData.executionDays}
                    onChange={handleInputChange}
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="warrantyYears" className="form-label">
                    Гарантия (годы)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="warrantyYears"
                    name="warrantyYears"
                    value={formData.warrantyYears}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Комментарий
                </label>
                <textarea
                  className="form-control"
                  id="comment"
                  name="comment"
                  rows="2"
                  value={formData.comment}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
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
                  "Сохранить изменения"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

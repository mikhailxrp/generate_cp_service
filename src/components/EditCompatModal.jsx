"use client";

import { useState, useEffect } from "react";
import { editCompat } from "@/app/actions/editCompat";
import { showToast } from "@/lib/toast";

export default function EditCompatModal({
  isOpen,
  onClose,
  onSuccess,
  compat,
}) {
  const [formData, setFormData] = useState({
    inverterSku: "",
    essSku: "",
    isCompatible: "true",
    limits: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполняем форму данными совместимости при открытии модального окна
  useEffect(() => {
    if (compat) {
      setFormData({
        inverterSku: compat.inverterSku || "",
        essSku: compat.essSku || "",
        isCompatible: compat.isCompatible ? "true" : "false",
        limits: compat.limits || "",
        comment: compat.comment || "",
      });
    }
  }, [compat]);

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
      const result = await editCompat(compat.id, formData);
      if (result.success) {
        onSuccess?.(result.data);
        onClose();
      } else {
        showToast.error(
          "Ошибка при редактировании совместимости: " + result.error
        );
      }
    } catch (error) {
      showToast.error(
        "Ошибка при редактировании совместимости: " + error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !compat) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Редактировать совместимость
            </h5>
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
                  <label htmlFor="inverterSku" className="form-label">
                    Инвертор (SKU) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inverterSku"
                    name="inverterSku"
                    value={formData.inverterSku}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Введите SKU инвертора"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="essSku" className="form-label">
                    ESS (SKU) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="essSku"
                    name="essSku"
                    value={formData.essSku}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Введите SKU ESS"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="isCompatible" className="form-label">
                  Совместимость <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="isCompatible"
                  name="isCompatible"
                  value={formData.isCompatible}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="true">Да</option>
                  <option value="false">Нет</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="limits" className="form-label">
                  Ограничения
                </label>
                <textarea
                  className="form-control"
                  id="limits"
                  name="limits"
                  rows="3"
                  value={formData.limits}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Опишите ограничения совместимости (если есть)"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Комментарий
                </label>
                <textarea
                  className="form-control"
                  id="comment"
                  name="comment"
                  rows="3"
                  value={formData.comment}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Дополнительная информация о совместимости"
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
  );
}

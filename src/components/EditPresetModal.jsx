"use client";

import { useState, useEffect } from "react";
import { editPreset } from "@/app/actions/editPreset";
import { showToast } from "@/lib/toast";

export default function EditPresetModal({
  isOpen,
  onClose,
  onSuccess,
  preset,
}) {
  const [formData, setFormData] = useState({
    useCase: "",
    rangeKwp: "",
    pvModuleSkus: "",
    inverterSku: "",
    essSku: "",
    pcsSku: "",
    mountSku: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Заполняем форму данными пресета при открытии модального окна
  useEffect(() => {
    if (preset) {
      setFormData({
        useCase: preset.useCase || "",
        rangeKwp: preset.rangeKwp || "",
        pvModuleSkus: Array.isArray(preset.pvModuleSkus)
          ? preset.pvModuleSkus.join(", ")
          : preset.pvModuleSkus || "",
        inverterSku: preset.inverterSku || "",
        essSku: preset.essSku || "",
        pcsSku: preset.pcsSku || "",
        mountSku: preset.mountSku || "",
        notes: preset.notes || "",
      });
    }
  }, [preset]);

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
      const result = await editPreset(preset.id, formData);
      if (result.success) {
        onSuccess?.(result.data);
        onClose();
      } else {
        showToast.error("Ошибка при редактировании пресета: " + result.error);
      }
    } catch (error) {
      showToast.error("Ошибка при редактировании пресета: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !preset) return null;

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
              Редактировать пресет
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
                  <label htmlFor="useCase" className="form-label">
                    Use case <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="useCase"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Например: Жилой дом, Коммерческий объект"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="rangeKwp" className="form-label">
                    Диапазон кВтp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="rangeKwp"
                    name="rangeKwp"
                    value={formData.rangeKwp}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="Например: 5-10, 10-20"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="pvModuleSkus" className="form-label">
                  PV-модули (SKU)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pvModuleSkus"
                  name="pvModuleSkus"
                  value={formData.pvModuleSkus}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Введите SKU через запятую, например: SKU1,SKU2,SKU3"
                />
                <div className="form-text">
                  Введите SKU модулей через запятую без пробелов
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="inverterSku" className="form-label">
                    Инвертор (SKU)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inverterSku"
                    name="inverterSku"
                    value={formData.inverterSku}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="SKU инвертора"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="essSku" className="form-label">
                    ESS (SKU)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="essSku"
                    name="essSku"
                    value={formData.essSku}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="SKU ESS"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="pcsSku" className="form-label">
                    PCS (SKU)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pcsSku"
                    name="pcsSku"
                    value={formData.pcsSku}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="SKU PCS"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="mountSku" className="form-label">
                    Крепёж (SKU)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="mountSku"
                    name="mountSku"
                    value={formData.mountSku}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="SKU крепежа"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Заметки
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Дополнительная информация о пресете"
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

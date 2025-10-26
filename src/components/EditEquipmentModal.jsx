"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";

export default function EditEquipmentModal({
  isOpen,
  onClose,
  equipment,
  onSave,
  onSaveAndClose,
}) {
  const [formData, setFormData] = useState({});
  const [attributes, setAttributes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        sku: equipment.sku || "",
        title: equipment.title || "",
        typeCode: equipment.typeCode || "",
        priceRub: equipment.priceRub || "",
        currency: equipment.currency || "RUB",
        stock: equipment.stock || "",
        warehouseRegion: equipment.warehouseRegion || "",
        leadDays: equipment.leadDays || "",
        priority: equipment.priority || 0,
        specUrl: equipment.specUrl || "",
        comment: equipment.comment || "",
      });

      // Парсим атрибуты
      try {
        const parsedAttrs =
          typeof equipment.attrs === "string"
            ? JSON.parse(equipment.attrs)
            : equipment.attrs || {};
        setAttributes(parsedAttrs);
      } catch {
        setAttributes({});
      }
    }
  }, [equipment]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeChange = (key, value) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addAttribute = () => {
    const newKey = prompt("Введите название характеристики:");
    if (newKey && newKey.trim()) {
      setAttributes((prev) => ({
        ...prev,
        [newKey.trim()]: "",
      }));
    }
  };

  const removeAttribute = (key) => {
    setAttributes((prev) => {
      const newAttrs = { ...prev };
      delete newAttrs[key];
      return newAttrs;
    });
  };

  const handleSubmit = async (e, shouldClose = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedEquipment = {
        id: equipment.id,
        typeCode: formData.typeCode,
        sku: formData.sku,
        title: formData.title,
        priceRub: formData.priceRub
          ? parseFloat(formData.priceRub).toString()
          : "0",
        currency: formData.currency,
        stock: formData.stock || null,
        priority: formData.priority ? parseInt(formData.priority) : 0,
        warehouseRegion: formData.warehouseRegion,
        leadDays: formData.leadDays ? parseInt(formData.leadDays) : null,
        specUrl: formData.specUrl,
        comment: formData.comment || null,
        attrs: JSON.stringify(attributes),
        isActive: equipment.isActive || 1,
      };

      await onSave(updatedEquipment);

      if (shouldClose) {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      showToast.error("Ошибка при сохранении данных");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !equipment) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        style={{ maxHeight: "90vh" }}
      >
        <div className="modal-content" style={{ maxHeight: "90vh" }}>
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil me-2"></i>
              Редактирование оборудования
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className="modal-body"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">SKU *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Тип оборудования *</label>
                    <select
                      className="form-select"
                      value={formData.typeCode}
                      onChange={(e) =>
                        handleInputChange("typeCode", e.target.value)
                      }
                      required
                    >
                      <option value="">Выберите тип</option>
                      <option value="panel">Панель</option>
                      <option value="inverter">Инвертор</option>
                      <option value="ess">ESS</option>
                      <option value="mount">Крепёж</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-2">
                    <label className="form-label">Наименование *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Цена (руб.) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.priceRub}
                      onChange={(e) =>
                        handleInputChange("priceRub", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Валюта</label>
                    <select
                      className="form-select"
                      value={formData.currency}
                      onChange={(e) =>
                        handleInputChange("currency", e.target.value)
                      }
                    >
                      <option value="RUB">RUB</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Наличие</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Склад</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.warehouseRegion}
                      onChange={(e) =>
                        handleInputChange("warehouseRegion", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Поставка (дн.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.leadDays}
                      onChange={(e) =>
                        handleInputChange("leadDays", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Приоритет</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label mb-0">
                        Технические характеристики
                      </label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={addAttribute}
                      >
                        <i className="bi bi-plus me-1"></i>
                        Добавить
                      </button>
                    </div>
                    <div className="attributes-edit-container">
                      {Object.entries(attributes).map(([key, value]) => (
                        <div key={key} className="attribute-edit-item">
                          <div className="row">
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={key}
                                onChange={(e) => {
                                  const newKey = e.target.value;
                                  const newAttrs = { ...attributes };
                                  delete newAttrs[key];
                                  newAttrs[newKey] = value;
                                  setAttributes(newAttrs);
                                }}
                                placeholder="Название характеристики"
                              />
                            </div>
                            <div className="col-md-7">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={value}
                                onChange={(e) =>
                                  handleAttributeChange(key, e.target.value)
                                }
                                placeholder="Значение"
                              />
                            </div>
                            <div className="col-md-1">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeAttribute(key)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {Object.keys(attributes).length === 0 && (
                        <div className="text-muted text-center py-3">
                          Нет характеристик. Нажмите "Добавить" для создания
                          новой.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-2">
                    <label className="form-label">Ссылка на спецификацию</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.specUrl}
                      onChange={(e) =>
                        handleInputChange("specUrl", e.target.value)
                      }
                      placeholder="https://example.com/spec.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-2">
                    <label className="form-label">Комментарий</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.comment}
                      onChange={(e) =>
                        handleInputChange("comment", e.target.value)
                      }
                      placeholder="Дополнительная информация об оборудовании"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn btn-outline-primary me-2"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading}
              >
                {isLoading ? (
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
                    <i className="bi bi-check me-1"></i>
                    Сохранить
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  if (onSaveAndClose) {
                    onSaveAndClose();
                  }
                  handleSubmit(e, true);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Сохранить и закрыть
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

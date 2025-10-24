"use client";

import { useState } from "react";
import EditEquipmentModal from "./EditEquipmentModal";

export default function EquipmentModal({
  isOpen,
  onClose,
  equipment,
  onSave,
  onDelete,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shouldCloseAfterSave, setShouldCloseAfterSave] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить оборудование "${equipment.title}"?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(equipment.id);
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Ошибка при удалении оборудования");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !equipment) return null;

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }
    return value;
  };

  const formatMoney = (value) => {
    if (!value) return "—";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatBoolean = (value) => {
    if (value === null || value === undefined) return "—";
    return value ? "Да" : "Нет";
  };

  const getFieldLabel = (key) => {
    const labels = {
      id: "ID",
      sku: "SKU",
      title: "Наименование",
      typeCode: "Тип оборудования",
      priceRub: "Цена (руб.)",
      currency: "Валюта",
      stock: "Наличие",
      warehouseRegion: "Склад",
      leadDays: "Поставка (дн.)",
      priority: "Приоритет",
      specUrl: "Спецификация",
      attrs: "Характеристики",
      createdAt: "Дата создания",
      updatedAt: "Дата обновления",
    };
    return labels[key] || key;
  };

  const renderAttributes = (attrs) => {
    if (!attrs) return "—";

    try {
      const parsed = typeof attrs === "string" ? JSON.parse(attrs) : attrs;
      if (typeof parsed === "object" && parsed !== null) {
        return (
          <div className="attributes-container">
            {Object.entries(parsed).map(([key, value]) => (
              <div key={key} className="attribute-item">
                <strong>{key}:</strong> {formatValue(value)}
              </div>
            ))}
          </div>
        );
      }
      return formatValue(parsed);
    } catch {
      return formatValue(attrs);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-info-circle me-2"></i>
              Характеристики оборудования
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-12">
                <h6 className="text-primary mb-3">
                  <i className="bi bi-box me-2"></i>
                  {equipment.title || "Без названия"}
                </h6>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="info-section">
                  <h6 className="section-title">
                    <i className="bi bi-tag me-2"></i>
                    Основная информация
                  </h6>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">SKU:</span>
                      <code className="info-value">
                        {formatValue(equipment.sku)}
                      </code>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Тип:</span>
                      <span className="info-value">
                        {formatValue(equipment.typeCode)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Цена:</span>
                      <span className="info-value text-success fw-bold">
                        {formatMoney(equipment.priceRub)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Валюта:</span>
                      <span className="info-value">
                        {formatValue(equipment.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-section">
                  <h6 className="section-title">
                    <i className="bi bi-building me-2"></i>
                    Склад и поставка
                  </h6>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Наличие:</span>
                      <span className="info-value">
                        {formatValue(equipment.stock)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Склад:</span>
                      <span className="info-value">
                        {formatValue(equipment.warehouseRegion)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Поставка:</span>
                      <span className="info-value">
                        {formatValue(equipment.leadDays)} дн.
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Приоритет:</span>
                      <span className="info-value">
                        {formatValue(equipment.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {equipment.specUrl && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="info-section">
                    <h6 className="section-title">
                      <i className="bi bi-file-pdf me-2"></i>
                      Документация
                    </h6>
                    <div className="info-item">
                      <span className="info-label">Спецификация:</span>
                      <a
                        href={equipment.specUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm ms-2"
                      >
                        <i className="bi bi-download me-1"></i>
                        Скачать PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row mt-3">
              <div className="col-12">
                <div className="info-section">
                  <h6 className="section-title">
                    <i className="bi bi-gear me-2"></i>
                    Технические характеристики
                  </h6>
                  <div className="characteristics-container">
                    {renderAttributes(equipment.attrs)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Удаление...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-1"></i>
                    Удалить
                  </>
                )}
              </button>
              <div>
                <button
                  type="button"
                  className="btn btn-warning me-2"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Редактировать
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditEquipmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setShouldCloseAfterSave(false);
        }}
        equipment={equipment}
        onSave={async (updatedEquipment) => {
          await onSave(updatedEquipment);
          if (shouldCloseAfterSave) {
            setIsEditModalOpen(false);
            onClose();
          }
        }}
        onSaveAndClose={() => setShouldCloseAfterSave(true)}
      />
    </div>
  );
}

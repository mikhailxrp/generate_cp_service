"use client";

import { useState } from "react";
import EditEquipmentModal from "./EditEquipmentModal";
import { showToast } from "@/lib/toast";

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
      showToast.error("Ошибка при удалении оборудования");
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

  // Форматируем наличие: 1 -> "ДА", 0 -> "НЕТ", остальное -> как есть
  const formatStock = (stock) => {
    if (stock === null || stock === undefined) return "—";
    if (stock === 1 || stock === "1") return "ДА";
    if (stock === 0 || stock === "0") return "НЕТ";
    return String(stock);
  };

  // Форматируем приоритет: 1 -> "НИЗКИЙ", 2 -> "СРЕДНИЙ", 3 -> "ВЫСОКИЙ"
  const formatPriority = (priority) => {
    if (priority === null || priority === undefined) return "—";
    if (priority === 1 || priority === "1") return "НИЗКИЙ";
    if (priority === 2 || priority === "2") return "СРЕДНИЙ";
    if (priority === 3 || priority === "3") return "ВЫСОКИЙ";
    return String(priority);
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

  // Функция для перевода ключей на русский
  const translateKey = (key) => {
    const translations = {
      bos: "BOS (баланс системы)",
      meta: "Метаданные",
      compat: "Совместимость",
      mechanical: "Механические характеристики",
      electrical: "Электрические характеристики",
    };
    return translations[key] || key;
  };

  const renderValue = (value, depth = 0) => {
    if (value === null || value === undefined) {
      return "—";
    }

    // Если это объект или массив, рекурсивно рендерим
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {value.map((item, idx) => (
              <li key={idx}>{renderValue(item, depth + 1)}</li>
            ))}
          </ul>
        );
      }

      // Это объект - рендерим как вложенную структуру
      return (
        <div style={{ marginLeft: depth > 0 ? "20px" : "0", marginTop: "5px" }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "5px" }}>
              <strong>{k}:</strong> {renderValue(v, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    // Примитивные значения
    if (typeof value === "boolean") {
      return formatBoolean(value);
    }
    return String(value);
  };

  const renderAttributes = (attrs) => {
    if (!attrs) return "—";

    try {
      const parsed = typeof attrs === "string" ? JSON.parse(attrs) : attrs;
      if (typeof parsed === "object" && parsed !== null) {
        // Фильтруем поля, которые не должны отображаться
        const fieldsToHide = new Set([
          "Полное_наименование",
          "Полное наименование",
          "full_name",
        ]);

        // Рекурсивная функция для фильтрации полей
        const filterFields = (obj) => {
          if (typeof obj !== "object" || obj === null) return obj;
          if (Array.isArray(obj)) return obj.map(filterFields);

          const filtered = {};
          for (const [key, value] of Object.entries(obj)) {
            if (!fieldsToHide.has(key)) {
              if (typeof value === "object" && value !== null) {
                filtered[key] = filterFields(value);
              } else {
                filtered[key] = value;
              }
            }
          }
          return filtered;
        };

        const filteredAttrs = filterFields(parsed);

        return (
          <div className="attributes-container">
            {Object.entries(filteredAttrs).map(([key, value]) => (
              <div
                key={key}
                className="attribute-item"
                style={{ marginBottom: "15px" }}
              >
                <strong style={{ display: "block", marginBottom: "5px" }}>
                  {translateKey(key)}:
                </strong>
                <div style={{ marginLeft: "10px" }}>{renderValue(value)}</div>
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
                        {formatStock(equipment.stock)}
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
                        {formatPriority(equipment.priority)}
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

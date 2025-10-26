"use client";

import { useState } from "react";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import { formatYears, getServiceTypeLabel } from "@/lib/format";

export default function ServicesTableClient({ rows }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState(rows);

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleServiceAdded = () => {
    // Перезагружаем страницу для получения обновленных данных
    window.location.reload();
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingService(null);
  };

  const handleServiceUpdated = () => {
    // Перезагружаем страницу для получения обновленных данных
    window.location.reload();
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">Услуги</h3>
          <button className="btn btn-primary btn-sm" onClick={handleAddService}>
            <i className="bi bi-plus-circle me-1"></i>
            Добавить услугу
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Название</th>
                <th>Тип услуги</th>
                <th>Описание</th>
                <th>Базовая цена</th>
                <th>Срок выполнения</th>
                <th>Гарантия</th>
                <th>Комментарий</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>{r.sku}</code>
                  </td>
                  <td>{r.title || "-"}</td>
                  <td>{getServiceTypeLabel(r.serviceType) || "-"}</td>
                  <td>{r.description || "-"}</td>
                  <td>
                    {r.basePrice
                      ? new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: r.currency || "RUB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(r.basePrice)
                      : "-"}
                  </td>
                  <td>{r.executionDays ? `${r.executionDays} дн.` : "-"}</td>
                  <td>{formatYears(r.warrantyYears)}</td>
                  <td>{r.comment || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditService(r)}
                      title="Редактировать услугу"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {services.length === 0 && <div className="text-muted">Нет данных.</div>}
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleServiceAdded}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleServiceUpdated}
        service={editingService}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import AddServiceModal from "./AddServiceModal";

export default function ServicesTableClient({ rows }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              </tr>
            </thead>
            <tbody>
              {services.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>{r.sku}</code>
                  </td>
                  <td>{r.title || "-"}</td>
                  <td>{r.serviceType || "-"}</td>
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
                  <td>{r.warrantyYears ? `${r.warrantyYears} лет` : "-"}</td>
                  <td>{r.comment || "-"}</td>
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
    </>
  );
}

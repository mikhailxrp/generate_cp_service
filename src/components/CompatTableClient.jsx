"use client";

import { useState, useEffect } from "react";
import AddCompatModal from "./AddCompatModal";
import EditCompatModal from "./EditCompatModal";
import { deleteCompat } from "@/app/actions/deleteCompat";
import { showToast } from "@/lib/toast";

export default function CompatTableClient({ rows: initialRows }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompat, setSelectedCompat] = useState(null);
  const [rows, setRows] = useState(initialRows || []);

  // Синхронизируем с initialRows при изменении
  useEffect(() => {
    if (initialRows) {
      setRows(initialRows);
    }
  }, [initialRows]);

  const handleAddCompat = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCompat = (compat) => {
    setSelectedCompat(compat);
    setIsEditModalOpen(true);
  };

  const handleDeleteCompat = async (compat) => {
    if (
      confirm(
        `Вы уверены, что хотите удалить совместимость "${compat.inverterSku}" ↔ "${compat.essSku}"?`
      )
    ) {
      try {
        const result = await deleteCompat(compat.id);
        if (result.success) {
          // Обновляем локальное состояние
          setRows((prevRows) => prevRows.filter((row) => row.id !== compat.id));
          showToast.success("Совместимость успешно удалена!");
        } else {
          showToast.error("Ошибка при удалении совместимости: " + result.error);
        }
      } catch (error) {
        showToast.error("Ошибка при удалении совместимости: " + error.message);
      }
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCompat(null);
  };

  const handleSuccess = (compatData) => {
    if (compatData) {
      // Проверяем, это новая совместимость или обновление существующей
      const existingIndex = rows.findIndex((row) => row.id === compatData.id);
      if (existingIndex >= 0) {
        // Обновляем существующую совместимость
        setRows((prevRows) =>
          prevRows.map((row, index) =>
            index === existingIndex ? compatData : row
          )
        );
        showToast.success("Совместимость успешно обновлена!");
      } else {
        // Добавляем новую совместимость в список
        setRows((prevRows) => [compatData, ...prevRows]);
        showToast.success("Совместимость успешно добавлена!");
      }
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">
            Совместимость (Инвертор ↔ ESS)
          </h3>
          <button className="btn btn-primary btn-sm" onClick={handleAddCompat}>
            <i className="bi bi-plus-circle me-1"></i>
            Добавить совместимость
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Инвертор (SKU)</th>
                <th>ESS (SKU)</th>
                <th>Совместимость</th>
                <th>Ограничения</th>
                <th>Комментарий</th>
                <th width="120">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>{r.inverterSku || ""}</code>
                  </td>
                  <td>
                    <code>{r.essSku || ""}</code>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.isCompatible ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {r.isCompatible ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td>{r.limits || ""}</td>
                  <td>{r.comment || ""}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleEditCompat(r)}
                        title="Редактировать"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteCompat(r)}
                        title="Удалить"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="text-muted">Нет данных.</div>}
      </div>

      <AddCompatModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
      />

      <EditCompatModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleSuccess}
        compat={selectedCompat}
      />
    </>
  );
}

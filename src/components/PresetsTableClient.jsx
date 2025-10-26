"use client";

import { useState, useEffect } from "react";
import AddPresetModal from "./AddPresetModal";
import EditPresetModal from "./EditPresetModal";
import { deletePreset } from "@/app/actions/deletePreset";
import { showToast } from "@/lib/toast";

export default function PresetsTableClient({ rows: initialRows }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [rows, setRows] = useState(initialRows || []);

  // Синхронизируем с initialRows при изменении
  useEffect(() => {
    if (initialRows) {
      setRows(initialRows);
    }
  }, [initialRows]);

  const handleAddPreset = () => {
    setIsAddModalOpen(true);
  };

  const handleEditPreset = (preset) => {
    setSelectedPreset(preset);
    setIsEditModalOpen(true);
  };

  const handleDeletePreset = async (preset) => {
    if (confirm(`Вы уверены, что хотите удалить пресет "${preset.useCase}"?`)) {
      try {
        const result = await deletePreset(preset.id);
        if (result.success) {
          // Обновляем локальное состояние
          setRows((prevRows) => prevRows.filter((row) => row.id !== preset.id));
          showToast.success("Пресет успешно удален!");
        } else {
          showToast.error("Ошибка при удалении пресета: " + result.error);
        }
      } catch (error) {
        showToast.error("Ошибка при удалении пресета: " + error.message);
      }
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPreset(null);
  };

  const handleSuccess = (presetData) => {
    if (presetData) {
      // Проверяем, это новый пресет или обновление существующего
      const existingIndex = rows.findIndex((row) => row.id === presetData.id);
      if (existingIndex >= 0) {
        // Обновляем существующий пресет
        setRows((prevRows) =>
          prevRows.map((row, index) =>
            index === existingIndex ? presetData : row
          )
        );
        showToast.success("Пресет успешно обновлен!");
      } else {
        // Добавляем новый пресет в список
        setRows((prevRows) => [presetData, ...prevRows]);
        showToast.success("Пресет успешно добавлен!");
      }
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">Пресеты</h3>
          <button className="btn btn-primary btn-sm" onClick={handleAddPreset}>
            <i className="bi bi-plus-circle me-1"></i>
            Добавить пресет
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Use case</th>
                <th>Диапазон кВтp</th>
                <th>PV-модули (SKU)</th>
                <th>Инвертор</th>
                <th>ESS</th>
                <th>PCS</th>
                <th>Крепёж</th>
                <th>Заметки</th>
                <th width="120">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.useCase || ""}</td>
                  <td>{r.rangeKwp || ""}</td>
                  <td>
                    {Array.isArray(r.pvModuleSkus)
                      ? r.pvModuleSkus.join(", ")
                      : r.pvModuleSkus || ""}
                  </td>
                  <td>{r.inverterSku || ""}</td>
                  <td>{r.essSku || ""}</td>
                  <td>{r.pcsSku || ""}</td>
                  <td>{r.mountSku || ""}</td>
                  <td>{r.notes || ""}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleEditPreset(r)}
                        title="Редактировать"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeletePreset(r)}
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

      <AddPresetModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
      />

      <EditPresetModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleSuccess}
        preset={selectedPreset}
      />
    </>
  );
}

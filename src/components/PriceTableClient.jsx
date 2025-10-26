"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fmtMoney, safe, titleByType } from "@/lib/format";
import EquipmentModal from "./EquipmentModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { showToast } from "@/lib/toast";

export default function PriceTableClient({
  typeCode,
  rows: initialRows,
  onRowsUpdate,
}) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rows, setRows] = useState(
    Array.isArray(initialRows) ? initialRows.filter((row) => row && row.id) : []
  );
  const [tableKey, setTableKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Обновляем rows при изменении initialRows
  useEffect(() => {
    if (Array.isArray(initialRows)) {
      const filteredRows = initialRows.filter((row) => row && row.id);
      // Проверяем, действительно ли данные изменились
      setRows((prevRows) => {
        if (
          prevRows.length !== filteredRows.length ||
          !prevRows.every((row, index) => row.id === filteredRows[index]?.id)
        ) {
          return filteredRows;
        }
        return prevRows;
      });
    }
  }, [initialRows]);

  // Функция для принудительного обновления таблицы
  const forceTableUpdate = useCallback(() => {
    setTableKey((prev) => prev + 1);
  }, []);

  // Функция для принудительного обновления компонента
  const forceComponentUpdate = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
    setTableKey((prev) => prev + 1);
  }, []);

  // Дополнительный эффект для отслеживания изменений в rows
  useEffect(() => {
    // Принудительно обновляем таблицу при изменении rows
    forceTableUpdate();
  }, [rows, forceTableUpdate]);

  // Дополнительный эффект для отслеживания изменений в tableKey
  useEffect(() => {
    // TableKey changed
  }, [tableKey]);

  // Дополнительный эффект для отслеживания изменений в forceUpdate
  useEffect(() => {
    // ForceUpdate changed
  }, [forceUpdate]);

  // Эффект для уведомления родительского компонента об изменениях
  useEffect(() => {
    if (onRowsUpdate && rows.length > 0) {
      onRowsUpdate(rows);
    }
  }, [rows, onRowsUpdate]);

  // Создаем стабильный массив отфильтрованных строк
  const filteredRows = useMemo(() => {
    const filtered = rows.filter((r) => r && r.id);
    return filtered;
  }, [rows, forceUpdate]);

  const handleRowClick = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleSaveEquipment = async (updatedEquipment) => {
    try {
      const response = await fetch("/api/equipment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEquipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении");
      }

      const result = await response.json();

      // Показываем уведомление об успехе
      showToast.success(result.message || "Оборудование успешно сохранено!");

      // Обновляем данные в таблице
      if (result.data && result.data.id) {
        setRows((prevRows) => {
          const updatedRows = prevRows.map((row) =>
            row.id === result.data.id ? result.data : row
          );
          return updatedRows;
        });

        // Принудительно обновляем таблицу
        forceTableUpdate();
      }

      // Обновляем выбранное оборудование, если оно было изменено
      if (selectedEquipment && selectedEquipment.id === result.data.id) {
        setSelectedEquipment(result.data);
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      showToast.error(`Ошибка: ${error.message}`);
      throw error;
    }
  };

  const handleCreateEquipment = async (newEquipment) => {
    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEquipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при создании");
      }

      const result = await response.json();

      // Добавляем новое оборудование в таблицу
      if (result.data && result.data.id) {
        // Создаем новый массив с новым оборудованием
        setRows((prevRows) => {
          const newRows = [result.data, ...prevRows];
          return newRows;
        });

        // Принудительно обновляем компонент
        forceComponentUpdate();

        // Дополнительная проверка через небольшую задержку
        setTimeout(() => {
          forceComponentUpdate();
        }, 100);
      }

      // Закрываем модальное окно создания
      setIsAddModalOpen(false);

      // Показываем уведомление об успехе после обновления состояния
      setTimeout(() => {
        showToast.success(result.message || "Оборудование успешно создано!");
      }, 100);

      // Дополнительная проверка через большую задержку
      setTimeout(() => {
        forceComponentUpdate();
      }, 200);
    } catch (error) {
      console.error("Ошибка при создании:", error);
      showToast.error(`Ошибка: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    try {
      const response = await fetch(`/api/equipment?id=${equipmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при удалении");
      }

      const result = await response.json();

      // Показываем уведомление об успехе
      showToast.success(result.message || "Оборудование успешно удалено!");

      // Удаляем оборудование из таблицы
      setRows((prevRows) => {
        const filteredRows = prevRows.filter((row) => row.id !== equipmentId);
        return filteredRows;
      });

      // Принудительно обновляем таблицу
      forceTableUpdate();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showToast.error(`Ошибка: ${error.message}`);
      throw error;
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">{titleByType(typeCode)}</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Добавить оборудование
          </button>
        </div>
        <div className="table-responsive">
          <table
            key={tableKey}
            className="table table-sm table-striped align-middle"
          >
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Наименование</th>
                <th>Цена</th>
                <th>Валюта</th>
                <th>Наличие</th>
                <th>Склад</th>
                <th>Поставка, дн</th>
                <th>Приоритет</th>
                <th>Спека</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} onClick={() => handleRowClick(r)}>
                  <td>
                    <code>{r.sku || "—"}</code>
                  </td>
                  <td>{r.title || "—"}</td>
                  <td>{fmtMoney(r.priceRub)}</td>
                  <td>{safe(r.currency, "RUB")}</td>
                  <td>{safe(r.stock)}</td>
                  <td>{safe(r.warehouseRegion)}</td>
                  <td>{safe(r.leadDays)}</td>
                  <td>{safe(r.priority, 0)}</td>
                  <td>
                    {r.specUrl ? (
                      <a
                        href={r.specUrl}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                      >
                        PDF
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="text-muted">Нет данных.</div>}
      </div>

      <EquipmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        equipment={selectedEquipment}
        onSave={handleSaveEquipment}
        onDelete={handleDeleteEquipment}
      />

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        typeCode={typeCode}
        onSave={handleCreateEquipment}
      />
    </>
  );
}

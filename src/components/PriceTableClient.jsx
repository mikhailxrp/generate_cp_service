"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fmtMoney, safe, titleByType } from "@/lib/format";
import EquipmentModal from "./EquipmentModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { showToast } from "@/lib/toast";
import { useUser } from "@/hooks/useUser";

export default function PriceTableClient({
  typeCode,
  rows: initialRows,
  onRowsUpdate,
}) {
  const { user } = useUser();
  const fileInputRef = useRef(null);
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

  // --- Импорт из CSV ---
  const detectDelimiter = (text) => {
    const candidates = [",", ";", "\t"]; // запятая, точка с запятой, таб
    let best = ",";
    let bestCount = -1;
    const firstLines = text.split(/\r?\n/).slice(0, 5);
    for (const d of candidates) {
      const counts = firstLines.map(
        (l) => (l.match(new RegExp(`\\${d}`, "g")) || []).length
      );
      const sum = counts.reduce((a, b) => a + b, 0);
      if (sum > bestCount) {
        bestCount = sum;
        best = d;
      }
    }
    return best;
  };

  const parseCsv = (text) => {
    const delimiter = detectDelimiter(text);
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headerRaw = lines[0];
    const headers = headerRaw.split(delimiter).map((h) => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map((p) => p.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = parts[idx] ?? "";
      });
      rows.push(obj);
    }
    return rows;
  };

  const toNumber = (val) => {
    if (val === undefined || val === null) return undefined;
    const s = String(val).replace(/\s/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const records = parseCsv(text);
      if (!Array.isArray(records) || records.length === 0) {
        showToast.error("CSV пуст или не распознан");
        return;
      }

      // известные поля price_items (английские и русские)
      const knownFields = new Set([
        "sku",
        "SKU",
        "title",
        "Наименование",
        "priceRub",
        "price_rub",
        "Цена",
        "Цена_базовая",
        "currency",
        "Валюта",
        "stock",
        "Наличие",
        "warehouseRegion",
        "warehouse_region",
        "Регион_склада",
        "leadDays",
        "lead_days",
        "Срок_поставки_дни",
        "priority",
        "Приоритет",
        "specUrl",
        "spec_url",
        "Ссылка_на_спеку",
        "comment",
        "Комментарий",
      ]);

      const created = [];
      let errors = 0;
      let lastError = null;
      for (const r of records) {
        // Маппинг русских названий колонок на английские
        const sku = (r.SKU ?? r.sku ?? "").trim();
        const title = (r.Наименование ?? r.title ?? "").trim();
        const priceRub = toNumber(
          r.Цена_базовая ?? r.Цена ?? r.priceRub ?? r.price_rub
        );
        if (!sku || !title || !Number.isFinite(priceRub)) {
          // пропускаем строки без обязательных полей
          continue;
        }

        const payload = {
          typeCode,
          sku,
          title,
          priceRub,
          currency: (r.Валюта ?? r.currency ?? "RUB").trim(),
          stock: toNumber(r.Наличие ?? r.stock),
          warehouseRegion:
            (
              r.Регион_склада ??
              r.warehouseRegion ??
              r.warehouse_region ??
              ""
            ).trim() || null,
          leadDays: toNumber(r.Срок_поставки_дни ?? r.leadDays ?? r.lead_days),
          priority: toNumber(r.Приоритет ?? r.priority) ?? 0,
          specUrl:
            (r.Ссылка_на_спеку ?? r.specUrl ?? r.spec_url ?? "").trim() || null,
          comment: (r.Комментарий ?? r.comment ?? "").trim() || null,
          attrs: {},
          isActive: 1,
        };

        // собрать остальные поля в attrs
        Object.keys(r).forEach((k) => {
          if (!knownFields.has(k)) {
            payload.attrs[k] = r[k];
          }
        });

        try {
          const resp = await fetch("/api/equipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data?.data) created.push(data.data);
          } else {
            const err = await resp.json().catch(() => ({}));
            errors += 1;
            lastError = err?.error || JSON.stringify(err);
          }
        } catch (err) {
          errors += 1;
          lastError = err?.message || String(err);
        }
      }

      if (created.length > 0) {
        setRows((prev) => {
          const skuToIndex = new Map(prev.map((row, idx) => [row.sku, idx]));
          const next = [...prev];
          for (const item of created) {
            const idx = skuToIndex.get(item.sku);
            if (idx !== undefined) {
              next[idx] = item;
            } else {
              next.unshift(item);
            }
          }
          return next;
        });
        showToast.success(`Импортировано: ${created.length}`);
        forceComponentUpdate();
      } else {
        const msg = lastError
          ? `Не удалось импортировать записи: ${lastError}`
          : "Не удалось импортировать записи";
        showToast.error(msg);
      }
    } finally {
      // сбрасываем инпут, чтобы можно было выбрать тот же файл снова
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">{titleByType(typeCode)}</h3>
          {user?.role === "admin" && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleImportClick}
                title="Импорт из CSV"
              >
                <i className="bi bi-upload me-1"></i>
                Импорт из CSV
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Добавить оборудование
              </button>
            </div>
          )}
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

      {/* hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

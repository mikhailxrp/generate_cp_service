"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fmtMoney } from "@/lib/format";
import EquipmentModal from "./EquipmentModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { showToast } from "@/lib/toast";
import { useUser } from "@/hooks/useUser";

export default function SoftwareTableClient({ rows: initialRows }) {
  const { user } = useUser();
  const fileInputRef = useRef(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [software, setSoftware] = useState(
    Array.isArray(initialRows) ? initialRows.filter((row) => row && row.id) : []
  );
  const [tableKey, setTableKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Обновляем software при изменении initialRows
  useEffect(() => {
    if (Array.isArray(initialRows)) {
      const filteredRows = initialRows.filter((row) => row && row.id);
      setSoftware((prevRows) => {
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

  // Дополнительный эффект для отслеживания изменений в software
  useEffect(() => {
    forceTableUpdate();
  }, [software, forceTableUpdate]);

  // Создаем стабильный массив отфильтрованных строк
  const filteredRows = useMemo(() => {
    return software.filter((r) => r && r.id);
  }, [software, forceUpdate]);

  // Функция для извлечения значений из attrs
  const getAttr = (attrs, key, fallback = "-") => {
    if (!attrs || typeof attrs !== "object") return fallback;
    return attrs[key] || fallback;
  };

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
      showToast.success(result.message || "ПО успешно сохранено!");

      if (result.data && result.data.id) {
        setSoftware((prevRows) => {
          const updatedRows = prevRows.map((row) =>
            row.id === result.data.id ? result.data : row
          );
          return updatedRows;
        });
        forceTableUpdate();
      }

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

      if (result.data && result.data.id) {
        setSoftware((prevRows) => {
          const newRows = [result.data, ...prevRows];
          return newRows;
        });
        forceComponentUpdate();
        setTimeout(() => {
          forceComponentUpdate();
        }, 100);
      }

      setIsAddModalOpen(false);
      setTimeout(() => {
        showToast.success(result.message || "ПО успешно создано!");
      }, 100);

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
      showToast.success(result.message || "ПО успешно удалено!");

      setSoftware((prevRows) => {
        const filteredRows = prevRows.filter((row) => row.id !== equipmentId);
        return filteredRows;
      });

      forceTableUpdate();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showToast.error(`Ошибка: ${error.message}`);
      throw error;
    }
  };

  // --- Импорт из CSV ---
  const detectDelimiter = (text) => {
    const candidates = [",", ";", "\t"];
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
    const str = String(val).trim().toLowerCase();
    if (
      str === "" ||
      str === "нет" ||
      str === "н/д" ||
      str === "-" ||
      str === "—" ||
      str === "n/a"
    ) {
      return undefined;
    }
    const s = String(val).replace(/\s/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const parseStockFlag = (val) => {
    if (val == null) return 0;
    const s = String(val).toLowerCase().trim();
    if (["да", "yes", "есть", "в наличии", "1", "true"].includes(s)) return 1;
    if (["нет", "no", "0", "false"].includes(s)) return 0;
    return 0;
  };

  const parsePriority = (val) => {
    if (val == null) return 0;
    const s = String(val).toLowerCase().trim();
    if (s.startsWith("низ")) return 1;
    if (s.startsWith("сред")) return 2;
    if (s.startsWith("выс")) return 3;
    const n = Number(s);
    if (Number.isFinite(n)) return n;
    return 0;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const toBool = (v) => {
    if (v == null) return false;
    const s = String(v).toLowerCase().trim();
    return ["да", "1", "yes", "true", "y"].includes(s);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const text = await file.text();
      const records = parseCsv(text);

      if (!Array.isArray(records) || records.length === 0) {
        showToast.error("CSV пуст или не распознан");
        return;
      }

      // Поля специфичные для DEMO (ПО)
      const demoSpecificFields = new Set([
        "Полное_наименование",
        "Наименование",
        "Тип_кровли",
        "Тип_системы",
        "Гибридная/Сетевая",
        "email",
        "password",
        "url_на приложение",
        "Сервис24_7",
        "Сегмент_Частник",
        "Сегмент_Юрлицо",
        "Бренд",
        "Категория",
        "Комментарий",
      ]);

      // Сначала соберем уникальные записи по комбинации (title + roofType + systemType)
      const uniqueRecordsMap = new Map();
      
      for (const r of records) {
        const title = String(
          r["Полное_наименование"] || r["Наименование"] || ""
        ).trim();

        // Пропускаем пустые строки
        if (!title) {
          continue;
        }

        const roofType = String(r["Тип_кровли"] || "").trim();
        const systemType = String(r["Тип_системы"] || "").trim();
        const gridType = String(r["Гибридная/Сетевая"] || "").trim();

        // Создаем уникальный ключ на основе title + roofType + gridType
        const uniqueKey = `${title}|||${roofType}|||${gridType}`.toLowerCase();
        
        // Если такой комбинации еще нет, добавляем
        if (!uniqueRecordsMap.has(uniqueKey)) {
          uniqueRecordsMap.set(uniqueKey, {
            title,
            roofType,
            systemType,
            gridType,
            email: r["email"] || null,
            password: r["password"] || null,
            appUrl: r["url_на приложение"] || null,
            service247: toBool(r["Сервис24_7"]),
            segmentB2C: toBool(r["Сегмент_Частник"]),
            segmentB2B: toBool(r["Сегмент_Юрлицо"]),
            brand: r["Бренд"] || null,
            category: r["Категория"] || null,
            comment: r["Комментарий"] || null,
          });
        }
      }

      const created = [];
      let errors = 0;
      let skipped = 0;
      let lastError = null;
      let index = 0;

      // Теперь обрабатываем уникальные записи
      for (const [uniqueKey, data] of uniqueRecordsMap) {
        index += 1;

        // Генерируем уникальный SKU по логике из скрипта
        const roofSlug = (data.roofType || "GEN").replace(/\s+/g, "_");
        const gridSlug = (data.gridType || "SYS").replace(/\s+/g, "_");
        let sku = `DEMO-${roofSlug}-${gridSlug}-${index}`;
        
        // Подрезаем до 100 символов
        if (sku.length > 100) sku = sku.slice(0, 100);

        // Структура attrs по логике из скрипта
        const attrs = {
          demo: {
            roof_type: data.roofType || null,
            system_type: data.systemType || null,
            grid_type: data.gridType || null,
            email: data.email,
            password: data.password,
            app_url: data.appUrl,
            service_24_7: data.service247,
            segment_b2c: data.segmentB2C,
            segment_b2b: data.segmentB2B,
          },
          meta: {
            brand: data.brand,
            raw_category: data.category,
          },
        };

        const payload = {
          typeCode: "demo",
          sku,
          title: data.title,
          priceRub: 0, // демо-доступы не продаём, цена 0
          currency: "RUB",
          stock: 1, // считаем, что всегда "доступно"
          priority: 0,
          warehouseRegion: null,
          leadDays: 0,
          specUrl: data.appUrl,
          comment: data.comment,
          attrs,
          isActive: 1,
        };

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
      
      skipped = records.length - uniqueRecordsMap.size;

      if (created.length > 0) {
        try {
          await fetch("/api/equipment/cleanup-duplicates", {
            method: "DELETE",
          });
        } catch (err) {
          // Игнорируем ошибки очистки дубликатов
        }

        setSoftware((prev) => {
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
        const msg =
          errors > 0
            ? `Импортировано: ${created.length} (ошибок: ${errors})`
            : `Импортировано: ${created.length}`;
        showToast.success(msg);
        forceComponentUpdate();
      } else {
        const msg = lastError
          ? `Не удалось импортировать записи: ${lastError}`
          : `Не удалось импортировать записи. Пропущено строк: ${skipped}`;
        showToast.error(msg);
      }
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const handleCleanupDuplicates = async () => {
    if (!confirm("Удалить дубликаты из базы данных?")) return;

    try {
      const resp = await fetch("/api/equipment/cleanup-duplicates", {
        method: "DELETE",
      });
      const data = await resp.json();

      if (resp.ok) {
        showToast.success(`Удалено дубликатов: ${data.deletedCount}`);
        forceComponentUpdate();
      } else {
        showToast.error(data.error || "Ошибка при очистке");
      }
    } catch (err) {
      showToast.error(`Ошибка: ${err.message}`);
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">ПО</h3>
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
                className="btn btn-outline-danger btn-sm"
                onClick={handleCleanupDuplicates}
                title="Удалить дубликаты"
              >
                <i className="bi bi-trash me-1"></i>
                Очистить дубликаты
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Добавить ПО
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
                <th>Полное наименование</th>
                <th>Тип кровли</th>
                <th>Гибридная/Сетевая</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} onClick={() => handleRowClick(r)}>
                  <td>
                    <code>{r.sku || "—"}</code>
                  </td>
                  <td>{r.title || "—"}</td>
                  <td>{getAttr(r.attrs?.demo, "roof_type")}</td>
                  <td>{getAttr(r.attrs?.demo, "grid_type")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {software.length === 0 && <div className="text-muted">Нет данных.</div>}
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
        typeCode="demo"
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

      {/* Loading overlay */}
      {isImporting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem 3rem",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
            }}
          >
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 500, color: "#333" }}>
              Импорт CSV...
            </div>
          </div>
        </div>
      )}
    </>
  );
}


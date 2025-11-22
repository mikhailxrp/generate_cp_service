"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fmtMoney } from "@/lib/format";
import EquipmentModal from "./EquipmentModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { showToast } from "@/lib/toast";
import { useUser } from "@/hooks/useUser";

export default function AdditionalServicesTableClient({ rows: initialRows }) {
  const { user } = useUser();
  const fileInputRef = useRef(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [additionalServices, setAdditionalServices] = useState(
    Array.isArray(initialRows) ? initialRows.filter((row) => row && row.id) : []
  );
  const [tableKey, setTableKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Обновляем additionalServices при изменении initialRows
  useEffect(() => {
    if (Array.isArray(initialRows)) {
      const filteredRows = initialRows.filter((row) => row && row.id);
      setAdditionalServices((prevRows) => {
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

  // Дополнительный эффект для отслеживания изменений в additionalServices
  useEffect(() => {
    forceTableUpdate();
  }, [additionalServices, forceTableUpdate]);

  // Создаем стабильный массив отфильтрованных строк
  const filteredRows = useMemo(() => {
    return additionalServices.filter((r) => r && r.id);
  }, [additionalServices, forceUpdate]);

  // Функция для извлечения значений из attrs
  const getAttr = (attrs, key, fallback = "-") => {
    if (!attrs || typeof attrs !== "object") return fallback;
    return attrs[key] || fallback;
  };

  // Функция для извлечения вложенных значений из attrs
  const getNestedAttr = (attrs, path, fallback = "-") => {
    if (!attrs || typeof attrs !== "object") return fallback;
    const keys = path.split(".");
    let value = attrs;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    return value || fallback;
  };

  // Функция для форматирования цены (проценты выводятся как есть)
  const formatPrice = (priceRub) => {
    if (!priceRub) return "-";
    
    // Проверяем, является ли значение процентом (строка с %)
    const priceStr = String(priceRub);
    if (priceStr.includes("%")) {
      return priceStr;
    }
    
    // Если число, проверяем диапазон
    const priceNum = Number(priceRub);
    if (!isNaN(priceNum)) {
      // Если число меньше 1 и больше 0, считаем это процентом в десятичном формате
      if (priceNum > 0 && priceNum < 1) {
        return `${(priceNum * 100).toFixed(0)}%`;
      }
      
      // Иначе форматируем как валюту
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(priceNum);
    }
    
    return priceStr;
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
      showToast.success(result.message || "Услуга успешно сохранена!");

      if (result.data && result.data.id) {
        setAdditionalServices((prevRows) => {
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
        setAdditionalServices((prevRows) => {
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
        showToast.success(result.message || "Услуга успешно создана!");
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
      showToast.success(result.message || "Услуга успешно удалена!");

      setAdditionalServices((prevRows) => {
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

  // "Пуленепробиваемый" парсер для цен с поддержкой процентов
  const toPrice = (v) => {
    if (v == null) return null;

    // Если это уже число (в т.ч. 0.2 из Excel-процента) — используем как есть
    if (typeof v === "number") {
      return v;
    }

    let str = String(v).replace(",", ".").trim();
    if (!str) return null;

    const hasPercent = str.includes("%");

    // Вытаскиваем первое число из строки: "20 % от суммы" → "20"
    const match = str.match(/[-+]?\d+(\.\d+)?/);
    if (!match) return null;

    const num = Number(match[0]);
    if (Number.isNaN(num)) return null;

    // Если в строке есть символ %, считаем, что это процент
    if (hasPercent) {
      return num / 100;
    }

    // Иначе — обычное число
    return num;
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
        "Стоимость_работ_1",
        "Стоимость_работ_2",
        "Стоимость работ 1",
        "Стоимость работ 2",
        "Бренд",
        "Категория",
        "Сервис24_7",
        "Полное_наименование",
      ]);

      const uniqueRecords = new Map();
      for (const r of records) {
        const sku = (r.SKU ?? r.sku ?? "").trim();
        if (sku) {
          uniqueRecords.set(sku, r);
        }
      }

      const created = [];
      let errors = 0;
      let skipped = 0;
      let lastError = null;
      for (const r of Array.from(uniqueRecords.values())) {
        const sku = (r.SKU ?? r.sku ?? "").trim();
        const title = (
          r.Наименование ?? 
          r["Полное_наименование"] ?? 
          r.title ?? 
          ""
        ).trim();
        
        const rawPrice = r.Цена_базовая ?? r.Цена ?? r.priceRub ?? r.price_rub;
        const priceRub = toPrice(rawPrice);

        if (!sku || !title) {
          skipped++;
          continue;
        }

        const payload = {
          typeCode: "sunhors",
          sku,
          title,
          priceRub: Number.isFinite(priceRub) ? priceRub : 0,
          currency: (r.Валюта ?? r.currency ?? "RUB").trim(),
          stock: parseStockFlag(r.Наличие ?? r.stock),
          warehouseRegion:
            (
              r.Регион_склада ??
              r.warehouseRegion ??
              r.warehouse_region ??
              ""
            ).trim() || null,
          leadDays: toNumber(r.Срок_поставки_дни ?? r.leadDays ?? r.lead_days),
          priority: parsePriority(r.Приоритет ?? r.priority),
          specUrl:
            (r.Ссылка_на_спеку ?? r.specUrl ?? r.spec_url ?? "").trim() || null,
          comment: (r.Комментарий ?? r.comment ?? "").trim() || null,
          attrs: {
            "Стоимость_работ_1": r["Стоимость_работ_1"] || r["Стоимость работ 1"] || "",
            "Стоимость_работ_2": r["Стоимость_работ_2"] || r["Стоимость работ 2"] || "",
            "Бренд": r["Бренд"] || null,
            "Категория": r["Категория"] || null,
            "Сервис24_7": r["Сервис24_7"] || null,
            "Полное_наименование": r["Полное_наименование"] || null,
          },
          isActive: 1,
        };

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
        try {
          await fetch("/api/equipment/cleanup-duplicates", {
            method: "DELETE",
          });
        } catch (err) {
          // Игнорируем ошибки очистки дубликатов
        }

        setAdditionalServices((prev) => {
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
          <h3 className="catalog-title-h3 mb-0">Доп Услуги</h3>
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
                Добавить услугу
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
                <th>Наименование услуги</th>
                <th>Цена базовая</th>
                <th>Стоимость работ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((item) => {
                const workCost = getAttr(item.attrs, "Стоимость_работ_1");
                return (
                  <tr key={item.id} onClick={() => handleRowClick(item)}>
                    <td>
                      <code>{item.sku}</code>
                    </td>
                    <td>{item.title || "-"}</td>
                    <td>{formatPrice(item.priceRub)}</td>
                    <td>{workCost !== "-" && workCost !== null && workCost !== undefined ? formatPrice(workCost) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {additionalServices.length === 0 && (
          <div className="text-muted">Нет данных.</div>
        )}
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
        typeCode="sunhors"
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


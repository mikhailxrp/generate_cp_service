"use client";

import { useState, useEffect, useRef } from "react";
import AddCompatModal from "./AddCompatModal";
import EditCompatModal from "./EditCompatModal";
import { deleteCompat } from "@/app/actions/deleteCompat";
import { showToast } from "@/lib/toast";

export default function CompatTableClient({ rows: initialRows }) {
  const fileInputRef = useRef(null);
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

  // --- Импорт CSV для совместимости ---
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
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map((p) => p.trim());
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = parts[idx] ?? ""));
      out.push(obj);
    }
    return out;
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const records = parseCsv(text);
      console.log(
        "[compat-import] file=",
        file.name,
        "records=",
        records.length
      );
      if (!records.length) {
        showToast.error("CSV пуст или не распознан");
        return;
      }
      const created = [];
      let errors = 0;
      let lastError = null;
      for (const r of records) {
        const inverterSku = (r.inverterSku ?? r.inverter_sku ?? "").trim();
        const essSku = (r.essSku ?? r.ess_sku ?? "").trim();
        if (!inverterSku || !essSku) continue;
        const isCompatibleRaw = (r.isCompatible ?? r.is_compatible ?? "1")
          .toString()
          .toLowerCase();
        const isCompatible = ["1", "true", "да", "+"].includes(isCompatibleRaw)
          ? "true"
          : "false";
        const limits = (r.limits ?? "").trim();
        const comment = (r.comment ?? "").trim();

        try {
          console.log("[compat-import] POST /api/compat payload=", {
            inverterSku,
            essSku,
            isCompatible,
            limits,
            comment,
          });
          const resp = await fetch("/api/compat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inverterSku,
              essSku,
              isCompatible,
              limits,
              comment,
            }),
          });
          console.log("[compat-import] response status=", resp.status);
          if (resp.ok) {
            const data = await resp.json();
            console.log("[compat-import] response json=", data);
            created.push({
              id: data?.data?.id ?? Math.random(),
              inverterSku,
              essSku,
              isCompatible: isCompatible === "true" ? 1 : 0,
              limits: limits || null,
              comment: comment || null,
            });
          } else {
            const err = await resp.json().catch(() => ({}));
            console.error("[compat-import] server error=", err);
            errors += 1;
            lastError = err?.error || JSON.stringify(err);
          }
        } catch (err) {
          console.error("[compat-import] exception=", err);
          errors += 1;
          lastError = err?.message || String(err);
        }
      }
      if (created.length > 0) {
        setRows((prev) => [...created, ...prev]);
        showToast.success(`Импортировано: ${created.length}`);
      } else {
        const msg = lastError
          ? `Не удалось импортировать записи: ${lastError}`
          : "Не удалось импортировать записи";
        showToast.error(msg);
      }
    } finally {
      e.target.value = "";
    }
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
              onClick={handleAddCompat}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Добавить совместимость
            </button>
          </div>
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

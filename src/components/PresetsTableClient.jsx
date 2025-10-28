"use client";

import { useState, useEffect, useRef } from "react";
import AddPresetModal from "./AddPresetModal";
import EditPresetModal from "./EditPresetModal";
import { deletePreset } from "@/app/actions/deletePreset";
import { showToast } from "@/lib/toast";

export default function PresetsTableClient({ rows: initialRows }) {
  const fileInputRef = useRef(null);
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

  // --- Импорт CSV для пресетов ---
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
    if (!lines.length) return [];
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
      if (!records.length) {
        showToast.error("CSV пуст или не распознан");
        return;
      }
      const created = [];
      let errors = 0;
      let lastError = null;
      for (const r of records) {
        const useCase = (r.useCase ?? r.use_case ?? "").trim();
        if (!useCase) continue;
        const rangeKwp = (r.rangeKwp ?? r.range_kwp ?? "").trim() || null;
        const inverterSku =
          (r.inverterSku ?? r.inverter_sku ?? "").trim() || null;
        const essSku = (r.essSku ?? r.ess_sku ?? "").trim() || null;
        const pcsSku = (r.pcsSku ?? r.pcs_sku ?? "").trim() || null;
        const mountSku = (r.mountSku ?? r.mount_sku ?? "").trim() || null;
        const notes = (r.notes ?? "").trim() || null;

        let pvModuleSkus = r.pvModuleSkus ?? r.pv_module_skus ?? "";
        if (typeof pvModuleSkus === "string" && pvModuleSkus.trim()) {
          // пытаемся распарсить как JSON, иначе — как список через запятую
          try {
            const parsed = JSON.parse(pvModuleSkus);
            if (Array.isArray(parsed)) pvModuleSkus = parsed;
            else
              pvModuleSkus = String(pvModuleSkus)
                .split(/[,;]/)
                .map((s) => s.trim())
                .filter(Boolean);
          } catch {
            pvModuleSkus = String(pvModuleSkus)
              .split(/[,;]/)
              .map((s) => s.trim())
              .filter(Boolean);
          }
        } else if (!Array.isArray(pvModuleSkus)) {
          pvModuleSkus = [];
        }

        const payload = {
          useCase,
          rangeKwp,
          pvModuleSkus,
          inverterSku,
          essSku,
          pcsSku,
          mountSku,
          notes,
        };
        try {
          const resp = await fetch("/api/presets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (resp.ok) {
            const data = await resp.json();
            created.push({ id: data?.data?.id ?? Math.random(), ...payload });
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
              onClick={handleAddPreset}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Добавить пресет
            </button>
          </div>
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

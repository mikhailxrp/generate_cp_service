"use client";

import { useState, useEffect, useRef } from "react";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import { formatYears, getServiceTypeLabel } from "@/lib/format";
import { showToast } from "@/lib/toast";

export default function ServicesTableClient({ rows: initialRows }) {
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState(initialRows || []);

  // Синхронизируем с initialRows при изменении
  useEffect(() => {
    if (initialRows) {
      setServices(initialRows);
    }
  }, [initialRows]);

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  // --- Импорт CSV для услуг ---
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

  const toNumber = (val) => {
    if (val === undefined || val === null) return undefined;
    const s = String(val).replace(/\s/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
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
        const sku = (r.sku ?? "").trim();
        const title = (r.title ?? "").trim();
        const serviceType = (r.serviceType ?? r.service_type ?? "").trim();
        const basePrice = toNumber(r.basePrice ?? r.base_price);
        if (!sku || !title || !serviceType || !Number.isFinite(basePrice))
          continue;
        const payload = {
          sku,
          title,
          serviceType,
          description: (r.description ?? "").trim() || null,
          basePrice,
          currency: (r.currency ?? "RUB").trim(),
          executionDays: toNumber(r.executionDays ?? r.execution_days),
          warrantyYears: toNumber(r.warrantyYears ?? r.warranty_years),
          comment: (r.comment ?? "").trim() || null,
        };
        try {
          const resp = await fetch("/api/services", {
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
        setServices((prev) => [...created, ...prev]);
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleServiceAdded = (serviceData) => {
    if (serviceData) {
      setServices((prevServices) => [serviceData, ...prevServices]);
      showToast.success("Услуга успешно добавлена!");
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingService(null);
  };

  const handleServiceUpdated = (serviceData) => {
    if (serviceData) {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceData.id ? serviceData : service
        )
      );
      showToast.success("Услуга успешно обновлена!");
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="catalog-title-h3 mb-0">Услуги</h3>
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
              onClick={handleAddService}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Добавить услугу
            </button>
          </div>
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

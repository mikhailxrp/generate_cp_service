"use client";

import { useState, useMemo } from "react";
import PriceTableClient from "./PriceTableClient";

export default function EquipmentTabs({ initialData }) {
  const [activeEquipmentTab, setActiveEquipmentTab] = useState("panels");
  const [data, setData] = useState(initialData);

  const equipmentTabs = [
    { id: "panels", label: "Панели", typeCode: "panel" },
    { id: "inverters", label: "Инверторы", typeCode: "inverter" },
    { id: "ess", label: "ESS", typeCode: "ess" },
    { id: "mounts", label: "Крепления", typeCode: "mount" },
    { id: "batteries", label: "Батареи", typeCode: "batt" },
    { id: "cables", label: "Кабели", typeCode: "cable" },
    { id: "connectors", label: "Коннекторы", typeCode: "connector" },
    { id: "switches", label: "Выключатели", typeCode: "pow_off" },
    { id: "fuses", label: "Предохранители", typeCode: "fuse" },
    { id: "uzips", label: "Узип", typeCode: "uzip" },
    { id: "elpanels", label: "Распред. Щиты", typeCode: "panel_ac" },
    { id: "lotki", label: "Лотки", typeCode: "lotki" },
    { id: "krep", label: "Крепеж", typeCode: "mount" },
    { id: "cpo_cs", label: "Лотки CPO90/CS90", typeCode: "cpo90" },
    { id: "smartmeters", label: "Счетчики", typeCode: "smartmeter" },
    { id: "transformers", label: "Трансформаторы", typeCode: "ct" },
  ];

  // Функция для обновления данных конкретной таблицы
  const handleRowsUpdate = (typeCode, newRows) => {
    setData((prevData) => ({
      ...prevData,
      [typeCode]: newRows,
    }));
  };

  // Создаем стабильные функции для каждого типа
  const handlePanelsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("panels", newRows),
    []
  );
  const handleInvertersUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("inverters", newRows),
    []
  );
  const handleEssUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("ess", newRows),
    []
  );
  const handleMountsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("mounts", newRows),
    []
  );
  const handleBatteriesUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("batteries", newRows),
    []
  );
  const handleCablesUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("cables", newRows),
    []
  );
  const handleConnectorsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("connectors", newRows),
    []
  );
  const handleSwitchesUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("switches", newRows),
    []
  );
  const handleFusesUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("fuses", newRows),
    []
  );
  const handleUzipsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("uzips", newRows),
    []
  );
  const handleElpanelsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("elpanels", newRows),
    []
  );
  const handleLotkiUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("lotki", newRows),
    []
  );
  const handleKrepUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("krep", newRows),
    []
  );
  const handleCpoCsUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("cpo_cs", newRows),
    []
  );
  const handleSmartmetersUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("smartmeters", newRows),
    []
  );
  const handleTransformersUpdate = useMemo(
    () => (newRows) => handleRowsUpdate("transformers", newRows),
    []
  );

  return (
    <div className="equipment-tabs-wrapper">
      {/* Вложенные табы для типов оборудования */}
      <ul className="nav nav-pills equipment-tabs mb-4">
        {equipmentTabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${
                activeEquipmentTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveEquipmentTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Контент вложенных табов */}
      <div className="equipment-tab-content">
        {activeEquipmentTab === "panels" && (
          <PriceTableClient
            typeCode="panel"
            rows={data.panels}
            onRowsUpdate={handlePanelsUpdate}
          />
        )}

        {activeEquipmentTab === "inverters" && (
          <PriceTableClient
            typeCode="inverter"
            rows={data.inverters}
            onRowsUpdate={handleInvertersUpdate}
          />
        )}

        {activeEquipmentTab === "ess" && (
          <PriceTableClient
            typeCode="ess"
            rows={data.ess}
            onRowsUpdate={handleEssUpdate}
          />
        )}

        {activeEquipmentTab === "mounts" && (
          <PriceTableClient
            typeCode="mount"
            rows={data.mounts}
            onRowsUpdate={handleMountsUpdate}
          />
        )}

        {activeEquipmentTab === "batteries" && (
          <PriceTableClient
            typeCode="batt"
            rows={data.batteries}
            onRowsUpdate={handleBatteriesUpdate}
          />
        )}

        {activeEquipmentTab === "cables" && (
          <PriceTableClient
            typeCode="cable"
            rows={data.cables}
            onRowsUpdate={handleCablesUpdate}
          />
        )}

        {activeEquipmentTab === "connectors" && (
          <PriceTableClient
            typeCode="connector"
            rows={data.connectors}
            onRowsUpdate={handleConnectorsUpdate}
          />
        )}

        {activeEquipmentTab === "switches" && (
          <PriceTableClient
            typeCode="pow_off"
            rows={data.switches}
            onRowsUpdate={handleSwitchesUpdate}
          />
        )}

        {activeEquipmentTab === "fuses" && (
          <PriceTableClient
            typeCode="fuse"
            rows={data.fuses}
            onRowsUpdate={handleFusesUpdate}
          />
        )}

        {activeEquipmentTab === "uzips" && (
          <PriceTableClient
            typeCode="uzip"
            rows={data.uzips}
            onRowsUpdate={handleUzipsUpdate}
          />
        )}

        {activeEquipmentTab === "elpanels" && (
          <PriceTableClient
            typeCode="panel_ac"
            rows={data.elpanels}
            onRowsUpdate={handleElpanelsUpdate}
          />
        )}

        {activeEquipmentTab === "lotki" && (
          <PriceTableClient
            typeCode="lotki"
            rows={data.lotki}
            onRowsUpdate={handleLotkiUpdate}
          />
        )}

        {activeEquipmentTab === "krep" && (
          <PriceTableClient
            typeCode="mount"
            rows={data.krep}
            onRowsUpdate={handleKrepUpdate}
          />
        )}

        {activeEquipmentTab === "cpo_cs" && (
          <PriceTableClient
            typeCode="cpo90"
            rows={data.cpo_cs}
            onRowsUpdate={handleCpoCsUpdate}
          />
        )}

        {activeEquipmentTab === "smartmeters" && (
          <PriceTableClient
            typeCode="smartmeter"
            rows={data.smartmeters}
            onRowsUpdate={handleSmartmetersUpdate}
          />
        )}

        {activeEquipmentTab === "transformers" && (
          <PriceTableClient
            typeCode="ct"
            rows={data.transformers}
            onRowsUpdate={handleTransformersUpdate}
          />
        )}
      </div>
    </div>
  );
}

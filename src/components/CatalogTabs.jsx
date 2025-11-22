"use client";

import { useState } from "react";
import EquipmentTabs from "./EquipmentTabs";
import PresetsTableClient from "./PresetsTableClient";
import CompatTableClient from "./CompatTableClient";
import ServicesTableClient from "./ServicesTableClient";
import AdditionalServicesTableClient from "./AdditionalServicesTableClient";
import SoftwareTableClient from "./SoftwareTableClient";

export default function CatalogTabs({
  equipmentData,
  presetsRows,
  compatRows,
  servicesRows,
  additionalServicesRows,
  softwareRows,
}) {
  const [activeTab, setActiveTab] = useState("equipment");

  const tabs = [
    { id: "equipment", label: "Оборудование" },
    { id: "presets", label: "Пресеты" },
    { id: "compatibility", label: "Совместимость" },
    { id: "services", label: "Услуги" },
    { id: "additional-services", label: "Доп Услуги" },
    { id: "software", label: "ПО" },
  ];

  return (
    <div className="catalog-tabs-wrapper">
      {/* Табы */}
      <ul className="nav nav-tabs catalog-tabs">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Контент табов */}
      <div className="tab-content catalog-tab-content">
        {activeTab === "equipment" && (
          <div className="tab-pane active">
            <EquipmentTabs initialData={equipmentData} />
          </div>
        )}

        {activeTab === "presets" && (
          <div className="tab-pane active">
            <PresetsTableClient rows={presetsRows} />
          </div>
        )}

        {activeTab === "compatibility" && (
          <div className="tab-pane active">
            <CompatTableClient rows={compatRows} />
          </div>
        )}

        {activeTab === "services" && (
          <div className="tab-pane active">
            <ServicesTableClient rows={servicesRows} />
          </div>
        )}

        {activeTab === "additional-services" && (
          <div className="tab-pane active">
            <AdditionalServicesTableClient rows={additionalServicesRows} />
          </div>
        )}

        {activeTab === "software" && (
          <div className="tab-pane active">
            <SoftwareTableClient rows={softwareRows} />
          </div>
        )}
      </div>
    </div>
  );
}

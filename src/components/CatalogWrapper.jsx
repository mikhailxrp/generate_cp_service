"use client";

import { useState, useEffect, useMemo } from "react";
import PriceTableClient from "./PriceTableClient";

export default function CatalogWrapper({ initialData }) {
  const [data, setData] = useState(initialData);

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

  return (
    <>
      {/* Блок 1: Оборудование по типам */}
      <PriceTableClient
        typeCode="panel"
        rows={data.panels}
        onRowsUpdate={handlePanelsUpdate}
      />
      <PriceTableClient
        typeCode="inverter"
        rows={data.inverters}
        onRowsUpdate={handleInvertersUpdate}
      />
      <PriceTableClient
        typeCode="ess"
        rows={data.ess}
        onRowsUpdate={handleEssUpdate}
      />
      <PriceTableClient
        typeCode="mount"
        rows={data.mounts}
        onRowsUpdate={handleMountsUpdate}
      />
    </>
  );
}

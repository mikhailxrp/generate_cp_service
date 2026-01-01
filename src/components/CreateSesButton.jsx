"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { fmtMoney, safe } from "@/lib/format";
import { saveBomAndServicesAction } from "@/app/actions/saveBomAndServices";
import { savePaybackDataAction } from "@/app/actions/savePaybackData";
import { saveSummaryAction } from "@/app/actions/saveSummary";
import TransportAndTravelTable from "@/components/TransportAndTravelTable";
import { calculatePayback, formatNumber, formatMoney } from "@/lib/payback";

// Функция форматирования цены услуги (проценты или рубли)
const formatServicePrice = (priceRub) => {
  if (!priceRub && priceRub !== 0) return "-";

  // Проверяем, является ли значение процентом (строка с %)
  const priceStr = String(priceRub);
  if (priceStr.includes("%")) {
    return priceStr;
  }

  // Если число, проверяем диапазон
  const priceNum = Number(priceRub);
  if (!isNaN(priceNum)) {
    // Если число меньше 1 и больше или равно 0, считаем это процентом в десятичном формате
    if (priceNum >= 0 && priceNum < 1) {
      return `${(priceNum * 100).toFixed(0)}%`;
    }

    // Иначе форматируем как валюту
    return fmtMoney(priceNum);
  }

  return priceStr;
};

// Компонент модального окна для выбора услуг
function ServicesSelectionModal({ onClose, onSelect }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Загрузка услуг при открытии модального окна
  React.useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/equipment/by-type?typeCode=sunhors`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.items || []);
        } else {
          showToast.error("Ошибка загрузки услуг");
          setServices([]);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showToast.error("Ошибка загрузки услуг");
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Фильтрация по поисковому запросу
  const filteredServices = services.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Добавить услугу</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Поиск */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Поиск по наименованию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Список услуг */}
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "400px" }}>
                <table className="table table-hover table-sm">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Наименование</th>
                      <th>SKU</th>
                      <th>Цена базовая</th>
                      <th>Стоимость работ</th>
                      <th style={{ width: "100px" }}>Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Услуги не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((item) => {
                        const workCost =
                          item.attrs?.Стоимость_работ_1 ||
                          item.attrs?.bos?.work_cost_1;
                        return (
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>
                              <small className="text-muted">{item.sku}</small>
                            </td>
                            <td>{formatServicePrice(item.priceRub)}</td>
                            <td>
                              {workCost ? formatServicePrice(workCost) : "-"}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => onSelect(item)}
                              >
                                <i className="bi bi-plus-circle me-1"></i>
                                Добавить
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент модального окна для выбора оборудования
function EquipmentSelectionModal({ onClose, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState("panel");
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "panel", label: "Панели" },
    { id: "inverter", label: "Инверторы" },
    { id: "ess", label: "ESS" },
    { id: "mount", label: "Крепления" },
    { id: "batt", label: "Батареи" },
    { id: "cable", label: "Кабели" },
    { id: "connector", label: "Коннекторы" },
    { id: "pow_off", label: "Выключатели" },
    { id: "fuse", label: "Предохранители" },
    { id: "uzip", label: "Узип" },
    { id: "panel_ac", label: "Распред. Щиты" },
    { id: "lotki", label: "Лотки" },
    { id: "mount", label: "Крепеж" },
    { id: "cpo90", label: "Лотки CPO90" },
    { id: "smartmeter", label: "Счетчики" },
    { id: "ct", label: "Трансформаторы" },
  ];

  // Функция для получения цены в зависимости от типа оборудования
  const getPriceByType = (item, typeCode) => {
    // priceRub всегда содержит цену (приходит как строка из БД)
    return item.priceRub || "0";
  };

  // Загрузка оборудования при изменении категории
  React.useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/equipment/by-type?typeCode=${selectedCategory}`
        );
        if (response.ok) {
          const data = await response.json();
          setEquipment(data.items || []);
        } else {
          showToast.error("Ошибка загрузки оборудования");
          setEquipment([]);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showToast.error("Ошибка загрузки оборудования");
        setEquipment([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, [selectedCategory]);

  // Фильтрация по поисковому запросу и исключение услуг (unit === "service")
  const filteredEquipment = equipment.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.unit !== "service"
  );

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Добавить оборудование</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Выбор категории */}
            <div className="mb-3">
              <label className="form-label fw-bold">Категория:</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn btn-sm ${
                      selectedCategory === cat.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Поиск */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Поиск по наименованию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Список оборудования */}
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "400px" }}>
                <table className="table table-hover table-sm">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Наименование</th>
                      <th>SKU</th>
                      <th>Цена</th>
                      <th>Стоимость работ</th>
                      <th style={{ width: "100px" }}>Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Оборудование не найдено
                        </td>
                      </tr>
                    ) : (
                      filteredEquipment.map((item) => {
                        const workCost =
                          item.attrs?.Стоимость_работ_1 ||
                          item.attrs?.bos?.work_cost_1;
                        return (
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>
                              <small className="text-muted">{item.sku}</small>
                            </td>
                            <td>
                              {fmtMoney(getPriceByType(item, selectedCategory))}
                            </td>
                            <td>{workCost ? fmtMoney(workCost) : "-"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => onSelect(item)}
                              >
                                <i className="bi bi-plus-circle me-1"></i>
                                Добавить
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateSesButton({ id, cpData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);

  const { servicesData, bomData, transportData } = cpData;

  // Локальное управление BOM и Services
  const [localBomData, setLocalBomData] = useState(bomData || []);
  const [localServicesData, setLocalServicesData] = useState(
    servicesData || []
  );
  const [localTransportData, setLocalTransportData] = useState(
    transportData || null
  );

  // Проверяем, есть ли данные из cpData
  const hasCpData = bomData && bomData.length > 0;

  // Синхронизация локального состояния с bomData/servicesData или responseData
  React.useEffect(() => {
    if (bomData && bomData.length > 0) {
      // Фильтруем только оборудование (не услуги)
      const equipment = bomData.filter((item) => item.unit !== "service");
      setLocalBomData(equipment);
    }

    if (servicesData && servicesData.length > 0) {
      setLocalServicesData(servicesData);
    }
  }, [bomData, servicesData]);

  // Синхронизация с responseData
  React.useEffect(() => {
    // Проверяем сначала fullBom (новая структура), потом bom (старая)
    const bomSource = responseData?.fullBom || responseData?.bom;

    if (bomSource && !hasCpData) {
      // Фильтруем только оборудование (не услуги)
      const equipment = bomSource.filter(
        (item) =>
          item.unit !== "service" &&
          item.componentCode !== "service_installation" &&
          item.componentCode !== "service_commissioning" &&
          item.componentCode !== "service_support" &&
          item.role !== "service_installation" &&
          item.role !== "service_commissioning" &&
          item.role !== "service_support"
      );

      // Обогащаем оборудование размерами и стоимостью работ из selectedPanel и inverter
      const enrichedEquipment = equipment.map((item) => {
        let enrichedItem = { ...item };

        // Сохраняем workCost1 из responseData.bos.bom если есть
        if (item.workCost1) {
          enrichedItem.workCost = parseFloat(item.workCost1 || 0);
        }

        // Проверяем, это панель?
        if (responseData?.selectedPanel?.sku === item.sku) {
          const panelAttrs = responseData.selectedPanel.attrs;
          // Пробуем разные варианты хранения размеров
          let dimensions =
            panelAttrs?.["Размеры_мм(ДxШxВ)"] ||
            panelAttrs?.["Размеры_мм(Д×Ш×В)"] ||
            panelAttrs?.["Размеры_мм(Д×Ш×Т)"] ||
            panelAttrs?.mechanical?.dimensions_mm ||
            panelAttrs?.dimensions_mm ||
            null;

          // Сохраняем стоимость работ
          const workCost = parseFloat(panelAttrs?.Стоимость_работ_1 || 0);

          enrichedItem.dimensions = dimensions;
          if (workCost > 0) enrichedItem.workCost = workCost;
        }

        // Проверяем, это инвертор?
        if (responseData?.inverter?.sku === item.sku) {
          const inverterAttrs = responseData.inverter.attrs;
          // Пробуем разные варианты хранения размеров
          let dimensions =
            inverterAttrs?.["Размеры_мм(ДxШxГ)"] ||
            inverterAttrs?.["Размеры_мм(Д×Ш×Г)"] ||
            inverterAttrs?.["Размеры_мм(Д×Ш×В)"] ||
            inverterAttrs?.mechanical?.dimensions_mm ||
            inverterAttrs?.dimensions_mm ||
            null;

          // Сохраняем стоимость работ
          const workCost = parseFloat(inverterAttrs?.Стоимость_работ_1 || 0);

          enrichedItem.dimensions = dimensions;
          if (workCost > 0) enrichedItem.workCost = workCost;
        }

        return enrichedItem;
      });

      setLocalBomData(enrichedEquipment);
    }
  }, [responseData, hasCpData]);

  // Функция удаления позиции из BOM (по SKU для надежности)
  const handleRemoveBomItem = (itemSku) => {
    setLocalBomData((prev) => prev.filter((item) => item.sku !== itemSku));
    showToast.success("Позиция удалена");
  };

  // Функция для получения цены в зависимости от типа оборудования
  const getPriceByType = (item, typeCode) => {
    // priceRub всегда содержит цену (приходит как строка из БД)
    return item.priceRub || "0";
  };

  // Функция добавления оборудования в BOM
  const handleAddEquipment = (equipment) => {
    const correctPrice = getPriceByType(equipment, equipment.typeCode);

    // Извлекаем размеры и workCost в зависимости от типа оборудования
    let dimensions = null;
    let workCost = 0;

    if (equipment.attrs) {
      const attrs =
        typeof equipment.attrs === "string"
          ? JSON.parse(equipment.attrs)
          : equipment.attrs;

      // Извлекаем стоимость работ
      workCost = parseFloat(
        attrs?.Стоимость_работ_1 || attrs?.bos?.work_cost_1 || 0
      );

      // Для панелей - пробуем разные варианты
      if (equipment.typeCode === "panel") {
        dimensions =
          attrs["Размеры_мм(ДxШxВ)"] ||
          attrs["Размеры_мм(Д×Ш×В)"] ||
          attrs["Размеры_мм(Д×Ш×Т)"] ||
          attrs.mechanical?.dimensions_mm ||
          attrs.dimensions_mm ||
          null;
      }

      // Для инверторов - пробуем разные варианты
      if (equipment.typeCode === "inverter") {
        dimensions =
          attrs["Размеры_мм(ДxШxГ)"] ||
          attrs["Размеры_мм(Д×Ш×Г)"] ||
          attrs["Размеры_мм(Д×Ш×В)"] ||
          attrs.mechanical?.dimensions_mm ||
          attrs.dimensions_mm ||
          null;
      }
    }

    const newItem = {
      name: equipment.title,
      title: equipment.title,
      qty: 1,
      quantity: 1,
      unitPriceRub: parseFloat(correctPrice),
      price: parseFloat(correctPrice),
      priceRub: parseFloat(correctPrice),
      basePrice: parseFloat(correctPrice),
      sku: equipment.sku,
      unit: equipment.unit || "шт",
      typeCode: equipment.typeCode,
      dimensions: dimensions,
      workCost: workCost, // Добавляем workCost для сохранения в БД
    };
    setLocalBomData((prev) => [...prev, newItem]);
    showToast.success("Оборудование добавлено");
    setShowEquipmentModal(false);
  };

  // Функция добавления услуги в Services
  const handleAddService = (service) => {
    const newService = {
      name: service.title,
      title: service.title,
      quantity: 1,
      price: parseFloat(service.priceRub || 0),
      basePrice: parseFloat(service.priceRub || 0),
      sku: service.sku,
      description: service.comment || "",
      typeCode: service.typeCode,
    };
    setLocalServicesData((prev) => [...prev, newService]);
    showToast.success("Услуга добавлена");
    setShowServicesModal(false);
  };

  // Функция удаления услуги из Services
  const handleRemoveServiceItem = (serviceSku) => {
    setLocalServicesData((prev) =>
      prev.filter((item) => item.sku !== serviceSku)
    );
    showToast.success("Услуга удалена");
  };

  // Функция изменения количества услуги
  const handleServiceQuantityChange = (serviceSku, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty < 0) return;

    setLocalServicesData((prev) => {
      const updated = prev.map((item) =>
        item.sku === serviceSku ? { ...item, quantity: qty } : item
      );
      return updated;
    });
  };

  // Функция изменения цены услуги
  const handleServicePriceChange = (serviceSku, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;

    setLocalServicesData((prev) => {
      const updated = prev.map((item) =>
        item.sku === serviceSku
          ? {
              ...item,
              price: price,
              basePrice: price,
            }
          : item
      );
      return updated;
    });
  };

  // Функция изменения количества оборудования (по SKU для надежности)
  const handleQuantityChange = (itemSku, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty < 0) return;

    setLocalBomData((prev) => {
      const updated = prev.map((item) =>
        item.sku === itemSku ? { ...item, qty: qty, quantity: qty } : item
      );
      return updated;
    });
  };

  // Функция изменения цены оборудования (по SKU для надежности)
  const handlePriceChange = (itemSku, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;

    setLocalBomData((prev) => {
      const updated = prev.map((item) =>
        item.sku === itemSku
          ? {
              ...item,
              priceRub: price,
              unitPriceRub: price,
              price: price,
              basePrice: price,
            }
          : item
      );
      return updated;
    });
  };

  // Функция изменения стоимости работ оборудования (по SKU для надежности)
  const handleWorkCostChange = (itemSku, newWorkCost) => {
    const workCost = parseFloat(newWorkCost);
    if (isNaN(workCost) || workCost < 0) return;

    setLocalBomData((prev) => {
      const updated = prev.map((item) =>
        item.sku === itemSku
          ? {
              ...item,
              workCost: workCost,
              workCost1: workCost, // Для совместимости с разными форматами
            }
          : item
      );
      return updated;
    });
  };

  const handleCreateSes = async () => {
    if (!id) {
      showToast.error("ID не найден");
      return;
    }

    setIsLoading(true);
    setErrorData(null); // Сбрасываем ошибку при новом запросе

    try {
      // Добавляем таймаут для запроса
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 секунд

      let response;
      try {
        response = await fetch("https://sunhorse.ru/webhook/create-ses-v2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

      // Проверяем HTTP статус 422
      if (response.status === 422) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          if (text.trim()) {
            try {
              const data = JSON.parse(text);

              // Проверяем, есть ли ошибка в ответе
              if (data.status === "error") {
                // Формируем объект ошибки с правильными полями
                setErrorData({
                  title: "Ошибка при создании комплекта СЭС",
                  reason: data.reason,
                });
                return;
              }
            } catch (parseError) {
              console.error("Ошибка парсинга JSON при 422:", parseError);
              setErrorData({
                reason: "Ошибка при обработке ответа сервера",
                hints: [],
              });
              return;
            }
          }
        }
        setErrorData({
          reason: "Ошибка валидации данных",
          hints: [],
        });
        return;
      }

      if (response.ok) {
        showToast.success("Запрос успешно отправлен!");

        // Проверяем, есть ли контент для парсинга
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();

          if (text.trim()) {
            try {
              const data = JSON.parse(text);

              // Проверяем, есть ли ошибка в ответе
              if (
                Array.isArray(data) &&
                data.length > 0 &&
                data[0].status === "error"
              ) {
                const errorInfo = data[0];

                // Формируем объект ошибки с правильными полями
                setErrorData({
                  reason:
                    errorInfo.reason || "Ошибка при создании комплекта СЭС",
                  hints: errorInfo.hints || [],
                });
                return;
              }

              // Обрабатываем структуру ответа
              if (Array.isArray(data) && data.length > 0) {
                // Если пришел массив, берем первый элемент
                setResponseData(data[0]);

                // Сохраняем summary если есть
                if (data[0].summary) {
                  await saveSummaryAction(id, data[0].summary);
                }
              } else if (data && typeof data === "object") {
                // Если пришел объект
                setResponseData(data);

                // Сохраняем summary если есть
                if (data.summary) {
                  await saveSummaryAction(id, data.summary);
                }
              } else {
                showToast.error("Получены данные в неожиданном формате");
              }
            } catch (parseError) {
              showToast.error("Ошибка при обработке ответа сервера");
            }
          } else {
            showToast.success("Запрос выполнен, но данных не получено");
          }
        } else {
          showToast.success("Запрос выполнен");
        }
      } else {
        showToast.error("Ошибка при отправке запроса");
      }
    } catch (error) {
      console.error("Ошибка:", error);

      // Обработка различных типов ошибок
      if (error.name === "AbortError") {
        showToast.error("Превышено время ожидания ответа от сервера (180 сек)");
        setErrorData({
          reason: "Превышено время ожидания ответа от сервера",
          hints: [
            "Попробуйте повторить запрос позже",
            "Проверьте стабильность интернет-соединения",
          ],
        });
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        showToast.error("Ошибка подключения к серверу");
        setErrorData({
          reason: "Не удалось подключиться к серверу (ERR_CONNECTION_RESET)",
          hints: [
            "Проверьте подключение к интернету",
            "Сервер может быть временно недоступен",
            "Попробуйте повторить запрос через несколько минут",
          ],
        });
      } else {
        showToast.error("Произошла ошибка при отправке запроса");
        setErrorData({
          reason: error.message || "Неизвестная ошибка",
          hints: ["Попробуйте обновить страницу и повторить запрос"],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      const price = parseFloat(
        item.priceRub || item.unitPriceRub || item.price || item.basePrice || 0
      );
      const quantity = parseFloat(item.qty || item.quantity || 1);
      const itemTotal = price * quantity;

      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  // Функция расчета итоговой стоимости услуг с учетом процентов
  const calculateServicesTotal = (services) => {
    if (!services || !Array.isArray(services)) return 0;

    // Базовая стоимость СЭС = оборудование + монтаж (без услуг)
    const equipmentCost = calculateTotal(localBomData || []);
    const installationCost = calculateInstallationCost();
    const baseSESCost = equipmentCost + installationCost;

    return services.reduce((total, item) => {
      const price = parseFloat(item.price || item.basePrice || 0);
      const quantity = parseFloat(item.quantity || 1);

      // Если цена меньше 1, это процент от БАЗОВОЙ стоимости СЭС (оборудование + монтаж)
      const isPercentage = price >= 0 && price < 1;
      let itemTotal;
      if (isPercentage) {
        // Процент считается от базовой стоимости, а не от суммы с другими услугами
        itemTotal = quantity * (price * baseSESCost);
      } else {
        itemTotal = quantity * price;
      }

      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  // Функция получения стоимости работ для элемента
  const getWorkCostForItem = (itemSku) => {
    // Сначала проверяем сам элемент в localBomData (если данные загружены из БД)
    const localItem = localBomData?.find((item) => item.sku === itemSku);
    if (localItem?.workCost || localItem?.workCost1) {
      return parseFloat(localItem.workCost || localItem.workCost1 || 0);
    }

    // Если не нашли в localBomData, ищем в responseData.bos.bom
    if (responseData?.bos?.bom) {
      const bomItem = responseData.bos.bom.find((item) => item.sku === itemSku);
      if (bomItem) {
        return parseFloat(bomItem.workCost1 || 0);
      }
    }

    // Проверяем, это инвертор?
    if (responseData?.inverter?.sku === itemSku) {
      return parseFloat(responseData.inverter.attrs?.Стоимость_работ_1 || 0);
    }

    // Проверяем, это панель?
    if (responseData?.selectedPanel?.sku === itemSku) {
      return parseFloat(
        responseData.selectedPanel.attrs?.Стоимость_работ_1 || 0
      );
    }

    return 0;
  };

  // Функция для обогащения bomData стоимостью работ из БД
  const enrichBomDataWithWorkCost = async (bomData) => {
    if (!bomData || bomData.length === 0) return bomData;

    // Создаем массив промисов для загрузки данных оборудования
    const enrichedItems = await Promise.all(
      bomData.map(async (item) => {
        // Если workCost уже есть, пропускаем
        if (item.workCost || item.workCost1) {
          return item;
        }

        try {
          // Загружаем данные оборудования из API по SKU
          const response = await fetch(
            `/api/equipment/by-sku?sku=${encodeURIComponent(item.sku)}`
          );
          if (!response.ok) {
            console.warn(`Не удалось загрузить данные для SKU: ${item.sku}`);
            return item;
          }

          const data = await response.json();
          if (!data.success || !data.item) {
            return item;
          }

          const equipment = data.item;

          // Извлекаем workCost из attrs
          let workCost = 0;
          if (equipment.attrs) {
            const attrs =
              typeof equipment.attrs === "string"
                ? JSON.parse(equipment.attrs)
                : equipment.attrs;

            workCost = parseFloat(
              attrs?.Стоимость_работ_1 || attrs?.bos?.work_cost_1 || 0
            );
          }

          // Возвращаем обогащенный элемент
          return {
            ...item,
            workCost: workCost,
          };
        } catch (error) {
          console.error(
            `Ошибка при загрузке данных для SKU ${item.sku}:`,
            error
          );
          return item;
        }
      })
    );

    return enrichedItems;
  };

  // Функция расчета транспортных расходов
  const calculateTransportCost = () => {
    // Если транспортные расходы не нужны
    if (cpData?.transportCosts !== "yes") {
      return 0;
    }

    // Если нет данных о транспорте, возвращаем 0
    if (!localTransportData) {
      return 0;
    }

    // Возвращаем стоимость с НДС
    return parseFloat(localTransportData.totalCost || 0);
  };

  // Функция расчета стоимости монтажа СЭС
  const calculateInstallationCost = () => {
    let totalInstallationCost = 0;

    // Если есть данные из БД (hasCpData), считаем из localBomData
    if (hasCpData && localBomData && localBomData.length > 0) {
      totalInstallationCost = localBomData.reduce((sum, item) => {
        const workCost = getWorkCostForItem(item.sku);
        const qty = parseFloat(item.qty || item.quantity || 1);
        return sum + workCost * qty;
      }, 0);
      return totalInstallationCost;
    }

    // Иначе считаем из responseData (данные с сервера)

    // 1. Берем стоимость работ из bos.bom (workCost1)
    if (responseData?.bos?.bom) {
      totalInstallationCost += responseData.bos.bom.reduce((sum, item) => {
        const workCost = parseFloat(item.workCost1 || 0);
        const qty = parseFloat(item.qty || 1);
        return sum + workCost * qty;
      }, 0);
    }

    // 2. Добавляем стоимость работ инвертора
    if (responseData?.inverter?.attrs?.Стоимость_работ_1) {
      totalInstallationCost += parseFloat(
        responseData.inverter.attrs.Стоимость_работ_1
      );
    }

    // 3. Добавляем стоимость работ панелей (умножаем на количество панелей)
    if (
      responseData?.selectedPanel?.attrs?.Стоимость_работ_1 &&
      responseData?.panelConfig?.totalPanels
    ) {
      const panelWorkCost = parseFloat(
        responseData.selectedPanel.attrs.Стоимость_работ_1
      );
      const totalPanels = parseFloat(responseData.panelConfig.totalPanels);
      totalInstallationCost += panelWorkCost * totalPanels;
    }

    return totalInstallationCost;
  };

  // Расчёт окупаемости по новой логике (Excel-таблица "Окупаемость")
  const getPaybackResult = React.useCallback(() => {
    if (!cpData) return null;

    // Используем localBomData и localServicesData — актуальное состояние
    const equipmentCost = calculateTotal(localBomData || []);
    const installationCost = calculateInstallationCost();
    const servicesCost = calculateServicesTotal(localServicesData || []);
    const totalCost = equipmentCost + installationCost + servicesCost;

    if (totalCost <= 0) return null;

    // Годовая генерация: totalAnnualGeneration хранится в тысячах кВт·ч
    const annualGeneration =
      (parseFloat(cpData.totalAnnualGeneration) || 0) * 1000;
    const tariff = parseFloat(cpData.priceKwh) || 10;

    if (annualGeneration <= 0) return null;

    // Формируем объект data для calculatePayback
    const paybackInput = {
      project: {
        paybackData: {
          annualGeneration, // кВт·ч в первый год
          systemCost: totalCost, // общая стоимость СЭС (оборудование + монтаж + услуги)
          tariffYear1: tariff, // тариф в первый год
          // Остальные параметры берутся по умолчанию из функции
        },
      },
    };

    return calculatePayback(paybackInput);
  }, [cpData, localBomData, localServicesData, responseData]);

  const paybackResult = getPaybackResult();

  const handleGenerateKP = async () => {
    if (!responseData || !id) {
      showToast.error("Нет данных для генерации КП");
      return;
    }

    setIsSaving(true);
    try {
      // Обогащаем bomData стоимостью работ перед сохранением
      const enrichedBomData = await enrichBomDataWithWorkCost(
        localBomData || []
      );

      // Рассчитываем общую стоимость проекта
      const equipmentCost = calculateTotal(enrichedBomData);
      const installationCost = calculateInstallationCost();
      const servicesCost = calculateServicesTotal(localServicesData || []);
      const transportCost = calculateTransportCost();
      const totalCost =
        equipmentCost + installationCost + servicesCost + transportCost;

      await saveBomAndServicesAction(
        id,
        enrichedBomData,
        localServicesData || [],
        localTransportData,
        totalCost
      );

      // Сохраняем результаты расчета окупаемости
      if (paybackResult) {
        await savePaybackDataAction(id, paybackResult);
      }

      // Сохраняем summary если есть
      if (responseData?.summary) {
        await saveSummaryAction(id, responseData.summary);
      }

      showToast.success("КП сгенерирован!");
      router.push(`/preview?id=${id}`);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      showToast.error("Ошибка при сохранении данных КП");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {!responseData && !hasCpData && !errorData && (
        <div className="btn-wrapper mt-4 text-center">
          <button
            className="btn btn-primary"
            onClick={handleCreateSes}
            disabled={isLoading}
          >
            {isLoading ? "Отправка..." : "Собрать коплект СЭС"}
          </button>
        </div>
      )}

      {/* Блок с ошибкой */}
      {errorData && (
        <div className="mt-4">
          <div className="alert alert-danger" role="alert">
            <h5 className="alert-heading">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Ошибка при создании комплекта СЭС
            </h5>
            <p className="mb-2">
              <strong>Причина:</strong> {errorData.reason}
            </p>
            {errorData.hints && errorData.hints.length > 0 && (
              <>
                <hr />
                <p className="mb-2">
                  <strong>Рекомендации:</strong>
                </p>
                <ul className="mb-0">
                  {errorData.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </>
            )}
            <hr />
            <div className="text-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setErrorData(null);
                  // Переходим на step=1
                  const url = new URL(window.location);
                  url.searchParams.set("step", "1");
                  window.history.pushState({}, "", url);
                  // Выполняем запрос
                  handleCreateSes();
                }}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      )}

      {(responseData || hasCpData) && (
        <div className="mt-4">
          <h3 className="mb-4 text-center">Комплект СЭС</h3>

          {/* Определяем, какие данные использовать */}
          {(() => {
            // Всегда используем локальное состояние
            const bomToDisplay = localBomData;

            // Показываем кнопки управления, если есть данные
            const showControls = hasCpData || responseData;

            return (
              <>
                {/* Таблица BOM (комплект СЭС) */}
                {(bomToDisplay && bomToDisplay.length > 0) || showControls ? (
                  <div className="mb-5">
                    <h6 className="mb-3">Оборудование</h6>
                    {bomToDisplay && bomToDisplay.length > 0 ? (
                      <div className="table-responsive">
                        <table
                          className="table table-sm table-striped align-middle"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <thead className="table-light">
                            <tr>
                              <th>Наименование</th>
                              <th>SKU</th>
                              <th>Количество</th>
                              <th>Ед.изм.</th>
                              <th>Цена за единицу</th>
                              <th>Сумма</th>
                              <th>Стоимость работ</th>
                              {showControls && (
                                <th
                                  style={{ width: "80px" }}
                                  className="text-end"
                                >
                                  Действия
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {bomToDisplay
                              .filter(
                                (item) =>
                                  item.title !== null &&
                                  item.title !== undefined
                              )
                              .map((item, index) => (
                                <tr key={item.sku || index}>
                                  <td>{safe(item.name || item.title)}</td>
                                  <td>
                                    <small className="text-muted">
                                      {safe(item.sku)}
                                    </small>
                                  </td>
                                  <td>
                                    {showControls ? (
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: "80px" }}
                                        min="1"
                                        step="1"
                                        value={item.qty || item.quantity || 1}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            item.sku,
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      safe(item.qty || item.quantity, 1)
                                    )}
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {safe(item.unit)}
                                    </small>
                                  </td>
                                  <td>
                                    {showControls ? (
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: "120px" }}
                                        min="0"
                                        step="0.01"
                                        value={
                                          item.priceRub ||
                                          item.unitPriceRub ||
                                          item.price ||
                                          item.basePrice ||
                                          0
                                        }
                                        onChange={(e) =>
                                          handlePriceChange(
                                            item.sku,
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      fmtMoney(
                                        item.priceRub ||
                                          item.unitPriceRub ||
                                          item.price ||
                                          item.basePrice
                                      )
                                    )}
                                  </td>
                                  <td>
                                    {(() => {
                                      const price = parseFloat(
                                        item.priceRub ||
                                          item.unitPriceRub ||
                                          item.price ||
                                          item.basePrice ||
                                          0
                                      );
                                      const qty = parseFloat(
                                        item.qty || item.quantity || 1
                                      );
                                      const sum = price * qty;
                                      return fmtMoney(sum);
                                    })()}
                                  </td>
                                  <td>
                                    {showControls ? (
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: "120px" }}
                                        min="0"
                                        step="0.01"
                                        value={
                                          getWorkCostForItem(item.sku) || 0
                                        }
                                        onChange={(e) =>
                                          handleWorkCostChange(
                                            item.sku,
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      (() => {
                                        const workCost = getWorkCostForItem(
                                          item.sku
                                        );
                                        const qty =
                                          item.qty || item.quantity || 1;
                                        const totalWorkCost = workCost * qty;
                                        return totalWorkCost > 0
                                          ? fmtMoney(totalWorkCost)
                                          : "-";
                                      })()
                                    )}
                                  </td>
                                  {showControls && (
                                    <td className="text-end">
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleRemoveBomItem(item.sku)
                                        }
                                        title="Удалить"
                                        style={{
                                          padding: "0.15rem 0.4rem",
                                          fontSize: "0.7rem",
                                        }}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <th colSpan="5">Итого по оборудованию:</th>
                              <th>{fmtMoney(calculateTotal(bomToDisplay))}</th>
                              <th></th>
                              {showControls && <th></th>}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Оборудование пока не добавлено. Нажмите кнопку ниже для
                        добавления.
                      </div>
                    )}
                    {/* Кнопка добавления оборудования */}
                    {showControls && (
                      <div className="mb-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setShowEquipmentModal(true)}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Добавить оборудование
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Таблица услуг */}
                {showControls && (
                  <div className="mb-5">
                    <h6 className="mb-3">Дополнительные услуги</h6>
                    {/* Кнопка добавления услуги */}
                    <div className="mb-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setShowServicesModal(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Добавить Услуги
                      </button>
                    </div>
                    {localServicesData && localServicesData.length > 0 ? (
                      <div className="table-responsive">
                        <table
                          className="table table-sm table-striped align-middle"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <thead className="table-light">
                            <tr>
                              <th>Наименование</th>
                              <th>SKU</th>
                              <th>Количество</th>
                              <th>Цена за единицу</th>
                              <th>Сумма</th>
                              <th
                                style={{ width: "80px" }}
                                className="text-end"
                              >
                                Действия
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {localServicesData.map((item, index) => {
                              const qty = parseFloat(item.quantity || 1);
                              const price = parseFloat(
                                item.price || item.basePrice || 0
                              );

                              // Если цена меньше 1, это процент от БАЗОВОЙ стоимости СЭС
                              const isPercentage = price >= 0 && price < 1;
                              let sum;
                              if (isPercentage) {
                                // Базовая стоимость СЭС = оборудование + монтаж (без услуг)
                                const equipmentCost = calculateTotal(
                                  localBomData || []
                                );
                                const installationCost =
                                  calculateInstallationCost();
                                const baseSESCost =
                                  equipmentCost + installationCost;
                                // Процент считается от базовой стоимости СЭС
                                sum = qty * (price * baseSESCost);
                              } else {
                                sum = qty * price;
                              }

                              return (
                                <tr key={item.sku || index}>
                                  <td>{safe(item.name || item.title)}</td>
                                  <td>
                                    <small className="text-muted">
                                      {safe(item.sku)}
                                    </small>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      style={{ width: "80px" }}
                                      min="1"
                                      step="1"
                                      value={qty}
                                      onChange={(e) =>
                                        handleServiceQuantityChange(
                                          item.sku,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    {isPercentage ? (
                                      <span className="badge bg-info">
                                        {(price * 100).toFixed(0)}% от стоимости
                                        СЭС
                                      </span>
                                    ) : (
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: "120px" }}
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) =>
                                          handleServicePriceChange(
                                            item.sku,
                                            e.target.value
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                  <td>{fmtMoney(sum)}</td>
                                  <td className="text-end">
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveServiceItem(item.sku)
                                      }
                                      title="Удалить"
                                      style={{
                                        padding: "0.15rem 0.4rem",
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <th colSpan="4">Итого по услугам:</th>
                              <th>
                                {fmtMoney(
                                  calculateServicesTotal(localServicesData)
                                )}
                              </th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Услуги пока не добавлены. Нажмите кнопку выше для
                        добавления.
                      </div>
                    )}
                  </div>
                )}

                {/* Таблица стоимости монтажа СЭС */}
                {(bomToDisplay && bomToDisplay.length > 0) || showControls ? (
                  <div className="mb-5">
                    <h6 className="mb-3">Стоимость монтажа СЭС</h6>
                    {bomToDisplay && bomToDisplay.length > 0 ? (
                      (() => {
                        const totalInstallationCost =
                          calculateInstallationCost();
                        const sesPower = parseFloat(cpData?.sesPower || 0);

                        return (
                          <div className="table-responsive">
                            <table
                              className="table table-sm table-striped align-middle"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <thead className="table-light">
                                <tr>
                                  <th>Наименование</th>
                                  <th className="text-end">Стоимость</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    Общая стоимость монтажа комплекта СЭС
                                    мощностью <strong>{sesPower}</strong> кВт
                                  </td>
                                  <td className="text-end">
                                    <strong>
                                      {fmtMoney(totalInstallationCost)}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Оборудование пока не добавлено. Стоимость монтажа будет
                        рассчитана после добавления оборудования.
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Предупреждения и итоги */}
                {responseData?.warnings && responseData.warnings.length > 0 && (
                  <div className="mb-4">
                    <div className="alert alert-warning" role="alert">
                      <h6 className="alert-heading">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Предупреждения
                      </h6>
                      <ul className="mb-0">
                        {responseData.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {responseData?.summary && (
                  <div className="mb-4">
                    <div className="alert alert-info" role="alert">
                      <h6 className="alert-heading">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Итоговая информация
                      </h6>
                      <p className="mb-0">{responseData.summary}</p>
                    </div>
                  </div>
                )}

                {/* Транспортные расходы */}
                {(bomToDisplay && bomToDisplay.length > 0) || showControls ? (
                  <div className="mb-5">
                    {cpData?.transportCosts === "yes" ? (
                      <>
                        <h6 className="mb-3">Транспортные расходы</h6>
                        <TransportAndTravelTable
                          initialData={localTransportData}
                          onChange={setLocalTransportData}
                        />
                      </>
                    ) : cpData?.transportCosts === "no" ? (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Транспортные расходы не рассчитываются
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Расчёт окупаемости */}
                {paybackResult && paybackResult.systemCost > 0 && (
                  <div className="row justify-content-center mt-4">
                    <div className="col-md-10">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-calculator me-2"></i>
                            Расчёт окупаемости
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="fs-6">Основные параметры:</h6>
                              <ul className="list-unstyled small">
                                <li>
                                  <strong>Годовая генерация (1-й год):</strong>{" "}
                                  {formatNumber(
                                    paybackResult.params.annualGenerationYear1
                                  )}{" "}
                                  кВт·ч
                                </li>
                                <li>
                                  <strong>Тариф (1-й год):</strong>{" "}
                                  {formatMoney(
                                    paybackResult.params.tariffYear1
                                  )}
                                  /кВт·ч
                                </li>
                                <li>
                                  <strong>Рост тарифа:</strong>{" "}
                                  {formatNumber(
                                    paybackResult.params.tariffInflationRate *
                                      100
                                  )}
                                  % в год
                                </li>
                                <li>
                                  <strong>Стоимость СЭС:</strong>{" "}
                                  {formatMoney(paybackResult.systemCost)}
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fs-6">Результаты расчёта:</h6>
                              <div className="text-center">
                                {paybackResult.paybackReached ? (
                                  <div>
                                    <h5 className="text-success">
                                      {formatNumber(
                                        paybackResult.paybackYearExact
                                      )}{" "}
                                      лет
                                    </h5>
                                    <small className="text-muted">
                                      Срок окупаемости
                                    </small>
                                  </div>
                                ) : (
                                  <div>
                                    <h5 className="text-warning">
                                      Не окупается за{" "}
                                      {paybackResult.params.yearsHorizon} лет
                                    </h5>
                                    <small className="text-muted">
                                      Экономия недостаточна
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {paybackResult.paybackReached && (
                            <div className="mt-3">
                              <h6 className="fs-6">
                                Детальный расчёт за{" "}
                                {paybackResult.params.yearsHorizon} лет:
                              </h6>
                              <div className="row text-center">
                                <div className="col-md-3">
                                  <div className="border rounded p-2">
                                    <strong className="small">
                                      Окупаемость
                                    </strong>
                                    <br />
                                    <span className="text-success fs-6">
                                      {paybackResult.paybackYear} лет
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="border rounded p-2">
                                    <strong className="small">
                                      Чистая прибыль за{" "}
                                      {paybackResult.params.yearsHorizon} лет
                                    </strong>
                                    <br />
                                    <span className="text-success fs-6">
                                      {formatMoney(paybackResult.netProfit)}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="border rounded p-2">
                                    <strong className="small">
                                      Накопленная экономия
                                    </strong>
                                    <br />
                                    <span className="text-info fs-6">
                                      {formatMoney(paybackResult.totalSavings)}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="border rounded p-2">
                                    <strong className="small">
                                      ROI за {paybackResult.params.yearsHorizon}{" "}
                                      лет
                                    </strong>
                                    <br />
                                    <span className="text-primary fs-6">
                                      {formatNumber(
                                        (paybackResult.netProfit /
                                          paybackResult.systemCost) *
                                          100
                                      )}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Общая сумма */}
                {bomToDisplay && bomToDisplay.length > 0 && (
                  <div className="row justify-content-center mt-3">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-body text-center">
                          <h6 className="card-title">
                            Общая стоимость проекта
                          </h6>
                          <h5 className="text-primary">
                            {fmtMoney(
                              calculateTotal(bomToDisplay || []) +
                                calculateInstallationCost() +
                                calculateServicesTotal(
                                  localServicesData || []
                                ) +
                                calculateTransportCost()
                            )}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Кнопка для генерации КП */}
                {!hasCpData && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-success"
                      disabled={isSaving}
                      onClick={handleGenerateKP}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      {isSaving ? "Сохранение..." : "Сгенерировать КП"}
                    </button>
                  </div>
                )}

                {/* Кнопка для генерации КП из cpData */}
                {hasCpData && !responseData && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-success"
                      disabled={isSaving}
                      onClick={async () => {
                        if (isSaving) return;

                        setIsSaving(true);
                        try {
                          // Обогащаем bomData стоимостью работ перед сохранением
                          const enrichedBomData =
                            await enrichBomDataWithWorkCost(localBomData || []);

                          // Рассчитываем общую стоимость проекта
                          const equipmentCost = calculateTotal(enrichedBomData);
                          const installationCost = calculateInstallationCost();
                          const servicesCost = calculateServicesTotal(
                            localServicesData || []
                          );
                          const transportCost = calculateTransportCost();
                          const totalCost =
                            equipmentCost +
                            installationCost +
                            servicesCost +
                            transportCost;

                          await saveBomAndServicesAction(
                            id,
                            enrichedBomData,
                            localServicesData || [],
                            localTransportData,
                            totalCost
                          );

                          // Сохраняем результаты расчета окупаемости
                          if (paybackResult) {
                            await savePaybackDataAction(id, paybackResult);
                          }

                          // Сохраняем summary если есть (может быть из cpData)
                          if (cpData?.summary) {
                            await saveSummaryAction(id, cpData.summary);
                          }

                          showToast.success("КП сгенерирован!");
                          router.push(`/preview?id=${id}`);
                        } catch (error) {
                          console.error("Ошибка при сохранении данных:", error);
                          showToast.error("Ошибка при сохранении данных КП");
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      {isSaving ? "Сохранение..." : "Сгенерировать КП"}
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-text">
              Собираем комплект оборудования
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора оборудования */}
      {showEquipmentModal && (
        <EquipmentSelectionModal
          onClose={() => setShowEquipmentModal(false)}
          onSelect={handleAddEquipment}
        />
      )}

      {/* Модальное окно выбора услуг */}
      {showServicesModal && (
        <ServicesSelectionModal
          onClose={() => setShowServicesModal(false)}
          onSelect={handleAddService}
        />
      )}

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loading-content {
          background: white;
          padding: 2rem 3rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .loading-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: #333;
          text-align: center;
        }

        .loading-dots {
          display: inline-block;
          margin-left: 4px;
        }

        .loading-dots span {
          animation: loading-dots 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes loading-dots {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

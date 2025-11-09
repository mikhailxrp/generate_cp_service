"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { fmtMoney, safe } from "@/lib/format";
import { saveBomAndServicesAction } from "@/app/actions/saveBomAndServices";
import { updatePaybackDataAction } from "@/app/actions/updatePaybackData";
import {
  calcPaybackYears,
  calcPaybackWithDegradation,
  formatNumber,
  formatMoney,
} from "@/lib/payback";

// Компонент модального окна для выбора услуг
function ServicesSelectionModal({ onClose, onSelect }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Загрузка услуг
  React.useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/services/all`);
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
                      <th>Описание</th>
                      <th>SKU</th>
                      <th>Цена</th>
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
                      filteredServices.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>
                            <small className="text-muted">
                              {item.description || "—"}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">{item.sku}</small>
                          </td>
                          <td>{fmtMoney(item.basePrice)}</td>
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
                      ))
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
    { id: "el_panel", label: "Распред. Щиты" },
    { id: "lotki", label: "Лотки" },
    { id: "krep", label: "Крепеж" },
    { id: "cpo_cs", label: "Лотки CPO90/CS90" },
    { id: "smartmeter", label: "Счетчики" },
    { id: "trans", label: "Трансформаторы" },
  ];

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

  // Фильтрация по поисковому запросу
  const filteredEquipment = equipment.filter((item) =>
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
                      <th style={{ width: "100px" }}>Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          Оборудование не найдено
                        </td>
                      </tr>
                    ) : (
                      filteredEquipment.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>
                            <small className="text-muted">{item.sku}</small>
                          </td>
                          <td>{fmtMoney(item.priceRub)}</td>
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
                      ))
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

  const { servicesData, bomData } = cpData;

  // Локальное управление BOM и Services
  const [localBomData, setLocalBomData] = useState(bomData || []);
  const [localServicesData, setLocalServicesData] = useState(
    servicesData || []
  );

  // Проверяем, есть ли данные из cpData
  const hasCpData =
    (bomData && bomData.length > 0) ||
    (servicesData && servicesData.length > 0);

  // Синхронизация локального состояния с bomData или responseData
  React.useEffect(() => {
    if (bomData && bomData.length > 0) {
      setLocalBomData(bomData);
    }
  }, [bomData]);

  React.useEffect(() => {
    if (servicesData && servicesData.length > 0) {
      setLocalServicesData(servicesData);
    }
  }, [servicesData]);

  // Синхронизация с responseData
  React.useEffect(() => {
    if (responseData?.bom && !hasCpData) {
      setLocalBomData(responseData.bom);
    }
    if (responseData?.services && !hasCpData) {
      setLocalServicesData(responseData.services);
    }
  }, [responseData, hasCpData]);

  // Функция удаления позиции из BOM
  const handleRemoveBomItem = (index) => {
    setLocalBomData((prev) => prev.filter((_, i) => i !== index));
    showToast.success("Позиция удалена");
  };

  // Функция добавления оборудования в BOM
  const handleAddEquipment = (equipment) => {
    const newItem = {
      name: equipment.title,
      title: equipment.title,
      qty: 1,
      quantity: 1,
      unitPriceRub: parseFloat(equipment.priceRub),
      price: parseFloat(equipment.priceRub),
      basePrice: parseFloat(equipment.priceRub),
      sku: equipment.sku,
      typeCode: equipment.typeCode,
    };
    setLocalBomData((prev) => [...prev, newItem]);
    showToast.success("Оборудование добавлено");
    setShowEquipmentModal(false);
  };

  // Функция изменения количества оборудования
  const handleQuantityChange = (index, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty < 0) return;

    setLocalBomData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, qty: qty, quantity: qty } : item
      )
    );
  };

  // Функция удаления услуги
  const handleRemoveServiceItem = (index) => {
    setLocalServicesData((prev) => prev.filter((_, i) => i !== index));
    showToast.success("Услуга удалена");
  };

  // Функция добавления услуги
  const handleAddService = (service) => {
    const newItem = {
      name: service.title,
      title: service.title,
      description: service.description || "",
      quantity: 1,
      price: parseFloat(service.basePrice),
      basePrice: parseFloat(service.basePrice),
      sku: service.sku,
      serviceType: service.serviceType,
    };
    setLocalServicesData((prev) => [...prev, newItem]);
    showToast.success("Услуга добавлена");
    setShowServicesModal(false);
  };

  // Функция изменения количества услуг
  const handleServiceQuantityChange = (index, newQty) => {
    const qty = parseFloat(newQty);
    if (isNaN(qty) || qty < 0) return;

    setLocalServicesData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
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
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд

      const response = await fetch("https://sunhorse.ru/webhook/create-ses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
              } else if (data && typeof data === "object") {
                // Если пришел объект
                setResponseData(data);
              } else {
                console.error("Неожиданная структура данных:", data);
                showToast.error("Получены данные в неожиданном формате");
              }
            } catch (parseError) {
              console.error("Ошибка парсинга JSON:", parseError);
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
        showToast.error("Превышено время ожидания ответа от сервера (30 сек)");
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
        item.unitPriceRub || item.price || item.basePrice || 0
      );
      const quantity = parseFloat(item.qty || item.quantity || 1);
      const itemTotal = price * quantity;

      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  // Расчёт окупаемости
  const calculatePayback = () => {
    if (!cpData) return null;

    const bomToDisplay = hasCpData ? bomData : responseData?.bom;
    const servicesToDisplay = hasCpData ? servicesData : responseData?.services;

    const totalCost =
      calculateTotal(bomToDisplay || []) +
      calculateTotal(servicesToDisplay || []);

    // Получаем данные из cpData
    // totalAnnualGeneration хранится в тысячах кВт·ч, поэтому умножаем на 1000
    const annualGeneration =
      (parseFloat(cpData.totalAnnualGeneration) || 0) * 1000;
    const tariff = parseFloat(cpData.priceKwh) || 0;
    const monthlyConsumption = parseFloat(cpData.monthlyConsumptionKwh) || 0;

    // Рассчитываем долю самопотребления
    const annualConsumption = monthlyConsumption * 12;
    const selfConsumptionShare =
      annualConsumption > 0
        ? Math.min(1, annualGeneration / annualConsumption)
        : 1;

    const paybackData = {
      total_cost_rub: totalCost,
      year_generation_kwh: annualGeneration,
      tariff_rub_per_kwh: tariff,
      self_consumption_share: selfConsumptionShare,
      annual_onm_rub: 0, // Можно добавить поле в форму
      export_price_rub_per_kwh: null, // Можно добавить поле в форму
    };

    const simplePayback = calcPaybackYears(paybackData);
    const detailedPayback = calcPaybackWithDegradation(paybackData);

    return {
      simple: simplePayback,
      detailed: detailedPayback,
      totalCost,
      annualGeneration,
      tariff,
      selfConsumptionShare,
      annualConsumption,
    };
  };

  const paybackData = calculatePayback();

  // Сохранение данных расчета окупаемости
  const savePaybackData = async () => {
    if (!paybackData || !id) return;

    try {
      const dataToSave = {
        simple: paybackData.simple,
        detailed: paybackData.detailed,
        totalCost: paybackData.totalCost,
        annualGeneration: paybackData.annualGeneration,
        tariff: paybackData.tariff,
        selfConsumptionShare: paybackData.selfConsumptionShare,
        annualConsumption: paybackData.annualConsumption,
        calculatedAt: new Date().toISOString(),
      };

      await updatePaybackDataAction(id, dataToSave);
    } catch (error) {
      console.error("Ошибка при сохранении данных расчета окупаемости:", error);
    }
  };

  // Сохраняем данные расчета окупаемости при изменении
  React.useEffect(() => {
    if (paybackData && paybackData.totalCost > 0) {
      savePaybackData();
    }
  }, [paybackData]);

  const handleGenerateKP = async () => {
    if (!responseData || !id) {
      showToast.error("Нет данных для генерации КП");
      return;
    }

    setIsSaving(true);
    try {
      await saveBomAndServicesAction(
        id,
        localBomData || [],
        localServicesData || []
      );
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
            const servicesToDisplay = localServicesData;

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
                        <table className="table table-sm table-striped align-middle small">
                          <thead className="table-light">
                            <tr>
                              <th>Наименование</th>
                              <th>Количество</th>
                              <th>Цена за единицу</th>
                              <th>Общая стоимость</th>
                              {showControls && (
                                <th style={{ width: "80px" }}>Действия</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {bomToDisplay.map((item, index) => (
                              <tr key={index}>
                                <td>{safe(item.name || item.title)}</td>
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
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                  ) : (
                                    safe(item.qty || item.quantity, 1)
                                  )}
                                </td>
                                <td>
                                  {fmtMoney(
                                    item.unitPriceRub ||
                                      item.price ||
                                      item.basePrice
                                  )}
                                </td>
                                <td>
                                  {(() => {
                                    const price = parseFloat(
                                      item.unitPriceRub ||
                                        item.price ||
                                        item.basePrice ||
                                        0
                                    );
                                    const quantity = parseFloat(
                                      item.qty || item.quantity || 1
                                    );
                                    const total = price * quantity;
                                    return isNaN(total) ? "—" : fmtMoney(total);
                                  })()}
                                </td>
                                {showControls && (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleRemoveBomItem(index)}
                                      title="Удалить"
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
                              <th colSpan="3">Итого по оборудованию:</th>
                              <th>{fmtMoney(calculateTotal(bomToDisplay))}</th>
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

                {/* Таблица Services (услуги) */}
                {(servicesToDisplay && servicesToDisplay.length > 0) ||
                showControls ? (
                  <div className="mb-5">
                    <h6 className="mb-3">Услуги</h6>
                    {servicesToDisplay && servicesToDisplay.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm table-striped align-middle small">
                          <thead className="table-light">
                            <tr>
                              <th>Наименование</th>
                              <th>Описание</th>
                              <th>Количество</th>
                              <th>Цена за единицу</th>
                              <th>Общая стоимость</th>
                              {showControls && (
                                <th style={{ width: "80px" }}>Действия</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {servicesToDisplay.map((service, index) => (
                              <tr key={index}>
                                <td>{safe(service.name || service.title)}</td>
                                <td>{safe(service.description)}</td>
                                <td>
                                  {showControls ? (
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      style={{ width: "80px" }}
                                      min="1"
                                      step="1"
                                      value={service.quantity || 1}
                                      onChange={(e) =>
                                        handleServiceQuantityChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                  ) : (
                                    safe(service.quantity, 1)
                                  )}
                                </td>
                                <td>
                                  {fmtMoney(service.price || service.basePrice)}
                                </td>
                                <td>
                                  {fmtMoney(
                                    (service.price || service.basePrice || 0) *
                                      (service.quantity || 1)
                                  )}
                                </td>
                                {showControls && (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveServiceItem(index)
                                      }
                                      title="Удалить"
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
                              <th colSpan="4">Итого по услугам:</th>
                              <th>
                                {fmtMoney(calculateTotal(servicesToDisplay))}
                              </th>
                              {showControls && <th></th>}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Услуги пока не добавлены. Нажмите кнопку ниже для
                        добавления.
                      </div>
                    )}
                    {/* Кнопка добавления услуг */}
                    {showControls && (
                      <div className="mb-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setShowServicesModal(true)}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Добавить услугу
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Расчёт окупаемости */}
                {paybackData && paybackData.totalCost > 0 && (
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
                                  <strong>Годовая генерация:</strong>{" "}
                                  {formatNumber(paybackData.annualGeneration)}{" "}
                                  кВт·ч
                                </li>
                                <li>
                                  <strong>Годовое потребление:</strong>{" "}
                                  {formatNumber(paybackData.annualConsumption)}{" "}
                                  кВт·ч
                                </li>
                                <li>
                                  <strong>Доля самопотребления:</strong>{" "}
                                  {formatNumber(
                                    paybackData.selfConsumptionShare * 100
                                  )}
                                  %
                                </li>
                                <li>
                                  <strong>Тариф:</strong>{" "}
                                  {formatMoney(paybackData.tariff)}/кВт·ч
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fs-6">Результаты расчёта:</h6>
                              <div className="text-center">
                                {paybackData.simple ? (
                                  <div>
                                    <h5 className="text-success">
                                      {formatNumber(paybackData.simple)} лет
                                    </h5>
                                    <small className="text-muted">
                                      Простая окупаемость
                                    </small>
                                  </div>
                                ) : (
                                  <div>
                                    <h5 className="text-warning">
                                      Не окупается
                                    </h5>
                                    <small className="text-muted">
                                      Экономия недостаточна
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {paybackData.detailed &&
                            paybackData.detailed.paybackYear && (
                              <div className="mt-3">
                                <h6 className="fs-6">
                                  Детальный расчёт с учётом деградации модулей:
                                </h6>
                                <div className="row text-center">
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong className="small">
                                        Окупаемость
                                      </strong>
                                      <br />
                                      <span className="text-success fs-6">
                                        {paybackData.detailed.paybackYear} лет
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong className="small">
                                        Чистая прибыль за 25 лет
                                      </strong>
                                      <br />
                                      <span className="text-success fs-6">
                                        {formatMoney(
                                          paybackData.detailed.netProfit
                                        )}
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
                                        {formatMoney(
                                          paybackData.detailed
                                            .finalCumulativeSavings
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong className="small">
                                        ROI за 25 лет
                                      </strong>
                                      <br />
                                      <span className="text-primary fs-6">
                                        {formatNumber(
                                          (paybackData.detailed.netProfit /
                                            paybackData.totalCost) *
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
                {((bomToDisplay && bomToDisplay.length > 0) ||
                  (servicesToDisplay && servicesToDisplay.length > 0)) && (
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
                                calculateTotal(servicesToDisplay || [])
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
                          await saveBomAndServicesAction(
                            id,
                            localBomData || [],
                            localServicesData || []
                          );
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

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

export default function CreateSesButton({ id, cpData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorData, setErrorData] = useState(null);

  const { servicesData, bomData } = cpData;

  // Проверяем, есть ли данные из cpData
  const hasCpData =
    (bomData && bomData.length > 0) ||
    (servicesData && servicesData.length > 0);

  const handleCreateSes = async () => {
    if (!id) {
      showToast.error("ID не найден");
      return;
    }

    setIsLoading(true);
    setErrorData(null); // Сбрасываем ошибку при новом запросе

    try {
      const response = await fetch("https://sunhorse.ru/webhook/create-ses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

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

              setResponseData(data);
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
      showToast.error("Произошла ошибка при отправке запроса");
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
        responseData.bom || [],
        responseData.services || []
      );
      showToast.success("КП сгенерирован!");
      router.push("/preview");
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
            const bomToDisplay = hasCpData ? bomData : responseData?.bom;
            const servicesToDisplay = hasCpData
              ? servicesData
              : responseData?.services;

            return (
              <>
                {/* Таблица BOM (комплект СЭС) */}
                {bomToDisplay && bomToDisplay.length > 0 && (
                  <div className="mb-5">
                    <h4 className="mb-3">Оборудование</h4>
                    <div className="table-responsive">
                      <table className="table table-sm table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Наименование</th>
                            <th>Количество</th>
                            <th>Цена за единицу</th>
                            <th>Общая стоимость</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bomToDisplay.map((item, index) => (
                            <tr key={index}>
                              <td>{safe(item.name || item.title)}</td>
                              <td>{safe(item.qty || item.quantity, 1)}</td>
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
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <th colSpan="3">Итого по оборудованию:</th>
                            <th>{fmtMoney(calculateTotal(bomToDisplay))}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Таблица Services (услуги) */}
                {servicesToDisplay && servicesToDisplay.length > 0 && (
                  <div className="mb-5">
                    <h4 className="mb-3">Услуги</h4>
                    <div className="table-responsive">
                      <table className="table table-sm table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Наименование</th>
                            <th>Описание</th>
                            <th>Количество</th>
                            <th>Цена за единицу</th>
                            <th>Общая стоимость</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicesToDisplay.map((service, index) => (
                            <tr key={index}>
                              <td>{safe(service.name || service.title)}</td>
                              <td>{safe(service.description)}</td>
                              <td>{safe(service.quantity, 1)}</td>
                              <td>
                                {fmtMoney(service.price || service.basePrice)}
                              </td>
                              <td>
                                {fmtMoney(
                                  (service.price || service.basePrice || 0) *
                                    (service.quantity || 1)
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <th colSpan="4">Итого по услугам:</th>
                            <th>
                              {fmtMoney(calculateTotal(servicesToDisplay))}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Общая сумма */}
                {((bomToDisplay && bomToDisplay.length > 0) ||
                  (servicesToDisplay && servicesToDisplay.length > 0)) && (
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-body text-center">
                          <h5 className="card-title">
                            Общая стоимость проекта
                          </h5>
                          <h3 className="text-primary">
                            {fmtMoney(
                              calculateTotal(bomToDisplay || []) +
                                calculateTotal(servicesToDisplay || [])
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Расчёт окупаемости */}
                {paybackData && paybackData.totalCost > 0 && (
                  <div className="row justify-content-center mt-4">
                    <div className="col-md-10">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h5 className="mb-0">
                            <i className="bi bi-calculator me-2"></i>
                            Расчёт окупаемости
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6>Основные параметры:</h6>
                              <ul className="list-unstyled">
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
                              <h6>Результаты расчёта:</h6>
                              <div className="text-center">
                                {paybackData.simple ? (
                                  <div>
                                    <h4 className="text-success">
                                      {formatNumber(paybackData.simple)} лет
                                    </h4>
                                    <small className="text-muted">
                                      Простая окупаемость
                                    </small>
                                  </div>
                                ) : (
                                  <div>
                                    <h4 className="text-warning">
                                      Не окупается
                                    </h4>
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
                                <h6>
                                  Детальный расчёт с учётом деградации модулей:
                                </h6>
                                <div className="row text-center">
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong>Окупаемость</strong>
                                      <br />
                                      <span className="text-success fs-5">
                                        {paybackData.detailed.paybackYear} лет
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong>Чистая прибыль за 25 лет</strong>
                                      <br />
                                      <span className="text-success fs-5">
                                        {formatMoney(
                                          paybackData.detailed.netProfit
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong>Накопленная экономия</strong>
                                      <br />
                                      <span className="text-info fs-5">
                                        {formatMoney(
                                          paybackData.detailed
                                            .finalCumulativeSavings
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="border rounded p-2">
                                      <strong>ROI за 25 лет</strong>
                                      <br />
                                      <span className="text-primary fs-5">
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
                            bomData || [],
                            servicesData || []
                          );
                          showToast.success("КП сгенерирован!");
                          router.push("/preview");
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

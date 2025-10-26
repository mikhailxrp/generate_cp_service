"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fmtMoney, safe } from "@/lib/format";
import { saveBomAndServicesAction } from "@/app/actions/saveBomAndServices";

export default function CreateSesButton({ id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleCreateSes = async () => {
    if (!id) {
      toast.error("ID не найден");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://sunhorse.ru/webhook/create-ses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Запрос успешно отправлен!");
        const data = await response.json();
        console.log("Полные данные ответа:", data);
        console.log("BOM данные:", data.bom);
        console.log("Services данные:", data.services);
        setResponseData(data);
      } else {
        toast.error("Ошибка при отправке запроса");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Произошла ошибка при отправке запроса");
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

      // Отладочная информация
      console.log("Item:", item);
      console.log("Price:", price, "Quantity:", quantity, "Total:", itemTotal);

      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const handleGenerateKP = async () => {
    if (!responseData || !id) {
      toast.error("Нет данных для генерации КП");
      return;
    }

    try {
      await saveBomAndServicesAction(
        id,
        responseData.bom || [],
        responseData.services || []
      );
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      toast.error("Ошибка при сохранении данных КП");
    }
  };

  return (
    <>
      {!responseData && (
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

      {responseData && (
        <div className="mt-4">
          <h3 className="mb-4 text-center">Комплект СЭС</h3>

          {/* Таблица BOM (комплект СЭС) */}
          {responseData.bom && responseData.bom.length > 0 && (
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
                    {responseData.bom.map((item, index) => (
                      <tr key={index}>
                        <td>{safe(item.name || item.title)}</td>
                        <td>{safe(item.qty || item.quantity, 1)}</td>
                        <td>
                          {fmtMoney(
                            item.unitPriceRub || item.price || item.basePrice
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
                      <th>{fmtMoney(calculateTotal(responseData.bom))}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Таблица Services (услуги) */}
          {responseData.services && responseData.services.length > 0 && (
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
                    {responseData.services.map((service, index) => (
                      <tr key={index}>
                        <td>{safe(service.name || service.title)}</td>
                        <td>{safe(service.description)}</td>
                        <td>{safe(service.quantity, 1)}</td>
                        <td>{fmtMoney(service.price || service.basePrice)}</td>
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
                      <th>{fmtMoney(calculateTotal(responseData.services))}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Общая сумма */}
          {responseData.bom && responseData.services && (
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <h5 className="card-title">Общая стоимость проекта</h5>
                    <h3 className="text-primary">
                      {fmtMoney(
                        calculateTotal(responseData.bom || []) +
                          calculateTotal(responseData.services || [])
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Кнопка для генерации КП */}
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={handleGenerateKP}>
              <i className="bi bi-file-earmark-text me-2"></i>
              Сгенерировать КП
            </button>
          </div>
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

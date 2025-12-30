"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/header/Header";
import CpBlockOne from "@/components/preview-components/CpBlockOne";
import CpBlockTwo from "@/components/preview-components/CpBlockTwo";

import Footer from "@/components/footer/Footer";
import knowledgeBase from "@/know_base/db.json" assert { type: "json" };
import CpBlockThree from "@/components/preview-components/CpBlockThree";
import CpBlockFour from "@/components/preview-components/CpBlockFour";
import CpBlockFive from "@/components/preview-components/CpBlockFive";
import CpBlockNetwork from "@/components/preview-components/CpBlockNetwork";
import CpBlockHybrid from "@/components/preview-components/CpBlockHybrid";
import CpBlockEastWest from "@/components/preview-components/CpBlockEastWest";
import CpBlockSouth from "@/components/preview-components/CpBlockSouth";
import CpBlockCarpot from "@/components/preview-components/CpBlockCarpot";
import CpBlockMetal from "@/components/preview-components/CpBlockMetal";
import CpBlockCanopy from "@/components/preview-components/CpBlockCanopy";
import CpBlockTiles from "@/components/preview-components/CpBlockTiles";
import CpBlockGround from "@/components/preview-components/CpBlockGround";
import CpBlockAcc from "@/components/preview-components/CpBlockAcc";
import CpBlockMikroGen from "@/components/preview-components/CpBlockMikroGen";
import CpBlockMonitor from "@/components/preview-components/CpBlockMonitor";
import CpBlockPayback from "@/components/preview-components/CpBlockPayback";
import CpBlockDetails from "@/components/preview-components/CpBlockDetails";
import CpBlockLeasing from "@/components/preview-components/CpBlockLeasing";
import CpBlockRoadMap from "@/components/preview-components/CpBlockRoadMap";
import CpBlockEssg from "@/components/preview-components/CpBlockEssg";
import CpBlockGuarantees from "@/components/preview-components/CpBlockGuarantees";
import CpBlockFaq from "@/components/preview-components/CpBlockFaq";
import CpBlockLogos from "@/components/preview-components/CpBlockLogos";
import CpBlockPrice from "@/components/preview-components/CpBlockPrice";
import CpBlockContact from "@/components/preview-components/CpBlockContact";

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [cpData, setCpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extractedData, setExtractedData] = useState({});
  const [userData, setUserData] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [archiveData, setArchiveData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        // Если нет ID, загружаем архив
        try {
          const archiveResponse = await fetch("/api/main-information");
          if (archiveResponse.ok) {
            const archiveResult = await archiveResponse.json();
            if (archiveResult.success) {
              setArchiveData(archiveResult.data);
            }
          }
        } catch (error) {
          console.error("Ошибка при получении архива:", error);
        }
        setLoading(false);
        return;
      }

      try {
        // Получаем данные КП
        const cpResponse = await fetch(`/api/main-information/${id}`);

        if (!cpResponse.ok) {
          throw new Error(`HTTP error! status: ${cpResponse.status}`);
        }

        const cpResult = await cpResponse.json();

        if (cpResult.data) {
          setCpData(cpResult.data);
        }

        // Получаем данные пользователя
        const userResponse = await fetch("/api/user/me");
        if (userResponse.ok) {
          const userResult = await userResponse.json();
          if (userResult.success && userResult.user) {
            setUserData(userResult.user);
          }
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!cpData) return;

    const {
      clientName,
      clientAddress,
      clientType,
      clientClass,
      systemType,
      typeArea,
      directionsCount,
      sesPower,
      combinedData,
      totalAnnualGeneration,
      essBattery,
      networkPhazes,
      connectedPowerKw,
      microgeneration,
      monthlyConsumptionKwh,
      priceKwh,
      buildingHeight,
      transportCosts,
      dgUnit,
      electricCar,
      projectNumber,
      clientPains,
      clientPainsLabels,
      bomData,
      servicesData,
      paybackData,
      totalCost,
      transportData,
      solarAngle,
      summary,
    } = cpData;

    setExtractedData({
      clientName,
      clientAddress,
      clientType,
      clientClass,
      systemType,
      typeArea,
      directionsCount,
      sesPower,
      combinedData,
      totalAnnualGeneration,
      essBattery,
      networkPhazes,
      connectedPowerKw,
      microgeneration,
      monthlyConsumptionKwh,
      priceKwh,
      buildingHeight,
      transportCosts,
      dgUnit,
      electricCar,
      projectNumber,
      clientPains,
      clientPainsLabels,
      bomData,
      servicesData,
      paybackData,
      totalCost,
      transportData,
      solarAngle,
      summary,
    });
  }, [cpData]);

  // Функция группировки по датам
  const groupByDate = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const groups = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: [],
    };

    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        groups.today.push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(item);
      } else if (itemDate >= weekAgo) {
        groups.week.push(item);
      } else if (itemDate >= monthAgo) {
        groups.month.push(item);
      } else {
        groups.older.push(item);
      }
    });

    return groups;
  };

  const groupedData = groupByDate(archiveData);

  const getFilteredData = () => {
    switch (activeTab) {
      case "today":
        return groupedData.today;
      case "yesterday":
        return groupedData.yesterday;
      case "week":
        return groupedData.week;
      case "month":
        return groupedData.month;
      case "older":
        return groupedData.older;
      default:
        return archiveData;
    }
  };

  const generatePdf = async () => {
    setGeneratingPdf(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const container = document.querySelector(".page-pdf-container");
      if (!container) {
        console.error("Контейнер .page-pdf-container не найден");
        return;
      }

      // Получаем все дочерние элементы контейнера (каждый CpBlock*)
      const blocks = Array.from(container.children[0]?.children || []);

      if (blocks.length === 0) {
        console.error("Блоки не найдены");
        return;
      }

      // A4 альбомная ориентация в мм: 297x210
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        // Рендерим блок в canvas
        const canvas = await html2canvas(block, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: block.scrollWidth,
          windowHeight: block.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // Добавляем новую страницу (кроме первой)
        if (i > 0) {
          pdf.addPage("a4", "landscape");
        }

        // Вставляем изображение на всю страницу А4
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
      }

      // Сохраняем PDF
      const fileName = `КП_${
        extractedData.clientName || "клиент"
      }_${new Date().toLocaleDateString("ru-RU")}.pdf`;
      pdf.save(fileName);

      // Показываем модальное окно после успешного скачивания
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
      alert("Ошибка при генерации PDF. Проверьте консоль для деталей.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <div
          className="container"
          style={{ flex: 1, display: "flex", alignItems: "center" }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-lg-10">
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-2">Загрузка данных...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cpData) {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <div className="container my-5" style={{ flex: 1 }}>
          <h2 className="text-center mb-4">Архив коммерческих предложений</h2>

          {/* Вкладки фильтрации */}
          <div className="mb-4">
            <ul className="nav nav-pills justify-content-center flex-wrap gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  Все ({archiveData.length})
                </button>
              </li>
              {groupedData.today.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "today" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("today")}
                  >
                    Сегодня ({groupedData.today.length})
                  </button>
                </li>
              )}
              {groupedData.yesterday.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "yesterday" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("yesterday")}
                  >
                    Вчера ({groupedData.yesterday.length})
                  </button>
                </li>
              )}
              {groupedData.week.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "week" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("week")}
                  >
                    Неделя ({groupedData.week.length})
                  </button>
                </li>
              )}
              {groupedData.month.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "month" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("month")}
                  >
                    Месяц ({groupedData.month.length})
                  </button>
                </li>
              )}
              {groupedData.older.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "older" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("older")}
                  >
                    Старые ({groupedData.older.length})
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Список КП */}
          <div className="row g-4 mb-5">
            {getFilteredData().length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3"
                  style={{ opacity: 0.3 }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <p className="fs-5">Нет КП в этой категории</p>
              </div>
            ) : (
              getFilteredData().map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: "1px solid #e0e0e0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0,0,0,0.15)";
                      e.currentTarget.style.borderColor = "#0d6efd";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#e0e0e0";
                    }}
                    onClick={() => {
                      window.location.href = `/preview?id=${item.id}`;
                    }}
                  >
                    <div className="card-body d-flex flex-column">
                      <h5
                        className="card-title text-truncate mb-3"
                        title={item.clientName}
                      >
                        {item.clientName}
                      </h5>
                      <p className="card-text text-muted small mb-3">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginRight: "6px", marginTop: "-2px" }}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {item.clientAddress}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <span
                          className="badge bg-primary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          ⚡ {item.sesPower} кВт
                        </span>
                        <span
                          className="badge bg-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {item.systemType === "network"
                            ? "🔌 Сетевая"
                            : "🔋 Гибридная"}
                        </span>
                      </div>
                      {item.totalCost && (
                        <p
                          className="mb-2 fw-bold text-success"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {Number(item.totalCost).toLocaleString("ru-RU")} ₽
                        </p>
                      )}
                      {item.projectNumber && (
                        <p className="text-muted small mb-2">
                          📋 Проект: {item.projectNumber}
                        </p>
                      )}
                      <p className="text-muted small mb-0 mt-auto">
                        🕐{" "}
                        {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Кнопка создать КП */}
          <div className="row">
            <div className="col-12 text-center">
              <Link
                href="/"
                className="btn btn-primary btn-lg"
                style={{
                  padding: "14px 40px",
                  fontSize: "18px",
                  fontWeight: "600",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "8px", marginTop: "-2px" }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Создать новое КП
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div style={{ flex: 1 }}>
        <div className="page-pdf-container">
          {cpData && (
            <>
              <div>
                <CpBlockOne
                  clientName={extractedData.clientName}
                  clientType={extractedData.clientType}
                  sesPower={extractedData.sesPower}
                  systemType={extractedData.systemType}
                  clientAddress={extractedData.clientAddress}
                  bomData={extractedData.bomData}
                  servicesData={extractedData.servicesData}
                  engineerName={
                    userData
                      ? `${userData.name || ""} ${
                          userData.surname || ""
                        }`.trim()
                      : ""
                  }
                />
                <CpBlockTwo
                  priceKwh={extractedData.priceKwh}
                  totalCost={extractedData.totalCost}
                  paybackData={extractedData.paybackData}
                />
                <CpBlockFour
                  paybackData={extractedData.paybackData}
                  priceKwh={extractedData.priceKwh}
                />
                <CpBlockFive />
                {extractedData.systemType === "network" && <CpBlockNetwork />}
                {extractedData.systemType === "hybrid" && <CpBlockHybrid />}
                {extractedData.typeArea === "flat_south" && <CpBlockSouth />}
                {extractedData.typeArea === "flat_east-west" && (
                  <CpBlockEastWest />
                )}
                {(extractedData.typeArea === "carpot_south" ||
                  extractedData.typeArea === "carpot_east-west" ||
                  extractedData.typeArea === "canopy") && <CpBlockCanopy />}
                {extractedData.typeArea === "metal" && <CpBlockMetal />}
                {extractedData.typeArea === "slate" && <CpBlockCarpot />}
                {extractedData.typeArea === "classic_tiles" && <CpBlockTiles />}
                {extractedData.typeArea === "ground" && <CpBlockGround />}
                {extractedData.essBattery && <CpBlockAcc />}
                {/* БЛОК МЕТРИКА И ТЕХНИЧЕМСКИЕ ПАРАМЕТРЫ НАЧАЛО */}
                <CpBlockThree
                  sesPower={extractedData.sesPower}
                  typeArea={extractedData.typeArea}
                  bomData={extractedData.bomData}
                  combinedData={extractedData.combinedData}
                  totalAnnualGeneration={extractedData.totalAnnualGeneration}
                  paybackData={extractedData.paybackData}
                  solarAngle={extractedData.solarAngle}
                />
                {/* БЛОК МЕТРИКА И ТЕХНИЧЕМСКИЕ ПАРАМЕТРЫ КОНЕЦ */}
                {extractedData.dgUnit && <CpBlockMikroGen />}
                <CpBlockMonitor />
                <CpBlockPayback paybackData={extractedData.paybackData} />
                <CpBlockDetails
                  paybackData={extractedData.paybackData}
                  totalCost={extractedData.totalCost}
                />
                {/* <CpBlockLeasing clientName={extractedData.clientName} /> */}
                <CpBlockRoadMap />
                <CpBlockEssg paybackData={extractedData.paybackData} />
                <CpBlockGuarantees />
                <CpBlockFaq />
                <CpBlockLogos typeArea={extractedData.typeArea} />
                <CpBlockPrice
                  totalCost={extractedData.totalCost}
                  servicesData={extractedData.servicesData}
                  bomData={extractedData.bomData}
                  transportData={extractedData.transportData}
                  summary={extractedData.summary}
                />
                <CpBlockContact userData={userData} />
              </div>
            </>
          )}
        </div>
        <div className="container mt-3 mb-5">
          <div className="row">
            <div className="col-12 text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={generatePdf}
                disabled={generatingPdf}
              >
                {generatingPdf ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Генерация PDF...
                  </>
                ) : (
                  "Скачать PDF"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Модальное окно успешного скачивания */}
      {showSuccessModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            animation: "fadeIn 0.3s ease-in",
          }}
          onClick={() => {
            setShowSuccessModal(false);
            setCpData(null);
            setExtractedData({});
            router.push("/preview");
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                animation: "slideUp 0.4s ease-out",
              }}
            >
              <div className="modal-body text-center p-5">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#28a745",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    animation: "scaleIn 0.5s ease-out",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3
                  className="mb-3"
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  PDF успешно скачан!
                </h3>
                <p className="text-muted mb-4" style={{ fontSize: "16px" }}>
                  Коммерческое предложение готово к отправке клиенту
                </p>
                <Link
                  href="/"
                  className="btn btn-primary btn-lg"
                  style={{
                    padding: "14px 40px",
                    fontSize: "18px",
                    fontWeight: "600",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Создать новый проект
                </Link>
                <button
                  className="btn btn-link text-muted mt-3 d-block mx-auto"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCpData(null);
                    setExtractedData({});
                    router.push("/preview");
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function Prewiev() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <PreviewContent />
      </Suspense>
    </div>
  );
}

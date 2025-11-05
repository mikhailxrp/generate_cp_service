"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/header/Header";
import CpBlockOne from "@/components/preview-components/CpBlockOne";
import CpBlockSecond from "@/components/preview-components/CpBlockSecond";
import CpBlockThird from "@/components/preview-components/CpBlockThird";
import CpBlockFourth from "@/components/preview-components/CpBlockFourth";
import CpBlockFifth from "@/components/preview-components/CpBlockFifth";
import CpBlockSixth from "@/components/preview-components/CpBlockSixth";
import CpBlockSeventhWrapper from "@/components/preview-components/CpBlockSeventhWrapper";
import Footer from "@/components/footer/Footer";
import knowledgeBase from "@/know_base/db.json" assert { type: "json" };

function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const printMode = searchParams.get("print") === "1";
  const [cpData, setCpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extractedData, setExtractedData] = useState({});
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchCpData() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/main-information/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.data) {
          setCpData(result.data);
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCpData();
  }, [id]);

  console.log("CP Data:", cpData);

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
    });
  }, [cpData]);

  // Добавляем маркер для Playwright когда данные загружены
  useEffect(() => {
    if (!loading && cpData && printMode) {
      document.body.setAttribute("data-preview-ready", "true");
      console.log("Preview ready for PDF generation");
    }
  }, [loading, cpData, printMode]);

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
        <div
          className="container"
          style={{ flex: 1, display: "flex", alignItems: "center" }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-lg-10 text-center">
              <Link href="/" className="btn btn-primary btn-lg">
                Создать КП
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
      {!printMode && <Header />}
      {printMode && (
        <style>{`
          @page { size: auto; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #pdf-root { width: 100% !important;}
          #pdf-root .preview-block-container {
            width: 1100px !important;
            margin: 0 auto !important;
          }
          .pdf-page { break-after: page; page-break-after: always; padding-top: 20px; padding-bottom: 20px; }
          .btn, .btn-wrapper { display: none !important; }
        `}</style>
      )}
      <div style={{ flex: 1 }}>
        {printMode ? (
          // Режим печати: без Bootstrap-обёрток
          cpData && (
            <div id="pdf-root">
              <div className="pdf-page">
                <CpBlockOne
                  clientName={extractedData.clientName}
                  clientType={extractedData.clientType}
                  sesPower={extractedData.sesPower}
                  systemType={extractedData.systemType}
                />
              </div>
              <div className="pdf-page">
                <CpBlockSecond
                  pains={extractedData.clientPains}
                  kbPains={knowledgeBase.pains}
                />
              </div>
              <div className="pdf-page">
                <CpBlockThird
                  sesType={knowledgeBase.items}
                  clientType={extractedData.clientType}
                  systemType={extractedData.systemType}
                />
              </div>
              <div className="pdf-page">
                <CpBlockFourth
                  bomData={extractedData.bomData}
                  servicesData={extractedData.servicesData}
                  combinedData={extractedData.combinedData}
                  totalAnnualGeneration={extractedData.totalAnnualGeneration}
                  priceKwh={extractedData.priceKwh}
                  monthlyConsumptionKwh={extractedData.monthlyConsumptionKwh}
                />
              </div>
              <div className="pdf-page">
                <CpBlockFifth />
              </div>
              <div className="pdf-page">
                <CpBlockSixth />
              </div>
              <div className="pdf-page">
                <CpBlockSeventhWrapper />
              </div>
            </div>
          )
        ) : (
          // Обычный режим: с Bootstrap-обёртками
          <div className="container">
            <div className="row justify-content-center mt-4 mb-5">
              <div className="col-lg-10">
                {cpData && (
                  <>
                    <div id="pdf-root">
                      <div>
                        <CpBlockOne
                          clientName={extractedData.clientName}
                          clientType={extractedData.clientType}
                          sesPower={extractedData.sesPower}
                          systemType={extractedData.systemType}
                        />
                      </div>
                      <div>
                        <CpBlockSecond
                          pains={extractedData.clientPains}
                          kbPains={knowledgeBase.pains}
                        />
                      </div>
                      <div>
                        <CpBlockThird
                          sesType={knowledgeBase.items}
                          clientType={extractedData.clientType}
                          systemType={extractedData.systemType}
                        />
                      </div>
                      <div>
                        <CpBlockFourth
                          bomData={extractedData.bomData}
                          servicesData={extractedData.servicesData}
                          combinedData={extractedData.combinedData}
                          totalAnnualGeneration={
                            extractedData.totalAnnualGeneration
                          }
                          priceKwh={extractedData.priceKwh}
                          monthlyConsumptionKwh={
                            extractedData.monthlyConsumptionKwh
                          }
                        />
                      </div>
                      <div>
                        <CpBlockFifth />
                      </div>
                      <div>
                        <CpBlockSixth />
                      </div>
                      <div>
                        <CpBlockSeventhWrapper />
                      </div>
                    </div>

                    <div className="row justify-content-center mt-4 mb-5">
                      <div className="col-lg-8">
                        <div className="btn-wrapper d-flex gap-3 justify-content-center">
                          <button
                            className="btn btn-success btn-lg"
                            disabled={downloading}
                            onClick={async () => {
                              try {
                                setDownloading(true);
                                const res = await fetch(
                                  `/api/generate-pdf?id=${encodeURIComponent(
                                    id
                                  )}`
                                );
                                if (!res.ok) {
                                  // Попытаемся прочитать ошибку из ответа
                                  const errorData = await res
                                    .json()
                                    .catch(() => null);
                                  console.error("Server error:", errorData);
                                  throw new Error(
                                    errorData?.message || `HTTP ${res.status}`
                                  );
                                }
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `kp_${
                                  extractedData.clientName || id
                                }.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                              } catch (e) {
                                console.error("Ошибка при генерации PDF:", e);
                                alert(
                                  `Не удалось сформировать PDF: ${e.message}\nПроверьте консоль браузера и логи сервера.`
                                );
                              } finally {
                                setDownloading(false);
                              }
                            }}
                          >
                            {downloading
                              ? "Генерация..."
                              : "Сгенерировать КП / Скачать PDF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {!printMode && <Footer />}
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

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/header/Header";
import CpBlockOne from "@/components/preview-components/CpBlockOne";
import CpBlockSecond from "@/components/preview-components/CpBlockSecond";
import CpBlockThird from "@/components/preview-components/CpBlockThird";
import CpBlockFourth from "@/components/preview-components/CpBlockFourth";
import CpBlockFifth from "@/components/preview-components/CpBlockFifth";
import CpBlockSixth from "@/components/preview-components/CpBlockSixth";
import CpBlockSeventh from "@/components/preview-components/CpBlockSeventh";
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

  console.log("knowledgeBase", knowledgeBase);

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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="row justify-content-center mt-4">
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
      </>
    );
  }

  if (!cpData) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="row justify-content-center mt-4">
            <div className="col-lg-10">
              <div className="alert alert-warning" role="alert">
                Данные не найдены для ID: {id}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
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
              <CpBlockSeventh />
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
                      <CpBlockSeventh />
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
                                `/api/generate-pdf?id=${encodeURIComponent(id)}`
                              );
                              if (!res.ok)
                                throw new Error(`HTTP ${res.status}`);
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
                                "Не удалось сформировать PDF. Проверьте логи."
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
      {!printMode && <Footer />}
    </>
  );
}

export default function Prewiev() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}

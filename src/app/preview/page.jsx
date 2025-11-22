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
  const [cpData, setCpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extractedData, setExtractedData] = useState({});

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
      <Header />
      <div style={{ flex: 1 }}>
        <div className="container">
          <div className="row justify-content-center mt-4 mb-5">
            <div className="col-lg-10">
              {cpData && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
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

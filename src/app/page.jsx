import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MainInformationForm from "@/components/block-forms/MainInformationForm";
import MainInfoCard from "@/components/MainInfoCard";
import "./globals.css";
import { createCpAction } from "./actions/createCp";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";
import GraphVisualForm from "@/components/block-forms/graphVisualForm";
import GraphCardWrapper from "@/components/GraphCardWrapper";

export const metadata = {
  title: "САНХОРС | Генератор Коммерческих предложений",
  description: "Генератор Коммерческих предложений",
};

export default async function Home({ searchParams }) {
  // параметры из URL: /?id=123&step=1
  const params = await searchParams;
  const id = params?.id ? parseInt(params.id) : null;
  const step = params?.step ? parseInt(params.step) : null;

  // Получаем данные из БД если есть id
  let cpData = null;
  if (id) {
    const db = getDb();
    const result = await db
      .select()
      .from(mainInformation)
      .where(eq(mainInformation.id, id))
      .limit(1);
    cpData = result[0] || null;
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="row mt-5">
          <div className="col-12">
            <h1 className="main-title text-center">Конструктор КП</h1>
            <p className="text-center main-description">
              Данный конструктор облегчает задачу менеджера при создании
              коммерческих предложений для клиентов компании САНХОРС
            </p>
          </div>
        </div>

        <div className="row">
          {step === null && (
            <div className="select-step">
              <div className="select-step-btn-wrapper">
                <form action={createCpAction}>
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-plus-circle"></i> Создать новый проект
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="row mt-4 mb-5">
          <div className="col-lg-6">
            {step === 1 && <MainInformationForm step={step} id={id ?? null} />}
            {step === 2 && (
              <GraphVisualForm step={step} id={id ?? null} cpData={cpData} />
            )}
          </div>
          <div className="col-lg-6 mt-lg-0 mt-4">
            {step >= 2 && <MainInfoCard cpData={cpData} />}
            {step >= 3 && (
              <GraphCardWrapper graphData={cpData.combinedData} id={id} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

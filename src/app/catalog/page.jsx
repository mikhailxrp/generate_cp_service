import { getDb } from "@/db/index";
import { priceItems, presets, compat, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fmtMoney, safe, titleByType } from "@/lib/format";
import Header from "@/components/header/Header";
import CatalogWrapper from "@/components/CatalogWrapper";
import ServicesTableClient from "@/components/ServicesTableClient";
import "./catalog.css";

export const dynamic = "force-dynamic"; // всегда свежие данные
export const runtime = "nodejs"; // не edge

export const metadata = {
  title: "Каталог комплектующих",
  description: "Каталог комплектующих для генерации КП",
};

async function fetchPriceByType(typeCode, limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(priceItems)
    .where(eq(priceItems.typeCode, typeCode))
    .limit(limit);
}

async function PresetsTable({ rows }) {
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="catalog-title-h3 mb-0">Пресеты</h3>
        <button className="btn btn-primary btn-sm">
          <i className="bi bi-plus-circle me-1"></i>
          Добавить пресет
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Use case</th>
              <th>Диапазон кВтp</th>
              <th>PV-модули (SKU)</th>
              <th>Инвертор</th>
              <th>ESS</th>
              <th>PCS</th>
              <th>Крепёж</th>
              <th>Заметки</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{safe(r.useCase)}</td>
                <td>{safe(r.rangeKwp)}</td>
                <td>
                  {Array.isArray(r.pvModuleSkus)
                    ? r.pvModuleSkus.join(", ")
                    : safe(r.pvModuleSkus)}
                </td>
                <td>{safe(r.inverterSku)}</td>
                <td>{safe(r.essSku)}</td>
                <td>{safe(r.pcsSku)}</td>
                <td>{safe(r.mountSku)}</td>
                <td>{safe(r.notes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <div className="text-muted">Нет данных.</div>}
    </div>
  );
}

async function CompatTable({ rows }) {
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="catalog-title-h3 mb-0">
          Совместимость (Инвертор ↔ ESS)
        </h3>
        <button className="btn btn-primary btn-sm">
          <i className="bi bi-plus-circle me-1"></i>
          Добавить совместимость
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Инвертор (SKU)</th>
              <th>ESS (SKU)</th>
              <th>Совместимость</th>
              <th>Ограничения</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <code>{r.inverterSku}</code>
                </td>
                <td>
                  <code>{r.essSku}</code>
                </td>
                <td>{r.isCompatible ? "Да" : "Нет"}</td>
                <td>{safe(r.limits)}</td>
                <td>{safe(r.comment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <div className="text-muted">Нет данных.</div>}
    </div>
  );
}

export default async function CatalogPage() {
  const db = getDb();
  // оборудование по типам (по 50 строк на тип для начала)
  const [panels, inverters, ess, mounts] = await Promise.all([
    fetchPriceByType("panel", 50),
    fetchPriceByType("inverter", 50),
    fetchPriceByType("ess", 50),
    fetchPriceByType("mount", 50),
  ]);

  // 2) Пресеты
  const presetsRows = await db.select().from(presets).limit(100);

  // 3) Совместимость
  const compatRows = await db.select().from(compat).limit(200);

  // 4) Услуги
  const servicesRows = await db.select().from(services).limit(100);
  return (
    <>
      <Header />
      <div className="container-fluid catalog-container mt-3">
        <div className="container">
          <h1 className="catalog-title">Каталог</h1>

          {/* Блок 1: Оборудование по типам */}
          <CatalogWrapper
            initialData={{
              panels,
              inverters,
              ess,
              mounts,
            }}
          />

          {/* Блок 2: Пресеты */}
          {/* <PresetsTable rows={presetsRows} /> */}

          {/* Блок 3: Совместимость */}
          <CompatTable rows={compatRows} />

          {/* Блок 4: Услуги */}
          <ServicesTableClient rows={servicesRows} />
        </div>
      </div>
    </>
  );
}

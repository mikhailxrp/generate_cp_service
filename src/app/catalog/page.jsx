import { getDb } from "@/db/index";
import { priceItems, presets, compat, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fmtMoney, safe, titleByType } from "@/lib/format";
import Header from "@/components/header/Header";
import CatalogWrapper from "@/components/CatalogWrapper";
import ServicesTableClient from "@/components/ServicesTableClient";
import PresetsTableClient from "@/components/PresetsTableClient";
import CompatTableClient from "@/components/CompatTableClient";
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
          <PresetsTableClient rows={presetsRows} />

          {/* Блок 3: Совместимость */}
          <CompatTableClient rows={compatRows} />

          {/* Блок 4: Услуги */}
          <ServicesTableClient rows={servicesRows} />
        </div>
      </div>
    </>
  );
}

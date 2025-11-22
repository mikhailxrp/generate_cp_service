import { getDb } from "@/db/index";
import { priceItems, presets, compat, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/components/header/Header";
import CatalogTabs from "@/components/CatalogTabs";
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
  const [
    panels,
    inverters,
    ess,
    mounts,
    batteries,
    cables,
    connectors,
    switches,
    fuses,
    uzips,
    elpanels,
    lotki,
    cpo_cs,
    smartmeters,
    transformers,
  ] = await Promise.all([
    fetchPriceByType("panel", 50),
    fetchPriceByType("inverter", 50),
    fetchPriceByType("ess", 50),
    fetchPriceByType("mount", 50),
    fetchPriceByType("batt", 50),
    fetchPriceByType("cable", 50),
    fetchPriceByType("connector", 50),
    fetchPriceByType("pow_off", 50),
    fetchPriceByType("fuse", 50),
    fetchPriceByType("uzip", 50),
    fetchPriceByType("panel_ac", 50),
    fetchPriceByType("lotki", 50),
    fetchPriceByType("cpo90", 50),
    fetchPriceByType("smartmeter", 50),
    fetchPriceByType("ct", 50),
  ]);

  // krep использует те же данные что и mounts
  const krep = mounts;

  // 2) Пресеты
  const presetsRows = await db.select().from(presets).limit(100);

  // 3) Совместимость
  const compatRows = await db.select().from(compat).limit(200);

  // 4) Услуги
  const servicesRows = await db.select().from(services).limit(100);

  // 5) Дополнительные услуги (из price_items с type_code='sunhors')
  const additionalServices = await db
    .select()
    .from(priceItems)
    .where(eq(priceItems.typeCode, "sunhors"))
    .limit(100);

  // 6) ПО (из price_items с type_code='demo')
  const softwareItems = await db
    .select()
    .from(priceItems)
    .where(eq(priceItems.typeCode, "demo"))
    .limit(100);

  return (
    <>
      <Header />
      <div className="container-fluid catalog-container mt-3">
        <div className="container">
          <CatalogTabs
            equipmentData={{
              panels,
              inverters,
              ess,
              mounts,
              batteries,
              cables,
              connectors,
              switches,
              fuses,
              uzips,
              elpanels,
              lotki,
              krep,
              cpo_cs,
              smartmeters,
              transformers,
            }}
            presetsRows={presetsRows}
            compatRows={compatRows}
            servicesRows={servicesRows}
            additionalServicesRows={additionalServices}
            softwareRows={softwareItems}
          />
        </div>
      </div>
    </>
  );
}

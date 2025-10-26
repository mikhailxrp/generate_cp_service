"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateInformationAction(id, data) {
  const db = getDb();

  const nextStep = (data.currentStep || 3) + 1;

  await db
    .update(mainInformation)
    .set({
      essBattery: data.ess_battery || "",
      networkPhazes: data.network_phazes || "",
      connectedPowerKw: data.connected_power_kw || "0",
      microgeneration: data.microgeneration || "",
      monthlyConsumptionKwh: data.monthly_consumption_kwh || "0",
      priceKwh: data.price_kwh || "0",
      buildingHeight: data.building_height || "",
      transportCosts: data.transport_costs || "no",
      dgUnit: data.dg_unit || "no",
      electricCar: data.electric_car || "no",
      projectNumber: data.project_number || "",
      clientPains: data.client_pains || [],
      clientPainsLabels: data.client_pains_labels || [],
      step: nextStep,
    })
    .where(eq(mainInformation.id, id));

  // Редирект на следующий шаг
  redirect(`/?id=${id}&step=${nextStep}`);
}

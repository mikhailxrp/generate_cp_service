"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateMainInfoAction(id, data, currentStep) {
  const db = getDb();

  const nextStep = (currentStep || 1) + 1;

  await db
    .update(mainInformation)
    .set({
      clientName: data.client_name || "",
      clientAddress: data.client_address || "",
      clientType: data.client_type || "",
      clientClass: data.client_class || "",
      clientLogoUrl: data.client_logo_url || null,
      systemType: data.system_type || "",
      typeArea: data.type_area || "",
      directionsCount: parseInt(data.directions_count) || 1,
      sesPower: data.ses_power_kw || "0",
      step: nextStep,
    })
    .where(eq(mainInformation.id, id));

  // Редирект на следующий шаг
  redirect(`/?id=${id}&step=${nextStep}`);
}

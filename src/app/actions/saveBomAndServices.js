"use server";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveBomAndServicesAction(id, bomData, servicesData, transportData = null, totalCost = null) {
  const db = getDb();

  const updateData = {
    bomData: bomData,
    servicesData: servicesData,
  };

  // Добавляем transportData только если он передан
  if (transportData !== null && transportData !== undefined) {
    updateData.transportData = transportData;
  }

  // Добавляем totalCost только если он передан
  if (totalCost !== null && totalCost !== undefined) {
    updateData.totalCost = totalCost;
  }

  await db
    .update(mainInformation)
    .set(updateData)
    .where(eq(mainInformation.id, id));

  return { success: true };
}

"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateCombinedDataAction(
  id,
  combinedData,
  currentStep,
  totalAnnualGeneration = null
) {
  const db = getDb();

  const nextStep = (currentStep || 1) + 1;

  const updateData = {
    combinedData: combinedData,
    step: nextStep,
  };

  // Добавляем totalAnnualGeneration если оно передано
  if (totalAnnualGeneration !== null) {
    updateData.totalAnnualGeneration = totalAnnualGeneration;
  }

  await db
    .update(mainInformation)
    .set(updateData)
    .where(eq(mainInformation.id, id));

  // Редирект на следующий шаг
  redirect(`/?id=${id}&step=${nextStep}`);
}

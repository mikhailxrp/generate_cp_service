"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateCombinedDataAction(
  id,
  combinedData,
  currentStep,
  totalAnnualGeneration = null,
  solarParams = null
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

  // Добавляем параметры солнечной радиации если они переданы
  if (solarParams) {
    if (solarParams.angle !== undefined && solarParams.angle !== null && solarParams.angle !== "") {
      updateData.solarAngle = solarParams.angle;
    }
    if (solarParams.aspect !== undefined && solarParams.aspect !== null && solarParams.aspect !== "") {
      updateData.solarAspect = solarParams.aspect;
    }
    if (solarParams.lat !== undefined && solarParams.lat !== null && solarParams.lat !== "") {
      updateData.solarLat = solarParams.lat;
    }
    if (solarParams.lon !== undefined && solarParams.lon !== null && solarParams.lon !== "") {
      updateData.solarLon = solarParams.lon;
    }
    if (solarParams.peakpower !== undefined && solarParams.peakpower !== null && solarParams.peakpower !== "") {
      updateData.solarPeakpower = solarParams.peakpower;
    }
  }

  await db
    .update(mainInformation)
    .set(updateData)
    .where(eq(mainInformation.id, id));

  // Редирект на следующий шаг
  redirect(`/?id=${id}&step=${nextStep}`);
}

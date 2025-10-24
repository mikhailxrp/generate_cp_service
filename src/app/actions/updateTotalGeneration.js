"use server";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateTotalGenerationAction(id, totalAnnualGeneration) {
  const db = getDb();

  await db
    .update(mainInformation)
    .set({
      totalAnnualGeneration: totalAnnualGeneration,
    })
    .where(eq(mainInformation.id, id));

  return { success: true };
}

"use server";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updatePaybackDataAction(id, paybackData) {
  const db = getDb();

  await db
    .update(mainInformation)
    .set({
      paybackData: paybackData,
    })
    .where(eq(mainInformation.id, id));

  return { success: true };
}

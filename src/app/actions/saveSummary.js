"use server";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveSummaryAction(id, summary) {
  const db = getDb();

  await db
    .update(mainInformation)
    .set({
      summary: summary,
    })
    .where(eq(mainInformation.id, id));

  return { success: true };
}


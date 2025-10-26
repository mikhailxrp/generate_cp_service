"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveBomAndServicesAction(id, bomData, servicesData) {
  const db = getDb();

  await db
    .update(mainInformation)
    .set({
      bomData: bomData,
      servicesData: servicesData,
    })
    .where(eq(mainInformation.id, id));

  // Редирект на страницу preview без search параметров
  redirect("/preview");
}

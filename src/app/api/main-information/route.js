import { NextResponse } from "next/server";
import { getDb } from "@/db/index.js";
import { mainInformation } from "@/db/schema.js";
import { desc } from "drizzle-orm";

export async function GET(request) {
  try {
    const db = getDb();
    const result = await db
      .select({
        id: mainInformation.id,
        clientName: mainInformation.clientName,
        clientAddress: mainInformation.clientAddress,
        sesPower: mainInformation.sesPower,
        systemType: mainInformation.systemType,
        totalCost: mainInformation.totalCost,
        createdAt: mainInformation.createdAt,
        projectNumber: mainInformation.projectNumber,
      })
      .from(mainInformation)
      .orderBy(desc(mainInformation.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Ошибка при получении списка КП:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}


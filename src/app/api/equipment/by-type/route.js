import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { priceItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeCode = searchParams.get("typeCode");

    if (!typeCode) {
      return NextResponse.json(
        { error: "Параметр typeCode обязателен" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Получаем все активные позиции по типу
    const items = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.typeCode, typeCode))
      .orderBy(desc(priceItems.priority))
      .limit(100);

    return NextResponse.json({
      success: true,
      items: items,
      count: items.length,
    });
  } catch (error) {
    console.error("Ошибка при получении оборудования по типу:", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}

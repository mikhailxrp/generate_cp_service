import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { priceItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get("sku");

    if (!sku) {
      return NextResponse.json(
        { error: "Параметр sku обязателен" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Получаем оборудование по SKU
    const items = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.sku, sku))
      .limit(1);

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Оборудование не найдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: items[0],
    });
  } catch (error) {
    console.error("Ошибка при получении оборудования по SKU:", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}








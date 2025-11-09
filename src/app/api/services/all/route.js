import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { services } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("serviceType");

    const db = getDb();

    // Формируем условия
    const conditions = [eq(services.isActive, 1)];

    if (serviceType) {
      conditions.push(eq(services.serviceType, serviceType));
    }

    const items = await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(desc(services.priority))
      .limit(100);

    return NextResponse.json({
      success: true,
      items: items,
      count: items.length,
    });
  } catch (error) {
    console.error("Ошибка при получении услуг:", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}

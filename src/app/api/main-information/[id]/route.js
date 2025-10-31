import { NextResponse } from "next/server";
import { getDb } from "@/db/index.js";
import { mainInformation } from "@/db/schema.js";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID не предоставлен" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db
      .select()
      .from(mainInformation)
      .where(eq(mainInformation.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Данные не найдены" }, { status: 404 });
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

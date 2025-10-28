import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { compat } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();
    const inverterSku = String(
      body.inverterSku || body.inverter_sku || ""
    ).trim();
    const essSku = String(body.essSku || body.ess_sku || "").trim();
    if (!inverterSku || !essSku) {
      return NextResponse.json(
        { error: "inverterSku и essSku обязательны" },
        { status: 400 }
      );
    }
    const isCompatibleVal = String(
      body.isCompatible ?? body.is_compatible ?? "1"
    ).toLowerCase();
    const isCompatible = ["1", "true", "да", "+"].includes(isCompatibleVal)
      ? 1
      : 0;
    const limits = body.limits ? String(body.limits).trim() : null;
    const comment = body.comment ? String(body.comment).trim() : null;

    const db = getDb();

    console.log(
      "[api/compat] upsert pair=",
      inverterSku,
      essSku,
      "is=",
      isCompatible
    );
    // уникальность пары
    const exists = await db
      .select()
      .from(compat)
      .where(
        and(eq(compat.inverterSku, inverterSku), eq(compat.essSku, essSku))
      )
      .limit(1);
    if (exists.length > 0) {
      return NextResponse.json(
        { error: "Такая пара уже существует" },
        { status: 409 }
      );
    }

    const insertResult = await db.insert(compat).values({
      inverterSku,
      essSku,
      isCompatible,
      limits,
      comment,
    });
    const insertId = insertResult.insertId;

    if (insertId) {
      return NextResponse.json({ success: true, data: { id: insertId } });
    }

    const last = await db
      .select()
      .from(compat)
      .where(
        and(eq(compat.inverterSku, inverterSku), eq(compat.essSku, essSku))
      )
      .orderBy(desc(compat.id))
      .limit(1);
    if (last.length > 0) {
      return NextResponse.json({ success: true, data: last[0] });
    }

    return NextResponse.json(
      { error: "Создано, но не удалось получить запись" },
      { status: 500 }
    );
  } catch (error) {
    console.error("/api/compat POST error", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка: ${error.message}` },
      { status: 500 }
    );
  }
}

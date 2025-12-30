import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { services } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();

    const required = ["sku", "title", "serviceType", "basePrice"];
    for (const k of required) {
      if (
        body[k] === undefined ||
        body[k] === null ||
        String(body[k]).trim() === ""
      ) {
        return NextResponse.json(
          { error: `Поле ${k} обязательно` },
          { status: 400 }
        );
      }
    }

    const db = getDb();

    const clean = {
      sku: String(body.sku).trim(),
      title: String(body.title).trim(),
      serviceType: String(body.serviceType).trim(),
      description: body.description ? String(body.description).trim() : null,
      basePrice: Number(body.basePrice),
      currency: body.currency ? String(body.currency).trim() : "RUB",
      executionDays:
        body.executionDays != null ? Number(body.executionDays) : null,
      warrantyYears:
        body.warrantyYears != null ? Number(body.warrantyYears) : null,
      comment: body.comment ? String(body.comment).trim() : null,
      isActive: 1,
      priority: 0,
    };

    const insertResult = await db.insert(services).values(clean);
    const insertId = insertResult.insertId;

    if (insertId) {
      const result = await db
        .select()
        .from(services)
        .where(eq(services.id, insertId))
        .limit(1);
      if (result.length > 0) {
        return NextResponse.json({
          success: true,
          data: result[0],
          message: "Услуга создана",
        });
      }
    }

    // fallback: найти по SKU
    const last = await db
      .select()
      .from(services)
      .where(eq(services.sku, clean.sku))
      .orderBy(desc(services.id))
      .limit(1);
    if (last.length > 0) {
      return NextResponse.json({
        success: true,
        data: last[0],
        message: "Услуга создана",
      });
    }

    return NextResponse.json(
      { error: "Создано, но не удалось получить запись" },
      { status: 500 }
    );
  } catch (error) {
    console.error("/api/services POST error", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка: ${error.message}` },
      { status: 500 }
    );
  }
}

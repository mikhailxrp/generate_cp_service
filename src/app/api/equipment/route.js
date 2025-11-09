import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { priceItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function PUT(request) {
  try {
    const body = await request.json();

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID оборудования обязателен" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Убираем поля, которые не должны обновляться
    const { createdAt, priceUpdatedAt, updatedAt, ...cleanUpdateData } =
      updateData;

    // Обновляем запись в базе данных
    const updateResult = await db
      .update(priceItems)
      .set({
        ...cleanUpdateData,
        updatedAt: new Date(),
      })
      .where(eq(priceItems.id, id));

    // Получаем обновленную запись
    const result = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Оборудование не найдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Оборудование успешно обновлено",
    });
  } catch (error) {
    console.error("Ошибка при обновлении оборудования:", error);
    console.error("Детали ошибки:", error.message);
    console.error("Стек ошибки:", error.stack);
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const db = getDb();

    // Убираем поля, которые не должны передаваться
    const { id, createdAt, updatedAt, priceUpdatedAt, ...raw } = body;

    // Базовая валидация
    const required = ["sku", "title", "priceRub", "typeCode"];
    for (const k of required) {
      if (
        raw[k] === undefined ||
        raw[k] === null ||
        String(raw[k]).trim() === ""
      ) {
        return NextResponse.json(
          { error: `Поле ${k} обязательно` },
          { status: 400 }
        );
      }
    }

    const cleanData = {
      typeCode: String(raw.typeCode).trim(),
      sku: String(raw.sku).trim(),
      title: String(raw.title).trim(),
      priceRub: Number(raw.priceRub),
      currency: raw.currency ? String(raw.currency).trim() : "RUB",
      stock: raw.stock != null ? Number(raw.stock) : null,
      priority: raw.priority != null ? Number(raw.priority) : 0,
      warehouseRegion: raw.warehouseRegion
        ? String(raw.warehouseRegion).trim()
        : null,
      leadDays: raw.leadDays != null ? Number(raw.leadDays) : null,
      specUrl: raw.specUrl ? String(raw.specUrl).trim() : null,
      comment: raw.comment ? String(raw.comment).trim() : null,
      attrs:
        typeof raw.attrs === "object" && raw.attrs !== null ? raw.attrs : {},
      isActive: 1,
    };

    if (!Number.isFinite(cleanData.priceRub)) {
      return NextResponse.json(
        { error: "priceRub должен быть числом" },
        { status: 400 }
      );
    }

    // UPSERT по SKU: если есть — обновим, иначе — создадим
    const existing = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.sku, cleanData.sku))
      .limit(1);

    if (existing.length > 0) {
      console.log("[api/equipment] upsert update sku=", cleanData.sku);
      await db
        .update(priceItems)
        .set({
          ...cleanData,
          updatedAt: new Date(),
        })
        .where(eq(priceItems.sku, cleanData.sku));

      const updated = await db
        .select()
        .from(priceItems)
        .where(eq(priceItems.sku, cleanData.sku))
        .limit(1);
      return NextResponse.json({
        success: true,
        data: updated[0],
        message: "Оборудование обновлено",
      });
    }

    // Создаем новую запись
    console.log(
      "[api/equipment] insert sku=",
      cleanData.sku,
      "type=",
      cleanData.typeCode
    );
    const insertResult = await db.insert(priceItems).values(cleanData);
    const insertId = insertResult.insertId;

    if (insertId) {
      const result = await db
        .select()
        .from(priceItems)
        .where(eq(priceItems.id, insertId))
        .limit(1);
      if (result.length > 0) {
        return NextResponse.json({
          success: true,
          data: result[0],
          message: "Оборудование успешно создано",
        });
      }
    }

    // fallback: получить последнюю запись по типу
    const lastRecord = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.typeCode, cleanData.typeCode))
      .orderBy(desc(priceItems.id))
      .limit(1);

    if (lastRecord.length > 0) {
      return NextResponse.json({
        success: true,
        data: lastRecord[0],
        message: "Оборудование успешно создано",
      });
    }

    return NextResponse.json(
      { error: "Оборудование создано, но не удалось получить данные" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Ошибка при создании оборудования:", error);
    console.error("Детали ошибки:", error.message);
    console.error("Стек ошибки:", error.stack);
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json(
        { error: "ID оборудования обязателен" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: "Некорректный ID оборудования" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Сначала проверяем, существует ли запись
    const existingRecord = await db
      .select()
      .from(priceItems)
      .where(eq(priceItems.id, id))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: "Оборудование не найдено" },
        { status: 404 }
      );
    }

    // Удаляем запись
    await db.delete(priceItems).where(eq(priceItems.id, id));

    return NextResponse.json({
      success: true,
      message: "Оборудование успешно удалено",
    });
  } catch (error) {
    console.error("Ошибка при удалении оборудования:", error);

    // Проверка на ошибку подключения к БД
    if (error.code === "ENOTFOUND" || error.errno === -3008) {
      return NextResponse.json(
        { error: "Ошибка подключения к базе данных" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error.message}` },
      { status: 500 }
    );
  }
}

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
    const { id, createdAt, updatedAt, priceUpdatedAt, ...cleanData } = body;

    // Создаем новую запись
    const insertResult = await db.insert(priceItems).values(cleanData);

    // Получаем ID созданной записи
    const insertId = insertResult.insertId;

    if (insertId) {
      // Получаем созданную запись по ID
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
      } else {
        console.error("Запись не найдена по ID:", insertId);
      }
    } else {
      console.error("InsertId не получен");
    }

    // Альтернативный подход - получаем последнюю созданную запись по типу
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

    // Если и это не сработало, возвращаем ошибку
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID оборудования обязателен" },
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
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

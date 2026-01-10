import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { processAndSaveImage } from "@/lib/imageUpload";

export async function POST(request) {
  try {
    // Проверка авторизации
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Не авторизован" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Файл не найден" },
        { status: 400 }
      );
    }

    // Обрабатываем и сохраняем логотип
    const result = await processAndSaveImage(file, "logos");

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
    });
  } catch (error) {
    console.error("Upload logo error:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка при загрузке логотипа" },
      { status: 500 }
    );
  }
}


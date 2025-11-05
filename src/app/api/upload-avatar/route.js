import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getSession } from "@/lib/auth";

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

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Файл должен быть изображением" },
        { status: 400 }
      );
    }

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Размер файла не должен превышать 5MB" },
        { status: 400 }
      );
    }

    // Конвертируем файл в buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Загружаем в Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `user_${session.userId}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка при загрузке аватара" },
      { status: 500 }
    );
  }
}

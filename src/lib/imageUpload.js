import sharp from "sharp";
import { writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * Конфигурация для разных типов изображений
 */
const IMAGE_CONFIGS = {
  avatars: {
    width: 400,
    height: 400,
    quality: 85,
    format: "jpeg",
  },
  logos: {
    width: 800,
    height: 400,
    quality: 90,
    format: "png",
  },
};

/**
 * Валидация файла
 */
export function validateImageFile(file) {
  // Проверка типа
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Файл должен быть изображением" };
  }

  // Проверка размера (макс 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "Размер файла не должен превышать 5MB" };
  }

  return { valid: true };
}

/**
 * Генерация уникального имени файла
 */
function generateFileName(type, extension) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${type}_${timestamp}_${random}.${extension}`;
}

/**
 * Обработка и сохранение изображения
 * @param {File} file - Файл изображения
 * @param {string} type - Тип изображения ('avatars' или 'logos')
 * @param {string} userId - ID пользователя (опционально, для именования)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function processAndSaveImage(file, type = "avatars", userId = null) {
  try {
    // Валидация
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Получаем конфигурацию для типа
    const config = IMAGE_CONFIGS[type];
    if (!config) {
      return { success: false, error: "Неизвестный тип изображения" };
    }

    // Конвертируем файл в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Обрабатываем изображение через sharp
    let processedBuffer;
    if (type === "avatars") {
      // Для аватаров - квадратная обрезка с фокусом на центр
      processedBuffer = await sharp(buffer)
        .resize(config.width, config.height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: config.quality })
        .toBuffer();
    } else if (type === "logos") {
      // Для логотипов - сохраняем пропорции, добавляем padding
      processedBuffer = await sharp(buffer)
        .resize(config.width, config.height, {
          fit: "inside",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png({ quality: config.quality })
        .toBuffer();
    }

    // Генерируем имя файла
    const extension = config.format === "jpeg" ? "jpg" : config.format;
    const fileName = generateFileName(
      userId ? `${type.slice(0, -1)}_${userId}` : type.slice(0, -1),
      extension
    );

    // Путь для сохранения
    const uploadDir = process.env.UPLOAD_DIR 
      ? path.join(process.env.UPLOAD_DIR, type)
      : path.join(process.cwd(), "public", "uploads", type);
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await writeFile(filePath, processedBuffer);

    // Возвращаем URL
    const url = `/uploads/${type}/${fileName}`;

    return {
      success: true,
      url,
      fileName,
    };
  } catch (error) {
    console.error("Image processing error:", error);
    return {
      success: false,
      error: "Ошибка при обработке изображения",
    };
  }
}

/**
 * Удаление изображения по URL
 * @param {string} url - URL изображения (например, /uploads/avatars/file.jpg)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteImage(url) {
  try {
    if (!url || !url.startsWith("/uploads/")) {
      return { success: false, error: "Некорректный URL" };
    }

    // Получаем путь к файлу
    const filePath = process.env.UPLOAD_DIR
      ? path.join(process.env.UPLOAD_DIR, url.replace('/uploads/', ''))
      : path.join(process.cwd(), "public", url);

    // Проверяем существование
    if (!existsSync(filePath)) {
      return { success: true }; // Файл уже удалён
    }

    // Удаляем файл
    await unlink(filePath);

    return { success: true };
  } catch (error) {
    console.error("Image deletion error:", error);
    return {
      success: false,
      error: "Ошибка при удалении изображения",
    };
  }
}


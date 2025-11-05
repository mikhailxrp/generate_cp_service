"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(profileData) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return {
        success: false,
        error: "Пользователь не авторизован",
      };
    }

    const { name, surname, phone, telegram, whatsapp } = profileData;

    // Валидация данных
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Имя обязательно для заполнения",
      };
    }

    if (!surname || surname.trim().length === 0) {
      return {
        success: false,
        error: "Фамилия обязательна для заполнения",
      };
    }

    if (!phone || phone.trim().length === 0) {
      return {
        success: false,
        error: "Телефон обязателен для заполнения",
      };
    }

    // Валидация формата телефона (базовая)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ""))) {
      return {
        success: false,
        error: "Некорректный формат телефона",
      };
    }

    const db = getDb();

    // Обновить данные пользователя
    await db
      .update(users)
      .set({
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        telegram: telegram ? telegram.trim() : "",
        whatsapp: whatsapp ? whatsapp.trim() : "",
      })
      .where(eq(users.id, session.userId));

    // Сбросить кэш страницы профиля
    revalidatePath("/profile");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: "Ошибка при обновлении профиля",
    };
  }
}

"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function updatePassword(oldPassword, newPassword) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return {
        success: false,
        error: "Пользователь не авторизован",
      };
    }

    // Валидация данных
    if (!oldPassword || !newPassword) {
      return {
        success: false,
        error: "Все поля обязательны для заполнения",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: "Новый пароль должен содержать минимум 6 символов",
      };
    }

    const db = getDb();

    // Получить текущего пользователя
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Пользователь не найден",
      };
    }

    // Проверить старый пароль
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

    if (!isOldPasswordValid) {
      return {
        success: false,
        error: "Неверный текущий пароль",
      };
    }

    // Хэшировать новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновить пароль
    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
      })
      .where(eq(users.id, session.userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update password error:", error);
    return {
      success: false,
      error: "Ошибка при обновлении пароля",
    };
  }
}

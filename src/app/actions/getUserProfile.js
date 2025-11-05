"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function getUserProfile() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return {
        success: false,
        error: "Пользователь не авторизован",
      };
    }

    const db = getDb();

    // Получить полные данные пользователя из БД
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
        phone: users.phone,
        telegram: users.telegram,
        whatsapp: users.whatsapp,
        role: users.role,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Пользователь не найден",
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Get user profile error:", error);
    return {
      success: false,
      error: "Ошибка при получении данных пользователя",
    };
  }
}

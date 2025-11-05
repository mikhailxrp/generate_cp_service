"use server";

import { getDb } from "@/db/index";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function getUsers() {
  try {
    const session = await getSession();

    // Проверка авторизации
    if (!session) {
      return { success: false, error: "Необходима авторизация" };
    }

    // Проверка прав администратора
    if (session.role !== "admin") {
      return { success: false, error: "Недостаточно прав" };
    }

    const db = getDb();

    // Получаем всех пользователей без хэша пароля
    const allUsers = await db
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
      .from(users);

    return { success: true, users: allUsers };
  } catch (error) {
    console.error("Get users error:", error);
    return { success: false, error: "Ошибка при получении пользователей" };
  }
}

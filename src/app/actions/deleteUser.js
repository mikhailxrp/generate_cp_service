"use server";

import { getDb } from "@/db/index";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function deleteUser(userId) {
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

    // Нельзя удалить себя
    if (session.userId === userId) {
      return { success: false, error: "Нельзя удалить свой аккаунт" };
    }

    const db = getDb();

    // Удаление пользователя
    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Ошибка при удалении пользователя" };
  }
}

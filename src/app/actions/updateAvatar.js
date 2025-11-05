"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAvatar(avatarUrl) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return {
        success: false,
        error: "Пользователь не авторизован",
      };
    }

    if (!avatarUrl) {
      return {
        success: false,
        error: "URL аватара не указан",
      };
    }

    const db = getDb();

    // Обновить аватар пользователя
    await db
      .update(users)
      .set({ avatarUrl })
      .where(eq(users.id, session.userId));

    // Сбросить кэш страницы профиля
    revalidatePath("/profile");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update avatar error:", error);
    return {
      success: false,
      error: "Ошибка при обновлении аватара",
    };
  }
}

"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(email, password) {
  try {
    const db = getDb();

    // Найти пользователя по email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Неверный email или пароль",
      };
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Неверный email или пароль",
      };
    }

    // Создать сессию
    await createSession(user.id, user.email, user.role);

    // СЕРВЕРНЫЙ редирект - кука уже установлена
    redirect("/");
  } catch (error) {
    // redirect() бросает исключение - это нормально
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Login error:", error);
    return {
      success: false,
      error: "Ошибка при входе в систему",
    };
  }
}

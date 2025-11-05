"use server";

import { getDb } from "@/db/index";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function createUser(formData) {
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

    const { email, password, name, surname, phone, telegram, whatsapp, role } =
      formData;

    // Валидация
    if (!email || !password || !name || !surname || !phone) {
      return {
        success: false,
        error: "Все обязательные поля должны быть заполнены",
      };
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Некорректный формат email" };
    }

    // Проверка минимальной длины пароля
    if (password.length < 6) {
      return {
        success: false,
        error: "Пароль должен содержать минимум 6 символов",
      };
    }

    const db = getDb();

    // Проверка существования пользователя с таким email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: "Пользователь с таким email уже существует",
      };
    }

    // Хэширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание пользователя
    await db.insert(users).values({
      email,
      passwordHash,
      name,
      surname,
      phone,
      telegram: telegram || "",
      whatsapp: whatsapp || "",
      role: role || "manager",
    });

    return { success: true };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Ошибка при создании пользователя" };
  }
}

"use server";
import { redirect } from "next/navigation";
import { getDb } from "@/db/index";
import { mainInformation } from "@/db/schema";

/**
 * Server Action для создания нового черновика КП
 *
 * Что делает:
 * 1. Создаёт пустую запись в таблице main_information с дефолтными значениями
 * 2. Получает id созданной записи
 * 3. Редиректит пользователя на главную страницу с параметрами ?id=X&step=1
 *
 * Это позволяет начать процесс пошагового заполнения КП
 */
export async function createCpAction() {
  const db = getDb();

  // Минимальные плейсхолдеры, чтобы пройти NOT NULL
  const values = {
    clientName: "",
    clientAddress: "",
    clientType: "",
    clientClass: "",
    systemType: "",
    directionsCount: 1,
    sesPower: "",
    step: 1,
  };

  const result = await db.insert(mainInformation).values(values);

  // В Drizzle ORM с mysql2 insertId может быть в разных местах
  const id = result[0]?.insertId || result.insertId;

  if (!id) {
    throw new Error("Failed to get insertId from database");
  }

  // Редирект на страницу с id и step для пошагового заполнения
  redirect(`/?id=${id}&step=1`);
}

import "dotenv/config";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../src/db/schema.js";

async function createUser() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection, { schema, mode: "default" });

  const email = "dmihail528@gmail.com";
  const password = "dmihail528@gmail.com";

  // Хэшируем пароль
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await db.insert(schema.users).values({
      email: email,
      name: "Dmitry",
      surname: "Mikhailov",
      phone: "+79000000000",
      telegram: "@dmihail528",
      whatsapp: "+79000000000",
      passwordHash: passwordHash,
      role: "manager",
    });

    console.log("✅ Пользователь успешно создан!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`ID: ${result[0].insertId}`);
  } catch (error) {
    console.error("❌ Ошибка при создании пользователя:", error.message);
  } finally {
    await connection.end();
  }
}

createUser();

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema.js";

async function updateUserRole() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection, { schema, mode: "default" });

  const email = "dmihail528@gmail.com";

  try {
    const result = await db
      .update(schema.users)
      .set({ role: "admin" })
      .where(eq(schema.users.email, email));

    console.log("✅ Роль пользователя успешно обновлена!");
    console.log(`Email: ${email}`);
    console.log(`New Role: admin`);
  } catch (error) {
    console.error("❌ Ошибка при обновлении роли:", error.message);
  } finally {
    await connection.end();
  }
}

updateUserRole();

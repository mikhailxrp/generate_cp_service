import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Не авторизован" },
        { status: 401 }
      );
    }

    const db = getDb();

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

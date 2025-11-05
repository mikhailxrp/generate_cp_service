import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const db = getDb();

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
      })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, user });
  } catch (error) {
    console.error("Get public user error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

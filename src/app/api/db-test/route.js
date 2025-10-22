import { db } from "@/db/index";
import { users } from "@/db/schema";

export async function GET() {
  const rows = await db.select().from(users);
  return Response.json({ ok: true, users: rows.length });
}

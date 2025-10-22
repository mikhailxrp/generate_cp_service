// src/app/api/price-count/route.js
import { db } from "@/db/index";
import { priceItems } from "@/db/schema";

export async function GET() {
  const rows = await db.select().from(priceItems);
  return Response.json({ ok: true, count: rows.length });
}

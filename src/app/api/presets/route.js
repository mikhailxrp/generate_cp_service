import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { presets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();

    const useCase = String(body.useCase || body.use_case || "").trim();
    if (!useCase) {
      return NextResponse.json(
        { error: "useCase обязателен" },
        { status: 400 }
      );
    }
    const rangeKwp = body.rangeKwp ?? body.range_kwp ?? null;
    const inverterSku = body.inverterSku ?? body.inverter_sku ?? null;
    const essSku = body.essSku ?? body.ess_sku ?? null;
    const pcsSku = body.pcsSku ?? body.pcs_sku ?? null;
    const mountSku = body.mountSku ?? body.mount_sku ?? null;
    const notes = body.notes ?? null;
    let pvModuleSkus = body.pvModuleSkus ?? body.pv_module_skus ?? [];
    if (!Array.isArray(pvModuleSkus)) pvModuleSkus = [];

    const db = getDb();
    console.log("[api/presets] insert useCase=", useCase);
    const insertResult = await db.insert(presets).values({
      useCase,
      rangeKwp: rangeKwp ? String(rangeKwp) : null,
      pvModuleSkus,
      inverterSku: inverterSku ? String(inverterSku) : null,
      essSku: essSku ? String(essSku) : null,
      pcsSku: pcsSku ? String(pcsSku) : null,
      mountSku: mountSku ? String(mountSku) : null,
      notes: notes ? String(notes) : null,
    });
    const insertId = insertResult.insertId;

    if (insertId) {
      const result = await db
        .select()
        .from(presets)
        .where(eq(presets.id, insertId))
        .limit(1);
      if (result.length > 0) {
        return NextResponse.json({
          success: true,
          data: result[0],
          message: "Пресет создан",
        });
      }
    }

    const last = await db
      .select()
      .from(presets)
      .where(eq(presets.useCase, useCase))
      .orderBy(desc(presets.id))
      .limit(1);
    if (last.length > 0) {
      return NextResponse.json({
        success: true,
        data: last[0],
        message: "Пресет создан",
      });
    }

    return NextResponse.json(
      { error: "Создано, но не удалось получить запись" },
      { status: 500 }
    );
  } catch (error) {
    console.error("/api/presets POST error", error);
    return NextResponse.json(
      { error: `Внутренняя ошибка: ${error.message}` },
      { status: 500 }
    );
  }
}

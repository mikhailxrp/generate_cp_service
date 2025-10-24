import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { lat, lon, peakpower, loss, angle, aspect, direction } = body;

    // Валидация входных данных
    if (!lat || !lon || !peakpower || !angle || !aspect) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные параметры" },
        { status: 400 }
      );
    }

    // Здесь будет запрос к внешнему API для получения данных солнечной радиации
    // Например, к PVGIS API или другому сервису
    const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc`;

    const params = new URLSearchParams({
      lat: lat,
      lon: lon,
      peakpower: peakpower,
      loss: loss || 14,
      angle: angle,
      aspect: aspect,
      outputformat: "json",
      browser: "0",
    });

    const pvgisResponse = await fetch(`${pvgisUrl}?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": "CP-Generator-App",
      },
    });

    if (!pvgisResponse.ok) {
      throw new Error(`PVGIS API error: ${pvgisResponse.status}`);
    }

    const pvgisData = await pvgisResponse.json();

    // Обрабатываем данные от PVGIS
    const processedData = {
      direction: direction,
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
      parameters: {
        peakpower: parseFloat(peakpower),
        loss: parseFloat(loss || 14),
        angle: parseFloat(angle),
        aspect: parseFloat(aspect),
      },
      pvgisData: pvgisData,
      // Извлекаем основные показатели
      summary: {
        yearlyTotal: pvgisData?.outputs?.totals?.fixed?.E_y || 0,
        monthlyAverage: pvgisData?.outputs?.totals?.fixed?.E_m || 0,
        dailyAverage: pvgisData?.outputs?.totals?.fixed?.E_d || 0,
        specificYield: pvgisData?.outputs?.totals?.fixed?.H_y || 0,
      },
      monthlyData: pvgisData?.outputs?.monthly?.fixed || [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: processedData,
    });
  } catch (error) {
    console.error("Ошибка в solar-radiation API:", error);

    return NextResponse.json(
      {
        error: "Ошибка при получении данных солнечной радиации",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Для тестирования можно добавить GET метод
export async function GET() {
  return NextResponse.json({
    message: "Solar Radiation API готов к работе",
    endpoints: {
      POST: "/api/solar-radiation - получение данных солнечной радиации",
    },
    requiredParams: {
      lat: "широта",
      lon: "долгота",
      peakpower: "установленная мощность",
      angle: "угол наклона",
      aspect: "азимут",
      loss: "потери (опционально, по умолчанию 14%)",
      direction: "номер направления",
    },
  });
}

"use client";
import { useState, useEffect } from "react";
import { updateCombinedDataAction } from "@/app/actions/updateCombinedData";

/**
 * Универсально суммирует месяцы по 1..N направлениям.
 * Поддерживаемые входы:
 *  - [ {month,...}, ... ]
 *  - [ [ {month,...} ], [ {month,...} ], ... ]
 *  - [ { monthlyData: [ {month,...}, ... ] }, ... ]
 */
function combineMonthlyDataFlexible(
  input,
  {
    scaleByKw = 1, // число или массив чисел по направлениям
    numericKeys = ["E_d", "E_m", "H_d", "H_m", "SD_m"],
    scaleKeys = ["E_d", "E_m"], // масштабируем только энергию
  } = {}
) {
  if (!Array.isArray(input) || input.length === 0) return [];

  // Нормализуем в массив направлений: directions = [dir1[], dir2[], ...]
  const isMonthObj = (v) => v && typeof v === "object" && "month" in v;
  let directions;

  if (isMonthObj(input[0])) {
    // один массив месяцев
    directions = [input];
  } else if (Array.isArray(input[0])) {
    // массив направлений [[...], [...]]
    directions = input;
  } else if (input[0] && Array.isArray(input[0].monthlyData)) {
    // [{ monthlyData: [...] }, ...]
    directions = input.map((d) => d.monthlyData || []).filter(Array.isArray);
  } else {
    // ничего из ожидаемого — возвращаем пусто
    return [];
  }

  // Масштабы по направлениям
  const scales = Array.isArray(scaleByKw)
    ? scaleByKw
    : Array.from({ length: directions.length }, () => Number(scaleByKw) || 1);

  // Инициализация результата на 12 месяцев
  const byMonth = new Map();
  for (let m = 1; m <= 12; m++) {
    const init = { month: m };
    for (const k of numericKeys) init[k] = 0;
    byMonth.set(m, init);
  }

  // Складываем
  directions.forEach((dir, i) => {
    const scale = Number(scales[i]);
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    if (!Array.isArray(dir)) return;
    dir.forEach((row) => {
      if (!row || typeof row !== "object") return;
      const m = Number(row.month);
      if (!Number.isInteger(m) || m < 1 || m > 12) return;

      const acc = byMonth.get(m);
      numericKeys.forEach((key) => {
        const raw = Number(row[key]);
        if (!Number.isFinite(raw)) return;
        acc[key] += scaleKeys.includes(key) ? raw * safeScale : raw;
      });
    });
  });

  return Array.from(byMonth.values());
}

export default function GraphVisualForm({ step, id, cpData }) {
  const directionsCount = cpData?.directionsCount || 1;

  const [currentDirection, setCurrentDirection] = useState(1);
  const [allDirectionsData, setAllDirectionsData] = useState([]);
  const [formData, setFormData] = useState({
    lat: "",
    lon: "",
    peakpower: "",
    loss: 14,
    angle: "",
    aspect: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!cpData?.clientAddress) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            cpData.clientAddress
          )}&limit=1`,
          {
            headers: {
              "User-Agent": "CP-Generator-App",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при получении координат");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            lat: data[0].lat,
            lon: data[0].lon,
          }));
        } else {
          setError("Координаты для данного адреса не найдены");
        }
      } catch (err) {
        setError(err.message);
        console.error("Ошибка получения координат:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [cpData?.clientAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // API запрос для получения данных солнечной радиации
      const response = await fetch("/api/solar-radiation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          direction: currentDirection,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при получении данных");
      }

      const responseData = await response.json();

      // Добавляем данные в массив
      const newDirectionData = {
        direction: currentDirection,
        monthlyData: responseData.data.monthlyData,
      };

      // Обновляем состояние и получаем новое значение
      setAllDirectionsData((prev) => {
        const updatedData = [...prev, newDirectionData];
        return updatedData;
      });

      // Переходим к следующему направлению или завершаем
      if (currentDirection < directionsCount) {
        setCurrentDirection((prev) => prev + 1);
        // Сбрасываем форму для следующего направления (кроме координат)
        setFormData((prev) => ({
          ...prev,
          peakpower: "",
          angle: "",
          aspect: "",
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error("Ошибка отправки данных:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateGraph = async () => {
    const combinedData = combineMonthlyDataFlexible(allDirectionsData);

    try {
      // Сохраняем данные в базу и переходим на следующий шаг
      await updateCombinedDataAction(id, combinedData, step);

      // Сбрасываем массив данных
      setAllDirectionsData([]);
      setCurrentDirection(1);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      setError("Ошибка при сохранении данных");
    }
  };

  const isAllDirectionsCompleted = allDirectionsData.length === directionsCount;

  return (
    <div className="wrapper-form px-5">
      <h2 className="title-block text-center">
        Блок солнечная радиация в регионе
      </h2>

      {/* Показываем прогресс */}
      {directionsCount > 1 && (
        <div className="alert alert-info text-center">
          Направление {currentDirection} из {directionsCount}
          {allDirectionsData.length > 0 && (
            <div className="mt-2">
              Завершено направлений: {allDirectionsData.length}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="alert alert-info">
          Получение координат для: {cpData?.clientAddress}...
        </div>
      )}
      {error && <div className="alert alert-warning">{error}</div>}

      {/* Показываем форму только если не все направления завершены */}
      {!isAllDirectionsCompleted && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="latitude" className="form-label">
              Координаты latitude
            </label>
            <input
              type="text"
              className="form-control"
              id="latitude"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="longitude" className="form-label">
              Координаты longitude
            </label>
            <input
              type="text"
              className="form-control"
              id="longitude"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="peakpower" className="form-label">
              Installed peak PV power
            </label>
            <input
              type="text"
              className="form-control"
              id="peakpower"
              name="peakpower"
              value={formData.peakpower}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="angle" className="form-label">
              Angle of inclination
            </label>
            <input
              type="text"
              className="form-control"
              id="angle"
              name="angle"
              value={formData.angle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="aspect" className="form-label">
              Aspect ratio
            </label>
            <input
              type="text"
              className="form-control"
              id="aspect"
              name="aspect"
              value={formData.aspect}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 mt-4 btn-wrapper">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Отправка..."
                : currentDirection < directionsCount
                ? `Отправить данные (${currentDirection}/${directionsCount})`
                : "Отправить данные"}
            </button>
          </div>
        </form>
      )}

      {/* Показываем кнопку генерации графика когда все направления завершены */}
      {isAllDirectionsCompleted && (
        <div className="text-center">
          <div className="alert alert-success">
            Все направления завершены! Собрано данных:{" "}
            {allDirectionsData.length}
          </div>
          <button
            className="btn btn-success btn-lg"
            onClick={handleGenerateGraph}
          >
            Сгенерировать график
          </button>
        </div>
      )}

      {/* Показываем собранные данные для отладки */}
      {allDirectionsData.length > 0 && (
        <div className="mt-4">
          <h5>Собранные данные:</h5>
          {allDirectionsData.map((data, index) => (
            <div key={index} className="alert alert-secondary">
              <strong>Направление {data.direction}:</strong>
              <br />
              Количество месяцев: {data.monthlyData?.length || 0}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

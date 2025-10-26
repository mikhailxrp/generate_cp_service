"use client";
import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Плагин для отображения значений над столбцами
const dataLabelsPlugin = {
  id: "dataLabels",
  afterDatasetsDraw: (chart) => {
    const { ctx, data, chartArea } = chart;
    ctx.save();

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const data = dataset.data[index];
        if (data !== null && data !== undefined) {
          const x = bar.x;
          const y = bar.y - 10; // позиция над столбцом

          ctx.fillStyle = "#000";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(Number(data).toFixed(3), x, y);
        }
      });
    });

    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  dataLabelsPlugin // Регистрируем плагин
);

export default function GraphCard({ graphData, onTotalGenerationCalculated }) {
  if (!graphData || !Array.isArray(graphData) || graphData.length === 0) {
    return (
      <div className="card mt-3">
        <div className="card-body">
          <p className="text-muted">Нет данных для отображения графика</p>
        </div>
      </div>
    );
  }

  // Названия месяцев на русском
  const monthNames = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  // Подготавливаем данные для графика (переводим в тысячи кВтч)
  const labels = graphData.map((item) => monthNames[item.month - 1]);
  const dataValues = graphData.map((item) => (item.E_m || 0) / 1000); // переводим в тысячи кВтч

  // Вычисляем общую годовую генерацию
  const totalAnnualGeneration = dataValues.reduce(
    (sum, value) => sum + value,
    0
  );

  // Уведомляем родительский компонент о вычисленном значении
  const prevTotalRef = useRef(null);
  useEffect(() => {
    if (
      onTotalGenerationCalculated &&
      totalAnnualGeneration > 0 &&
      prevTotalRef.current !== totalAnnualGeneration
    ) {
      prevTotalRef.current = totalAnnualGeneration;
      onTotalGenerationCalculated(totalAnnualGeneration);
    }
  }, [totalAnnualGeneration, onTotalGenerationCalculated]);

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: dataValues,
        backgroundColor: "#28a745",
        borderColor: "#28a745",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "тыс. кВт*ч в месяц",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${Number(context.parsed.y).toFixed(3)} тыс. кВт*ч`;
          },
        },
      },
      dataLabels: dataLabelsPlugin, // Подключаем плагин в options
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false, // скрываем Y-ось как на скриншоте
      },
      x: {
        display: true,
        grid: {
          display: false, // убираем сетку
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div>
          <Bar data={data} options={options} />
        </div>
        <p
          className="text-center text-muted small"
          style={{ marginBottom: "0", marginTop: "10px" }}
        >
          Выработка СЭС разная от месяца к месяцу и зависит от количество
          солнечных дней
        </p>
      </div>
    </div>
  );
}

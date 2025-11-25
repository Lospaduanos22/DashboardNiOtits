import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-doughnutlabel-v3";

Chart.register(ChartDataLabels);

export default function Gauge({ value, label, color }) {
  const percentage = Math.min(Math.max(value, 0), 100);

  const data = {
    labels: [],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false },
      datalabels: {
        labels: {
          value: {
            color: "#111",
            font: { size: 24, weight: "bold" },
            formatter: () => `${value}%`,
          },
          label: {
            color: "#6b7280",
            font: { size: 14 },
            formatter: () => label,
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} height={150} />;
}

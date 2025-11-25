import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    timestamp: "--",
    temperature: "--",
    humidity: "--",
  });
  const [allData, setAllData] = useState({ timestamps: [], temps: [], hums: [] });
  const [filter, setFilter] = useState("monthly"); // daily, monthly, yearly
  const [currentDate, setCurrentDate] = useState(new Date());

  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const sheetName = import.meta.env.VITE_GOOGLE_SHEET_NAME;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
      );
      const data = await res.json();
      if (!data.values || data.values.length < 2) return;

      const rows = data.values.slice(1);

      // Parse timestamp and filter
      const filteredRows = rows.filter((row) => {
        if (!row[0]) return false;

        const [datePart, timePart] = row[0].split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);

        const timestamp = new Date(year, month - 1, day, hours, minutes, seconds);

        if (filter === "daily") {
          return (
            timestamp.getFullYear() === currentDate.getFullYear() &&
            timestamp.getMonth() === currentDate.getMonth() &&
            timestamp.getDate() === currentDate.getDate()
          );
        } else if (filter === "monthly") {
          return (
            timestamp.getFullYear() === currentDate.getFullYear() &&
            timestamp.getMonth() === currentDate.getMonth()
          );
        } else if (filter === "yearly") {
          return timestamp.getFullYear() === currentDate.getFullYear();
        }
        return true;
      });

      const lastRow = filteredRows[filteredRows.length - 1] || rows[rows.length - 1];

      setSensorData({
        timestamp: lastRow[0],
        temperature: lastRow[1] + "°C",
        humidity: lastRow[2] + "%",
      });

      const timestamps = filteredRows.map((r) => r[0]);
      const temps = filteredRows.map((r) => Number(r[1]));
      const hums = filteredRows.map((r) => Number(r[2]));
      setAllData({ timestamps, temps, hums });
    } catch (err) {
      console.error("Error fetching Google Sheet:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, [filter, currentDate]);

  const changePeriod = (direction) => {
    const newDate = new Date(currentDate);
    if (filter === "daily") newDate.setDate(currentDate.getDate() + direction);
    if (filter === "monthly") newDate.setMonth(currentDate.getMonth() + direction);
    if (filter === "yearly") newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const periodLabel = () => {
    if (filter === "daily") return currentDate.toLocaleDateString();
    if (filter === "monthly")
      return currentDate.toLocaleString("default", { month: "long", year: "numeric" });
    if (filter === "yearly") return currentDate.getFullYear();
  };

  const tempChartData = {
    labels: allData.timestamps,
    datasets: [
      {
        label: "Temperature (°C)",
        data: allData.temps,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.3,
      },
    ],
  };

  const humidityChartData = {
    labels: allData.timestamps,
    datasets: [
      {
        label: "Humidity (%)",
        data: allData.hums,
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: true }, y: { beginAtZero: false } },
    elements: { point: { radius: 2 } },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sensor Dashboard</h2>
      <p className="text-gray-500 mb-2">Last updated: {sensorData.timestamp}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Card */}
        <div className="p-6 bg-white shadow rounded-lg flex flex-col">
          <h3 className="text-xl font-semibold">Temperature</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.temperature}</p>

          <div className="flex items-center justify-center mt-4 border-t pt-2 mb-2 gap-4 text-gray-600">
            <button onClick={() => changePeriod(-1)}>&lt;</button>
            <select
              className="border rounded px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={() => changePeriod(1)}>&gt;</button>
            <span className="ml-2">{periodLabel()}</span>
          </div>

          <Line data={tempChartData} options={chartOptions} height={100} />
        </div>

        {/* Humidity Card */}
        <div className="p-6 bg-white shadow rounded-lg flex flex-col">
          <h3 className="text-xl font-semibold">Humidity</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.humidity}</p>

          <div className="flex items-center justify-center mt-4 border-t pt-2 mb-2 gap-4 text-gray-600">
            <button onClick={() => changePeriod(-1)}>&lt;</button>
            <select
              className="border rounded px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={() => changePeriod(1)}>&gt;</button>
            <span className="ml-2">{periodLabel()}</span>
          </div>

          <Line data={humidityChartData} options={chartOptions} height={100} />
        </div>
      </div>
    </div>
  );
}

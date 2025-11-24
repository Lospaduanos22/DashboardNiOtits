import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    timestamp: "--",
    temperature: "--",
    humidity: "--",
  });

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
      const lastRow = rows[rows.length - 1];

      setSensorData({
        timestamp: lastRow[0],
        temperature: lastRow[1] + "°C",
        humidity: lastRow[2] + "%",
      });
    } catch (err) {
      console.error("Error fetching Google Sheet:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sensor Dashboard</h2>
      <p className="text-gray-500 mb-2">Last updated: {sensorData.timestamp}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Temperature</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.temperature}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Humidity</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.humidity}</p>
        </div>
      </div>
    </div>
  );
}

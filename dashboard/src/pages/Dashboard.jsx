import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
  });

  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const sheetName = import.meta.env.VITE_GOOGLE_SHEET_NAME;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
const fetchData = async () => {
  console.log("Fetching data...");
  console.log("sheetId:", sheetId, "sheetName:", sheetName, "apiKey:", apiKey);

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
    );
    const data = await res.json();
    console.log("API data:", data); // Debugging: see what API returns

    if (!data.values || data.values.length < 2) return; // no data

    const headers = data.values[0];
    const rows = data.values.slice(1);

    const latest = {};
    rows.forEach((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      const sensor = obj.Sensor?.toLowerCase();
      if (!sensor) return;
      latest[sensor] = obj.Value;
    });

    setSensorData({
      temperature: latest["temperature"] ? latest["temperature"] + "°C" : "--",
      humidity: latest["humidity"] ? latest["humidity"] + "%" : "--",
    });
  } catch (err) {
    console.error("Error fetching Google Sheet:", err);
  }
};


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sensor Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Temperature</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.temperature}</p>
          <p className="text-gray-500 mt-1">Living Room Sensor</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Humidity</h3>
          <p className="text-4xl font-bold mt-2">{sensorData.humidity}</p>
          <p className="text-gray-500 mt-1">Living Room Sensor</p>
        </div>
      </div>
    </div>
  );
}

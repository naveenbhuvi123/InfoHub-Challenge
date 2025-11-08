// src/components/WeatherModule.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherModule.css";

const cities = [
  "Hyderabad",
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bengaluru",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Vijayawada",
  "Visakhapatnam",
  "Goa",
  "Coimbatore",
  "Bhopal",
];

export default function WeatherModule() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [loading, setLoading] = useState(false);

  // Fetch weather data for a given city
  const fetchWeather = async (selectedCity) => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/weather?city=${selectedCity}`)

      setData(res.data);
      setCity(selectedCity);
    } catch (err) {
      console.error("Weather fetch failed:", err.message);
      setData({ error: "Could not fetch weather data." });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch every 10 seconds, rotating cities
  useEffect(() => {
    fetchWeather(city); // initial fetch

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * cities.length);
      const nextCity = cities[randomIndex];
      console.log(`🌦 Auto-switching to ${nextCity}`);
      fetchWeather(nextCity);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module">
      <h2>
        🌦 Live Weather Updates
        <span className="live-dot"></span>
      </h2>

      {loading && <p>Loading...</p>}

      {data && !data.error && (
        <div className="weather-info">
          <h3>{data.city}</h3>
          <p>Temperature: {data.temperature}</p>
          <p>Condition: {data.condition}</p>
          <p>Humidity: {data.humidity}</p>
          <p>Wind: {data.wind}</p>
          <p className="refresh-text">
            🔁 Updating automatically every 10 seconds
          </p>
        </div>
      )}

      {data && data.error && <p className="error-text">{data.error}</p>}
    </div>
  );
}

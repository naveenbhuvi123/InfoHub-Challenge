// server.js
// InfoHub backend - Weather, Currency, and Quotes API

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// -----------------------------
// Root route (basic test)
// -----------------------------
app.get("/", (req, res) => {
  res.json({
    status: "✅ InfoHub backend is running fine",
    apis: {
      weather: process.env.WEATHER_API_KEY ? "configured" : "missing",
      exchange: process.env.EXCHANGE_API_KEY ? "configured" : "missing"
    }
  });
});


// -----------------------------
// Quotes API (ZenQuotes + fallback)
// -----------------------------
const backupQuotes = [
  "The best way to get started is to quit talking and begin doing. – Walt Disney",
  "Don’t let yesterday take up too much of today. – Will Rogers",
  "Dream big and dare to fail. – Norman Vaughan",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "Success is not final, failure is not fatal: it’s the courage to continue that counts. – Winston Churchill"
];

app.get("/api/quote", async (req, res) => {
  try {
    const resp = await axios.get("https://zenquotes.io/api/random");
    const data = resp.data[0];
    res.json({
      quote: data.q,
      author: data.a
    });
  } catch (err) {
    console.log("Quote API failed, sending backup one instead");
    const random = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
    res.json({ quote: random, author: "Local Quote" });
  }
});


// -----------------------------
// Weather API (OpenWeatherMap)
// -----------------------------
app.get("/api/weather", async (req, res) => {
  const city = req.query.city || "Hyderabad";
  const key = process.env.WEATHER_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "Weather API key not found" });
  }

  try {
    const url = "https://api.openweathermap.org/data/2.5/weather";
    const response = await axios.get(url, {
      params: { q: city, appid: key, units: "metric" }
    });

    const d = response.data;
    const weather = {
      city: d.name,
      temperature: `${Math.round(d.main.temp)}°C`,
      condition: d.weather[0].description,
      humidity: `${d.main.humidity}%`,
      wind: `${d.wind.speed} m/s`
    };

    res.json(weather);
  } catch (err) {
    console.log("Weather API failed:", err.message);
    res.status(500).json({ error: "Could not fetch weather data" });
  }
});


// -----------------------------
// Currency API (ExchangeRate API)
// -----------------------------
app.get("/api/currency", async (req, res) => {
  const amount = Number(req.query.amount) || 1;
  const key = process.env.EXCHANGE_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "Currency API key not found" });
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${key}/latest/INR`;
    const r = await axios.get(url);
    const rates = r.data.conversion_rates;

    if (!rates) throw new Error("Invalid response from exchange API");

    const result = {
      base: "INR",
      amount,
      usd: (amount * rates.USD).toFixed(2),
      eur: (amount * rates.EUR).toFixed(2)
    };

    res.json(result);
  } catch (err) {
    console.log("Currency conversion failed:", err.message);
    res.status(500).json({ error: "Could not fetch currency data" });
  }
});


// -----------------------------
//  Catch-all (if route not found)
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// -----------------------------
//  Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

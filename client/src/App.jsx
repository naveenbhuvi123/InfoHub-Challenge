// src/App.jsx
import { useState , useEffect} from "react";
import WeatherModule from "./components/WeatherModule/WeatherModule";
import CurrencyConverter from "./components/CurrencyConverter/CurrencyConverter";
import QuoteGenerator from "./components/QuotesGenerator/QuoteGenerator";
import "./App.css";

// App component controls navigation between modules and updates the background dynamically
export default function App() {
  // Tracks which tab is currently active (weather/currency/quote)
  const [activeTab, setActiveTab] = useState("weather");

  // Stores the gradient style that updates based on the active tab
  const [bgStyle, setBgStyle] = useState("");

  // Runs whenever the active tab changes and updates page background
  useEffect(() => {
    let gradient = "";

    // Switch-case selects gradient style based on current tab
    switch (activeTab) {
      case "weather":
        gradient = "linear-gradient(to bottom right, #6dd5ed, #2193b0)"; 
        break;

      case "currency":
        gradient = "linear-gradient(to bottom right, #f0c27b, #4b1248)";
        break;

      case "quote":
        gradient = "linear-gradient(to bottom right, #cc2b5e, #753a88)";
        break;

      // Fallback gradient
      default:
        gradient = "linear-gradient(to bottom right, #6dd5ed, #2193b0)";
    }

    // Sets the new gradient so UI updates reactively
    setBgStyle(gradient);
  }, [activeTab]);

  return (
    // Main application container with dynamic background gradient applied
    <div className="app-container" style={{ backgroundImage: bgStyle }}>

      {/* Header containing title and navigation buttons */}
      <header className="nav-header">
        <h1 className="app-title">🌐 InfoHub</h1>

        {/* Navigation bar for switching between modules */}
        <nav className="nav-buttons">

          {/* Weather Tab Button */}
          <button
            className={`nav-btn ${activeTab === "weather" ? "active" : ""}`}
            onClick={() => setActiveTab("weather")}
          >
            Weather
          </button>

          {/* Currency Tab Button */}
          <button
            className={`nav-btn ${activeTab === "currency" ? "active" : ""}`}
            onClick={() => setActiveTab("currency")}
          >
            Currency
          </button>

          {/* Quotes Tab Button */}
          <button
            className={`nav-btn ${activeTab === "quote" ? "active" : ""}`}
            onClick={() => setActiveTab("quote")}
          >
            Quotes
          </button>
        </nav>
      </header>

      {/* Content area that fades in when tab switches */}
      <div className="content-box fade-in">
        {/* If 'weather' tab is active, show weather module */}
        {activeTab === "weather" && <WeatherModule />}

        {/* If 'currency' tab is active, show currency converter */}
        {activeTab === "currency" && <CurrencyConverter />}

        {/* If 'quote' tab is active, show quote generator */}
        {activeTab === "quote" && <QuoteGenerator />}
      </div>
    </div>
  );
}

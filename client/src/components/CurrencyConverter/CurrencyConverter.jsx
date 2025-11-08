import { useState } from "react";
import axios from "axios";
import "./CurrencyCoverter.css";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1); // holds INR amount input
  const [data, setData] = useState(null); // stores API response after conversion
  const [loading, setLoading] = useState(false); // indicates whether API request is in progress // loader

  const fetchCurrency = async () => {
    if (!amount || amount <= 0) return alert("Please enter a valid amount");
    try {
      setLoading(true); // start loader before request
      // fetching the response from the backend
      const res = await axios.get(`/api/currency?amount=${amount}`); 
      setData(res.data); // save fetched currency info
    } catch (err) {
      console.error("Currency fetch failed:", err.message); // log error message
      setData({ error: "Unable to fetch currency data." });
    } finally {
      setLoading(false); // stoping the  loader after request
    }
  };

  return (
    <div className="module currency-module">
      <h2>💱 Currency Converter</h2>

      <div className="input-group">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // update input state whenever typed(e.target.value)} // track value
          placeholder="Enter amount in INR"
        />
        <button onClick={fetchCurrency}>Convert</button>
      </div>

      {loading && <p className="loading">Fetching latest rates...</p>}

      {data && !data.error && (
        <div className="currency-info">
          <h3>Base: {data.base}</h3>
          <p>
            USD: <span className="highlight">{data.usd}</span>
          </p>
          <p>
            EUR: <span className="highlight">{data.eur}</span>
          </p>
          <p>
            Amount Entered: <span className="highlight">{data.amount}</span>
          </p>
        </div>
      )}

      {data && data.error && <p className="error-text">{data.error}</p>}
    </div>
  );
}

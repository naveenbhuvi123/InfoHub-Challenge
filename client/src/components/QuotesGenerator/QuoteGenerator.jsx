import { useEffect, useState } from "react";
import axios from "axios";
import "./QuoteGenerator.css";

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(""); // stores quote text
  const [author, setAuthor] = useState(""); // stores quote author
  const [loading, setLoading] = useState(false); // toggles loading state

  const fetchQuote = async () => {
    try {
      setLoading(true); // start loading
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quote`); // fetch random quote
      setQuote(res.data.quote); // update quote
      setAuthor(res.data.author); // update author
    } catch (error) {
      console.error("Quote fetch failed:", error.message); // log error
      setQuote("Unable to fetch quote at this moment."); // fallback text
      setAuthor(""); // no author
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchQuote(); // auto-load quote on mount
  }, []);

  return (
    <div className="quote-module">
      <h2>💬 Quote of the Moment</h2>

      {loading ? (
        <p className="loading">Fetching inspiration...</p> // show loader
      ) : (
        <>
          <p className="quote-text">{quote}</p>
          {author && <p className="quote-author">- {author}</p>} 
        </>
      )}

      <button className="quote-btn" onClick={fetchQuote}> 
        New Quote
      </button>
    </div>
  );
}

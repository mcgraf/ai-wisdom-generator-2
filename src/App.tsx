import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2 } from 'lucide-react';

function App() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      const storedQuote = localStorage.getItem('wisdomQuote');
      const storedTimestamp = localStorage.getItem('quoteTimestamp');

      if (storedQuote && storedTimestamp) {
        const currentTime = new Date().getTime();
        const storedTime = parseInt(storedTimestamp, 10);

        if (currentTime - storedTime < 24 * 60 * 60 * 1000) {
          setQuote(storedQuote);
          setLoading(false);
          return;
        }
      }

      try {
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
          {
            contents: [{ parts: [{ text: 'Generate a unique and inspiring wisdom quote.' }] }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
            },
          }
        );

        const generatedQuote = response.data.candidates[0].content.parts[0].text;
        setQuote(generatedQuote);
        localStorage.setItem('wisdomQuote', generatedQuote);
        localStorage.setItem('quoteTimestamp', new Date().getTime().toString());
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Error fetching quote. Please try again later.');
      }

      setLoading(false);
    };

    fetchQuote();
  }, []);

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Daily Wisdom Quote',
        text: quote,
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported on this device.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col starry-bg">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 animate-fade-in text-white text-center">
              {quote}
            </p>
            <button
              onClick={shareQuote}
              className="bg-white text-blue-900 px-3 py-1 text-sm rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
            >
              <Share2 className="mr-1" size={16} />
              Share
            </button>
          </>
        )}
      </main>
      <footer className="mt-auto p-4 text-center text-xs text-gray-400">
        <p>© 2024 Wisdom Quote Generator. All rights reserved.</p>
        <p>Powered by Gemini 1.5 Pro API</p>
        <p>
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
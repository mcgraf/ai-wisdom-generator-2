'use client';

import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';

export default function QuoteDisplay() {
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
        const response = await fetch('/api/quote');
        const data = await response.json();
        
        if (data.quote) {
          setQuote(data.quote);
          localStorage.setItem('wisdomQuote', data.quote);
          localStorage.setItem('quoteTimestamp', new Date().getTime().toString());
        } else {
          throw new Error('Failed to fetch quote');
        }
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
    <>
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
    </>
  );
}
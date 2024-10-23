import QuoteDisplay from '@/components/QuoteDisplay';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col starry-bg">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <QuoteDisplay />
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
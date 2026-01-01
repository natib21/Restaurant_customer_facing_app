import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStartSession } from '../hooks/useStartSession';
import Spinner from './Spinner';

export default function DataFetcherComponent() {
  const navigate = useNavigate();
  const { startSession } = useStartSession();
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      // 1. Extract params from URL
      const urlParams = new URLSearchParams(window.location.search);
      const data = urlParams.get('data');
      const s = urlParams.get('s');

      if (!data || !s) {
        setError("Invalid Link: Please scan the QR code again.");
        return;
      }

      // Prevent double execution in React Strict Mode
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        // 2. Get the session token
        const token = await startSession(data, s);

        if (token) {
          // 3. Go straight to menu (we skip createCustomer for now)
          navigate("/menu");
        } else {
          throw new Error("Session initialization failed.");
        }
      } catch (err) {
        console.error("Initialization Error:", err);
        setError("Connection error. Please try again.");
      }
    };

    initializeApp();
  }, [navigate, startSession]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="p-6 border border-red-500 rounded-lg bg-gray-800">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Spinner />
      <p className="mt-4 text-amber-400 animate-pulse">Loading Menu...</p>
    </div>
  );
}
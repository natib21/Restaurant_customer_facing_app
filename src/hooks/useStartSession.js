import { useCallback } from 'react';
import axios from 'axios';
import { sessionUrl } from '../url/url';

export const useStartSession = () => {
  const startSession = useCallback(async (dataParam, sParam) => {
    if (!dataParam || !sParam) {
      console.error("Missing data or signature parameters.");
      return null;
    }

    try {
      const res = await axios.post(
        `${sessionUrl}data=${dataParam}&s=${sParam}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status === "success") {
        const token = res.data.data.sessionToken;
        // Save for future page refreshes
        localStorage.setItem("sessionToken", token);
        return token; // Return it so the component can use it immediately
      }
      return null;
    } catch (err) {
      console.error("Error starting session:", err.message);
      throw err;
    }
  }, []);

  return { startSession };
};
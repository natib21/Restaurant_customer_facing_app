// hooks/useStartSession.js
import { useCallback } from 'react';
import axios from 'axios';
import { sessionUrl } from '../url/url';

export const useStartSession = (dataParam, sParam, customerLogin, setLoading, setSessionToken) => {
  return useCallback(async (startLogin = false) => {
    if (!dataParam || !sParam) {
      console.error("Missing data or signature parameters to start session.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${sessionUrl}data=${dataParam}&s=${sParam}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.status === "success") {
        const token = res.data.data.sessionToken;
        setSessionToken(token);
        localStorage.setItem("sessionToken", token);
        
        if (startLogin) {
          await customerLogin(token);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error starting session:", err.response?.data || err.message);
    }
  }, [dataParam, sParam, customerLogin, setLoading, setSessionToken]);
};
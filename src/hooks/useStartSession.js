import { useCallback } from 'react';
import axios from 'axios';
import { sessionUrl, startSessionApiUrl } from '../url/url';

export const useStartSession = () => {
  const startSession = useCallback(async (dataParam, sParam) => {
    if (!dataParam || !sParam) {
      console.warn("Missing data or signature parameters.");
      return null;
    }

    try {
      // Try primary endpoint first
      let res = null;
      try {
        res = await axios.post(
          `${sessionUrl}data=${encodeURIComponent(dataParam)}&s=${encodeURIComponent(sParam)}`,
          {},
          { headers: { "Content-Type": "application/json" }, timeout: 4000 }
        );
      } catch {
        // Fallback to standard endpoint format
        try {
          res = await axios.post(
            `${startSessionApiUrl}?data=${encodeURIComponent(dataParam)}&s=${encodeURIComponent(sParam)}`,
            {},
            { headers: { "Content-Type": "application/json" }, timeout: 4000 }
          );
        } catch {
          res = null;
        }
      }

      if (res?.data?.status === "success" || res?.data?.data?.sessionToken) {
        const sessionData = res.data.data;
        const token = sessionData.sessionToken;

        const fullSession = {
          sessionToken: token,
          sessionId: sessionData.sessionId || sessionData.id || `SES-${Date.now()}`,
          tableId: sessionData.tableId || null,
          tableNumber: sessionData.tableNumber || sessionData.table || "T-101",
          merchantId: sessionData.merchantId || null,
          branchId: sessionData.branchId || null,
          merchantName: sessionData.merchantName || res.data.restaurant || "Golden Fork Restaurant",
          branchName: sessionData.branchName || "Main Branch",
          expiresAt: sessionData.expiresAt || null,
        };

        // Save for session restoration on refresh
        localStorage.setItem("sessionToken", token);
        localStorage.setItem("qrSession", JSON.stringify(fullSession));
        if (fullSession.tableNumber) {
          localStorage.setItem("tableNumber", fullSession.tableNumber);
        }

        return fullSession;
      }

      const errorMessage = res?.data?.message || "Invalid QR code or session failed to start.";
      throw new Error(errorMessage);
    } catch (err) {
      console.error("Error starting session from backend:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  return { startSession };
};

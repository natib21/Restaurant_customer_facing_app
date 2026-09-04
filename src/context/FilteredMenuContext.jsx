import { createContext, useMemo, useState, useEffect, useCallback, useContext } from "react";
import { useFetchMenu } from "../hooks/useFetchMenu";
import { useStartSession } from "../hooks/useStartSession";
import axios from "axios";
import { getBranchUrl } from "../url/url";
import { BrandingContext } from "./BrandingContext";

const FilteredMenuContext = createContext();

function FilteredMenuProvider({ children }) {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Stored QR Session Object
  const [qrSession, setQrSession] = useState(() => {
    try {
      const saved = localStorage.getItem("qrSession");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return qrSession?.sessionToken || localStorage.getItem("sessionToken") || null;
  });

  const [tableNumber, setTableNumber] = useState(() => {
    return qrSession?.tableNumber || localStorage.getItem("tableNumber") || "T-101";
  });

  // Strict session readiness flag: menu fetching only runs when session is ready
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const { startSession } = useStartSession();
  const { setBranding, defaults: brandingDefaults } = useContext(BrandingContext);
  
  // Menu is ONLY fetched after startSession response has been processed (enabled: isSessionReady)
  const { 
    menu, 
    menuGroups, 
    isLoading: isMenuLoading, 
    error: menuError, 
    restaurant: fetchedRestaurant, 
    branch: fetchedBranch,
    refetchMenu 
  } = useFetchMenu(token, { enabled: isSessionReady });

  // Initialize Session from URL parameters sequentially
  const initializeFromUrl = useCallback(async () => {
    setIsInitializing(true);
    setIsSessionReady(false);
    setSessionError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    const s = urlParams.get('s');
    const table = urlParams.get('table') || urlParams.get('tableNumber') || urlParams.get('t');

    if (table) {
      setTableNumber(table);
      localStorage.setItem("tableNumber", table);
    }

    try {
      // 1. First check if a valid session already exists in localStorage
      const savedSessionRaw = localStorage.getItem("qrSession");
      const savedToken = localStorage.getItem("sessionToken");

      let existingSession = null;
      if (savedSessionRaw) {
        try {
          existingSession = JSON.parse(savedSessionRaw);
        } catch {
          existingSession = null;
        }
      }

      const isSavedSessionValid = Boolean(
        (existingSession?.sessionToken || savedToken) &&
        (!existingSession?.expiresAt || new Date(existingSession.expiresAt).getTime() > Date.now())
      );

      // If we already have a valid session in storage, use it directly without re-posting to startSession
      if (isSavedSessionValid) {
        if (existingSession) {
          setQrSession(existingSession);
          setToken(existingSession.sessionToken || savedToken);
          if (existingSession.tableNumber) {
            setTableNumber(existingSession.tableNumber);
          }
        } else if (savedToken) {
          setToken(savedToken);
        }
        setIsSessionReady(true);
        return;
      }

      // 2. If no valid stored session exists, verify and initiate via QR URL params if available
      if (data && s) {
        const sessionResult = await startSession(data, s);
        if (sessionResult && sessionResult.sessionToken) {
          setQrSession(sessionResult);
          setToken(sessionResult.sessionToken);
          if (sessionResult.tableNumber) {
            setTableNumber(sessionResult.tableNumber);
          }

          // Extract branchId from session result (robust extraction)
          const branchId = sessionResult.branchId || sessionResult.branch?._id || sessionResult.branch?.id || sessionResult.branch || null;

          // Fetch branch & merchant branding details before marking session ready
          if (branchId) {
            try {
              const headers = { "Content-Type": "application/json" };
              if (sessionResult.sessionToken) headers["Authorization"] = `Bearer ${sessionResult.sessionToken}`;
              const resp = await axios.get(getBranchUrl(branchId), { headers, timeout: 6000 });
              let branchData = resp?.data?.data || resp?.data || {};
              // API may return { data: { branch: { ... } } }
              branchData = branchData.branch || branchData;

              const merchantName = branchData?.merchant?.businessName || branchData?.merchant?.name || branchData?.merchantName || branchData?.merchant?.merchantName || branchData?.name || brandingDefaults.merchantName;

              const logoUrl = branchData?.merchant?.logo || branchData?.merchant?.settings?.branding?.logo || branchData?.logo || branchData?.branding?.logo || branchData?.merchant?.branding?.logo || brandingDefaults.logoUrl;

              const primaryColor = branchData?.merchant?.brandColor || branchData?.branding?.primaryColor || branchData?.merchant?.branding?.primaryColor || brandingDefaults.primaryColor;

              setBranding({ primaryColor, logoUrl, merchantName });
            } catch (err) {
              console.warn("Failed to fetch branch branding, using defaults:", err?.message || err);
              setBranding(brandingDefaults);
            }
          } else {
            // No branch id in session result - apply defaults
            setBranding(brandingDefaults);
          }

          setIsSessionReady(true);
        } else {
          setSessionError("Unable to open this table. The QR code signature may be invalid or expired.");
          setIsSessionReady(true);
        }
      } else {
        // No QR params in URL and no valid storage -> initialize default table session
        setBranding(brandingDefaults);
        setIsSessionReady(true);
      }
    } catch (err) {
      console.error("Session initialization error:", err);
      setSessionError("Unable to open this table. Please try scanning again.");
      setIsSessionReady(true);
    } finally {
      setIsInitializing(false);
    }
  }, [startSession]);

  useEffect(() => {
    let ignore = false;

    const runInit = async () => {
      if (!ignore) {
        await initializeFromUrl();
      }
    };

    const timer = setTimeout(() => {
      runInit();
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [initializeFromUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const isSessionExpired = Boolean(
    qrSession?.expiresAt && new Date(qrSession.expiresAt).getTime() < currentTime
  );

  // Restaurant & Branch names
  const restaurantName = qrSession?.merchantName || fetchedRestaurant || "Golden Fork Restaurant";
  const branchName = qrSession?.branchName || fetchedBranch || "Downtown Branch";

  // Categories list
  const categories = useMemo(() => {
    if (!menu || menu.length === 0) return ["All"];
    const set = new Set(["All"]);
    menu.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [menu]);

  // Filtered menu items
  const filteredMenus = useMemo(() => {
    const safeSearch = (searchValue || '').toLowerCase().trim();
    return (menu || []).filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!safeSearch) return true;

      const safeName = (item.name || '').toLowerCase();
      const safeDesc = (item.description || '').toLowerCase();
      const safeCategory = (item.category || '').toLowerCase();
      return safeName.includes(safeSearch) || safeDesc.includes(safeSearch) || safeCategory.includes(safeSearch);
    });
  }, [menu, searchValue, activeCategory]);

  return (
    <FilteredMenuContext.Provider value={{ 
      qrSession,
      token,
      isSessionReady,
      filteredMenus, 
      menu,
      menuGroups,
      categories,
      activeCategory,
      setActiveCategory,
      searchValue, 
      setSearchValue, 
      restaurant: restaurantName,
      branch: branchName,
      tableNumber,
      setTableNumber,
      isSessionExpired,
      sessionError,
      retrySession: initializeFromUrl,
      refetchMenu,
      isLoading: isInitializing || (isSessionReady && isMenuLoading), 
      error: sessionError || menuError 
    }}>
      {children}
    </FilteredMenuContext.Provider>
  );
}

export { FilteredMenuContext, FilteredMenuProvider };



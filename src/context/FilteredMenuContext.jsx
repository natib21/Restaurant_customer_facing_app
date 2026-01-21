import { createContext, useMemo, useState, useEffect } from "react";
import { useFetchMenu } from "../hooks/useFetchMenu";
import { useStartSession } from "../hooks/useStartSession";

const FilteredMenuContext = createContext();

// FilteredMenuContext.js
function FilteredMenuProvider({ children }) {
  const [searchValue, setSearchValue] = useState("");
  const [token, setToken] = useState(null); 
  const [sessionError, setSessionError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { startSession } = useStartSession();
  
  // Pass the token state directly into the hook
  const { menu, isLoading: isMenuLoading, error: menuError, restaurant } = useFetchMenu(token);

 useEffect(() => {
    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const data = urlParams.get('data');
      const s = urlParams.get('s');

      try {
        if (data && s) {
          // 1. Get NEW token
          const newToken = await startSession(data, s);
          // 2. Update state (This triggers useFetchMenu)
          setToken(newToken); 
        } else {
          // 3. Fallback to existing token if no URL params
          const savedToken = localStorage.getItem("sessionToken");
          if (savedToken) setToken(savedToken);
        }
      } catch (err) {
        console.log(err)
        setSessionError("Failed to initialize session.");
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, [startSession]);

  const filteredMenus = useMemo(() => {
    return (menu || []).filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menu, searchValue]);

  return (
    <FilteredMenuContext.Provider value={{ 
      filteredMenus, 
      menu, 
      searchValue, 
      setSearchValue, 
      restaurant,
      // Only show loading if we are still initializing session OR fetching menu
      isLoading: isInitializing || (token && isMenuLoading), 
      error: sessionError || menuError 
    }}>
      {children}
    </FilteredMenuContext.Provider>
  );
}

export { FilteredMenuContext, FilteredMenuProvider };
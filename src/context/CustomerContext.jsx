import { createContext, useState, useEffect, useMemo } from "react";

const CustomerContext = createContext();

function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem("currentCustomer");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever customer changes
  useEffect(() => {
    try {
      if (customer) {
        localStorage.setItem("currentCustomer", JSON.stringify(customer));
      } else {
        localStorage.removeItem("currentCustomer");
      }
    } catch (err) {
      console.error("Failed to save customer data to localStorage:", err);
    }
  }, [customer]);

  const login = (customerData) => {
    const enriched = {
      ...customerData,
      loyaltyPoints: customerData.loyaltyPoints ?? 120,
      savedAt: customerData.savedAt || new Date().toISOString(),
    };
    setCustomer(enriched);
  };

  const updateCustomer = (partialData) => {
    setCustomer((prev) => (prev ? { ...prev, ...partialData } : partialData));
  };

  const logout = () => {
    setCustomer(null);
  };

  const value = useMemo(() => ({
    customer,
    login,
    updateCustomer,
    logout,
    isLoggedIn: !!customer,
  }), [customer]);

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export { CustomerContext, CustomerProvider };

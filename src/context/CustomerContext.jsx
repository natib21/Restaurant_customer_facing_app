import { createContext, useState, useEffect, useMemo } from "react";

const CustomerContext = createContext();

function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("currentCustomer");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist to localStorage whenever customer changes
  useEffect(() => {
    if (customer) {
      localStorage.setItem("currentCustomer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("currentCustomer");
    }
  }, [customer]);

  const login = (customerData) => {
    console.log("Context: Logging in customer", customerData);
    setCustomer(customerData);
  };

  const logout = () => {
    setCustomer(null);
  };

  const value = useMemo(() => ({
    customer,
    login,
    logout,
    isLoggedIn: !!customer
  }), [customer]);

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export { CustomerContext, CustomerProvider };
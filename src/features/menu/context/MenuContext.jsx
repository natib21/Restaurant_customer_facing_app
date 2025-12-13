// MenuContext.js
import { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(null); // Menu data will be set after fetch
  console.log(menu)

  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to use the menu context
// eslint-disable-next-line react-refresh/only-export-components
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
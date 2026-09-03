import { useState, useEffect } from 'react';

/**
 * Hook to access current table session information
 */
export const useSession = () => {
  const [sessionToken, setSessionToken] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('sessionToken') : null;
  });
  const [tableNumber, setTableNumber] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('tableNumber') : null;
  });
  const [restaurantId, setRestaurantId] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('restaurantId') : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      setSessionToken(localStorage.getItem('sessionToken'));
      setTableNumber(localStorage.getItem('tableNumber'));
      setRestaurantId(localStorage.getItem('restaurantId'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    sessionToken,
    tableNumber,
    restaurantId,
    isAuthenticated: Boolean(sessionToken),
  };
};

export default useSession;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPublicMenuUrl } from '../url/url';

// Pass the token into the hook

export function useFetchMenu(token) {
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ABORT if no token is provided yet
    if (!token) return;

    async function getMenu() {
      try {
        setIsLoading(true);
        const res = await axios.get(getPublicMenuUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Uses the fresh state token
            "Content-Type": "application/json",
          }
        });
        setMenu(res.data?.data?.menus || []);
        console.log("Menu",res.data?.data?.menus)
       
        setRestaurant(res.data?.restaurant)
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getMenu();
  }, [token]); // This is the trigger!

  return { menu, isLoading, error, restaurant };
}
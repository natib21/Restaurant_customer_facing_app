import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPublicMenuUrl } from '../url/url';

export function useFetchMenu() {
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the token INSIDE the useEffect so it's fresh when the component mounts
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setError("No session token found. Please login again.");
      setIsLoading(false);
      return;
    }

    async function getMenu() {
      try {
        setIsLoading(true);
        const res = await axios.get(getPublicMenuUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        // Use optional chaining to prevent crashes if data structure is missing
        setMenu(res.data?.data?.menus || []);
        setRestaurant(res.data?.restaurant || null);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getMenu();
  }, []); // Only runs once on mount

  return { menu, restaurant, isLoading, error };
}
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getPublicMenuUrl, getPublicMenuAltUrl } from '../url/url';

export function useFetchMenu(token, options = {}) {
  const { enabled = true } = options;
  const [menu, setMenu] = useState([]);
  const [menuGroups, setMenuGroups] = useState([]);
  const [restaurant, setRestaurant] = useState("Golden Fork Restaurant");
  const [branch, setBranch] = useState("Downtown Branch");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuData = useCallback(async (sessionToken) => {
    const activeToken = sessionToken || token;
    try {
      setIsLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
      };
      if (activeToken) {
        headers["Authorization"] = `Bearer ${activeToken}`;
      }

      let res = null;
      let fetchErr = null;
      try {
        res = await axios.get(getPublicMenuUrl, { headers, timeout: 8000 });
      } catch (err1) {
        fetchErr = err1;
        try {
          res = await axios.get(getPublicMenuAltUrl, { headers, timeout: 8000 });
          fetchErr = null;
        } catch (err2) {
          fetchErr = err2;
          res = null;
        }
      }

      if (res && res.data) {
        const data = res?.data?.data || res?.data || {};
        
        if (res.data?.restaurant) {
          setRestaurant(typeof res.data.restaurant === "string" ? res.data.restaurant : res.data.restaurant?.name || "Golden Fork Restaurant");
        } else if (data?.restaurant) {
          setRestaurant(typeof data.restaurant === "string" ? data.restaurant : data.restaurant?.name || "Golden Fork Restaurant");
        } else if (data?.merchantName) {
          setRestaurant(data.merchantName);
        }
        if (data?.branchName) {
          setBranch(data.branchName);
        }

        let rawItems = [];
        let rawGroups = [];

        if (Array.isArray(data?.menuGroups) && data.menuGroups.length > 0) {
          rawGroups = data.menuGroups;
          rawItems = data.menuGroups.flatMap((group) => 
            (group.items || []).map((item) => ({
              ...item,
              category: item.category || group.name || group.categoryName || "General",
            }))
          );
        } else if (Array.isArray(data?.menus)) {
          rawItems = data.menus;
        } else if (Array.isArray(data?.items)) {
          rawItems = data.items;
        } else if (Array.isArray(data)) {
          rawItems = data;
        }

        if (rawItems && rawItems.length > 0) {
          const normalizedItems = rawItems.map((item, idx) => {
            const id = item._id || item.id || `item-${idx + 1}`;
            const isAvailable = item.isAvailable !== false && item.available !== false;
            
            // Extract multilingual or string name
            let itemName = `Special Dish #${idx + 1}`;
            if (typeof item.name === "string") {
              itemName = item.name;
            } else if (item.name && typeof item.name === "object") {
              itemName = item.name.en || item.name.am || Object.values(item.name).find(v => typeof v === "string") || itemName;
            }

            // Extract multilingual or string description
            let itemDesc = "";
            if (typeof item.description === "string") {
              itemDesc = item.description;
            } else if (item.description && typeof item.description === "object") {
              itemDesc = item.description.en || item.description.am || Object.values(item.description).find(v => typeof v === "string") || "";
            }

            // Extract category name
            let categoryName = "General";
            if (typeof item.category === "string") {
              categoryName = item.category;
            } else if (item.category && typeof item.category === "object") {
              if (typeof item.category.name === "string") {
                categoryName = item.category.name;
              } else if (item.category.name && typeof item.category.name === "object") {
                categoryName = item.category.name.en || item.category.name.am || Object.values(item.category.name).find(v => typeof v === "string") || "General";
              }
            } else if (item.categoryName) {
              categoryName = item.categoryName;
            } else if (item.displayedIn) {
              if (typeof item.displayedIn === "string") {
                categoryName = item.displayedIn;
              } else if (typeof item.displayedIn === "object") {
                categoryName = item.displayedIn.en || item.displayedIn.am || "General";
              }
            }

            // Extract image URL or path
            let imageUrl = item.image || item.imageUrl || item.imagePath || "";
            if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
              imageUrl = `https://restaurant-bo.onrender.com${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }

            return {
              id,
              _id: id,
              name: itemName,
              description: itemDesc,
              price: Number(item.price || item.unitPrice || 0),
              image: imageUrl,
              category: categoryName,
              isAvailable,
              isVegetarian: Boolean(item.isVeg || item.isVegetarian || item.tags?.includes("vegetarian") || categoryName.toLowerCase().includes("salad")),
              isVegan: Boolean(item.isVegan || item.tags?.includes("vegan")),
              spicyLevel: item.isSpicy ? (typeof item.spicyLevel === "number" ? item.spicyLevel : 2) : (item.spicyLevel || 0),
              prepTime: item.prepTime || (item.preparationTime ? `${item.preparationTime} min` : "15-20 min"),
              allergens: item.allergens || [],
              rating: item.rating ? String(item.rating) : "4.8",
              optionGroups: Array.isArray(item.options) ? item.options : (Array.isArray(item.optionGroups) ? item.optionGroups : []),
              variants: Array.isArray(item.variants) ? item.variants : []
            };
          });

          setMenu(normalizedItems);
          setMenuGroups(rawGroups);
          setError(null);
          return normalizedItems;
        } else {
          setMenu([]);
          setMenuGroups([]);
          setError(null);
          return [];
        }
      }

      if (fetchErr) {
        const message = fetchErr?.response?.data?.message || fetchErr?.message || "Failed to fetch menu from server.";
        setError(message);
        setMenu([]);
      }
      return [];
    } catch (err) {
      console.error("Error fetching API menu:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load menu");
      setMenu([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let ignore = false;

    if (!enabled) {
      return;
    }

    const load = async () => {
      if (!ignore) {
        await fetchMenuData();
      }
    };

    const timer = setTimeout(() => {
      load();
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [enabled, token, fetchMenuData]);

  return { menu, menuGroups, isLoading, error, restaurant, branch, refetchMenu: fetchMenuData };
}



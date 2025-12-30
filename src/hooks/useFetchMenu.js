import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPublicMenuUrl } from '../url/url';

 const token = localStorage.getItem("sessionToken");
// In a real app, the token would come from a context, state, or storage.

export function useFetchMenu() {
    // State to hold the fetched menu data
    const [menu, setMenu] = useState([]);
    // State to hold the restaurant information
    const [restaurant, setRestaurant] = useState(null);
    // State for loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for any error that occurs during fetching
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to perform the data fetching
        async function getMenu() {
            setIsLoading(true); // Start loading
            setError(null);    // Clear previous errors

            try {
                const menuRes = await axios.get(
                    getPublicMenuUrl,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                // Check for a successful status code (often 200-299)
                if (menuRes.status === 200) {
                    const data = menuRes.data;

                    console.log("menu data", data.data.menus);
                    console.log("restaurant", data.restaurant);

                    // Update state with fetched data
                    setMenu(data.data.menus || []);
                    setRestaurant(data.restaurant || null);
                } else {
                    // Handle non-200 status codes if necessary
                    throw new Error(`Failed to fetch menu with status: ${menuRes.status}`);
                }

            } catch (err) {
                // Catch network errors, request timeouts, or errors thrown above
                console.error("Error fetching menu:", err);
                setError(err.message || "An unknown error occurred while fetching the menu.");

            } finally {
                // This runs regardless of try or catch
                setIsLoading(false);
            }
        }

        getMenu();
        // The empty dependency array [] ensures this runs only once after the initial render.
    }, []); 

    // Return the states so the component can use them
    return { menu, restaurant, isLoading, error };
}
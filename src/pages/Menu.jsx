import { useState, useMemo, useEffect, useContext } from "react";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { useFetchMenu } from "../hooks/useFetchMenu.js";
import Spinner from "../components/Spinner.jsx";

export default function Menu() {
  // 1. Hooks
  const { menu, restaurant, isLoading, error } = useFetchMenu();
  const [searchValue, setSearchValue] = useState("");
  const { cartItems, totalItems } = useContext(CartContext);

  const filteredMenus = useMemo(() => {
    // Safety check: ensure menu is an array before filtering
    return (menu || []).filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menu, searchValue]);

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 2. Event Handlers
  function onSearchChange(value) {
    setSearchValue(value);
  }

  // 3. Conditional Rendering
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 font-bold">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 4. Main Render
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Pass the specific name string from the restaurant object */}
      <Header 
        restaurantName={restaurant?.name || "Our Menu"} 
        totalItems={totalItems} 
        onSearchChange={onSearchChange} 
      />

      {filteredMenus.length > 0 ? (
        <Main menus={filteredMenus} />
      ) : (
        <div className="flex-1 flex justify-center items-center text-gray-400">
          No items match your search.
        </div>
      )}

      {totalItems > 0 && <Footer />}
    </div>
  );
}
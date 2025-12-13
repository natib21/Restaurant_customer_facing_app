import { useState, useMemo, useEffect, useContext } from "react";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { useFetchMenu } from "../hooks/useFetchMenu.js";
import Spinner from "../components/Spinner.jsx";

export default function Menu() {
  
  // ------------------------------------------------
  // 1. ALL HOOKS ARE CALLED UNCONDITIONALLY AT THE TOP
  // ------------------------------------------------

  // Custom hook to fetch data
  const { menu, restaurant, isLoading, error } = useFetchMenu();

  // State hook
  const [searchValue, setSearchValue] = useState("");
  
  // Context hook
  const { cartItems, totalItems } = useContext(CartContext);
  
  // Memo hook
  const filteredMenus = useMemo(() => {
    return menu.filter((menu) =>
      menu.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menu, searchValue]);

  // Effect hook
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);
  
  
  // Non-hook function definition (position is flexible)
  function onSearchChange(value) {
    setSearchValue(value);
  }

  // ------------------------------------------------
  // 2. CONDITIONAL RENDERING (Early Returns) GO HERE
  // ------------------------------------------------
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // ------------------------------------------------
  // 3. MAIN RENDER
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header - Sticky */}
      <Header restaurantName={restaurant} totalItems={totalItems} onSearchChange={onSearchChange} />

      <Main menus={filteredMenus} />

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <Footer />
      )}
    </div>
  );
}
import React, { useState, useMemo, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Cart from "../features/menu/components/Cart";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";


export default function Menu() {
  const { state } = useLocation();
  const {cartItems,  totalItems} = useContext(CartContext)
  const menus = useMemo(() => state?.data?.menus || [], [state]);

  const restaurant = state?.restaurant || "Menu";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);


  function onSearchChange (value) {
    setSearchValue(value);

  }

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) =>
      menu.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [menus, searchValue]);


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header - Sticky */}
      <Header restaurantName={restaurant} totalItems={totalItems} onCartOpen={() => setIsModalOpen(true)} onSearchChange={onSearchChange} />

       
       <Main menus={filteredMenus} />

      {/* Cart Modal */}
      {isModalOpen && (
        <Cart
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <Footer />
      )}
    </div>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cart from "../features/menu/components/Cart";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";


export default function Menu() {
  const { state } = useLocation();
  const menus = state?.data?.menus || [];
  const restaurant = state?.restaurant || "Menu";

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("shoppingCart");
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Could not parse cart from local storage", e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (menuItem) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === menuItem.id);
    if (existingItemIndex > -1) {
      const updatedCart = cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...menuItem, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (itemId, change) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingItemIndex === -1) return prevItems;

      const updatedItems = [...prevItems];
      const currentItem = updatedItems[existingItemIndex];
      const newQuantity = currentItem.quantity + change;

      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId);
      }

      updatedItems[existingItemIndex] = { ...currentItem, quantity: newQuantity };
      return updatedItems;
    });
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const totalSum = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cartItems]);



  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header - Sticky */}
      <Header restaurantName={restaurant} totalItems={totalItems} onCartOpen={() => setIsModalOpen(true)} />

      {/* Main Content Area - Scrollable */}
      
      <Main menus={menus}
  cartItems={cartItems}
  handleAddToCart={handleAddToCart}
  handleUpdateQuantity={handleUpdateQuantity}
  handleRemoveItem={handleRemoveItem}/>

      {/* Cart Modal */}
      {isModalOpen && (
        <Cart
          cartItems={cartItems}
          totalSum={totalSum}
          onClose={() => setIsModalOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <Footer totalSum = {totalSum} totalItems={totalItems} setIsModalOpen={setIsModalOpen}/>
      )}
    </div>
  );
}

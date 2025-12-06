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
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        
        {/* Menu Items - Card Layout Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6 pb-32">
          {menus.map((item) => {
            const cartItem = cartItems.find((cartItem) => cartItem.id === item.id)
            const quantity = cartItem ? cartItem.quantity : 0

            return (
              <div
                key={item.id}
                className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-5 border border-gray-100 hover:border-amber-300 flex flex-col h-full"
              >
                {/* Product Image */}
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-sm mb-3"
                />

                {/* Product Info */}
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h2>

                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 flex-1">{item.description}</p>

                {/* Price and Rating Row */}
                <div className="flex justify-between items-start mt-3 mb-3">
                  <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    ETB {item.price}
                  </p>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">⭐ {item.rating}</p>
                    <p className="text-xs text-amber-600 font-semibold">{item.prepTime}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {quantity > 0 ? (
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="flex-1 py-1 px-1.5 text-amber-700 hover:bg-amber-200 rounded transition font-bold text-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="flex-1 font-bold text-amber-900 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex-1 py-1 px-1.5 text-amber-700 hover:bg-amber-200 rounded transition font-bold text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex-1 text-red-950 hover:text-red-900 transition hover:bg-red-50 rounded-lg py-1"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-auto w-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-2 sm:py-2.5 px-3 rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 uppercase tracking-wide text-xs sm:text-sm"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </main>

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

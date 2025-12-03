import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

// 🛍️ Cart Notification Component (Nested/Local Component)
const CartNotification = ({ cartItems, onOpen }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) {
    return null;
  }

  return (
    <button
      onClick={onOpen}
      // Fixed position, positioned slightly higher than the new footer on mobile (md:top-5)
      className="fixed top-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-xl z-50 flex items-center space-x-2 cursor-pointer transform hover:scale-105 transition duration-300 md:top-5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="font-bold text-lg">{totalItems}</span>
    </button>
  );
};

// 💰 New Footer Component (Nested/Local Component)
const CartFooter = ({ totalSum, totalItems, onOpen }) => {
  if (totalItems === 0) {
    return null;
  }
  
  return (
    // Fixed bottom for mobile-first visibility
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-red-500 shadow-2xl z-40 p-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Total Sum Display */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
            Cart Total ({totalItems})
          </span>
          <span className="text-xl font-extrabold text-red-600 sm:text-2xl">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        {/* View Cart Button */}
        <button
          onClick={onOpen}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 text-base shadow-md w-1/2 max-w-[200px]"
        >
          View Order
        </button>
      </div>
    </div>
  );
};


// 🛒 CartModal Component (Nested/Local Component)
const CartModal = ({
  cartItems,
  totalSum,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // Handles empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart (0 Items)</h2>
          <p className="text-gray-600">Your cart is currently empty. Start adding some delicious items!</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content - Mobile: takes most of the screen width, limited height */}
      <div className="bg-white rounded-lg shadow-2xl p-5 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto transform transition duration-300 scale-100 sm:p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Cart Item List */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between items-start border-b last:border-b-0 pb-3 sm:flex-row sm:items-center"
            >
              
              {/* Item Info */}
              <div className="flex items-center space-x-3 w-full mb-2 sm:mb-0 sm:w-2/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md sm:w-16 sm:h-16"
                />
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    ETB {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controls and Subtotal */}
              <div className="flex items-center space-x-3 w-full justify-between sm:space-x-4 sm:w-3/5">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 px-2 text-lg text-gray-700 hover:bg-gray-100 rounded-l-lg transition sm:px-3 sm:text-xl"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="p-1 font-medium text-gray-800 w-6 text-center sm:w-8">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 px-2 text-lg text-gray-700 hover:bg-gray-100 rounded-r-lg transition sm:px-3 sm:text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Item Subtotal */}
                <p className="font-bold text-green-600 w-20 text-right sm:w-24">
                  ETB {(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 transition"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Sum */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-extrabold text-red-600 sm:text-3xl">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        {/* Non-Functional Order Button */}
        <button
          onClick={() => alert("Order functionality is not yet implemented!")}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg uppercase tracking-wider"
        >
          Proceed to Order (Non-Functional)
        </button>
      </div>
    </div>
  );
};

// 🍔 Main Menu Component
export default function Menu() {
  const { state } = useLocation();
  const menus = state?.data?.menus || [];
  const restaurant = state?.restaurant || "Menu";

  // State Initialization from Local Storage
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

  // Effect for Local Storage Persistence
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Handlers (No change needed here)
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

  // Memoized Total Sum Calculation
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

  // Determine padding needed for the fixed footer
  const footerPaddingClass = totalItems > 0 ? 'pb-[85px]' : 'pb-4'; 

  return (
    <div className={`min-h-screen bg-gray-50 p-4 sm:p-6 ${footerPaddingClass}`}>
      
      {/* 1. Cart Notification */}
      <CartNotification cartItems={cartItems} onOpen={() => setIsModalOpen(true)} />

      {/* 2. Cart Modal */}
      {isModalOpen && (
        <CartModal
          cartItems={cartItems}
          totalSum={totalSum}
          onClose={() => setIsModalOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {/* Header (Cleaned up, removed Subtotal) */}
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          {restaurant}
        </h1>
        {/* Removed redundant Total display here */}
      </div>

      <hr className="mb-5 sm:mb-6" />

      {/* 3. Menu Items Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menus.map((item) => {
          const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-4 flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg sm:h-48"
              />

              <h2 className="text-lg font-semibold mt-3 text-gray-800 flex-grow sm:text-xl">
                {item.name}
              </h2>

              <p className="text-gray-600 text-xs mt-2 line-clamp-2 sm:text-sm">
                {item.description}
              </p>

              <div className="flex justify-between items-center mt-3 sm:mt-4">
                <p className="text-lg font-bold text-green-600">
                  ETB {item.price}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  ⭐ {item.rating} | {item.prepTime}
                </p>
              </div>
              
              {/* QUANTITY CONTROL / ADD TO CART LOGIC */}
              {quantity > 0 ? (
                // If item is in cart, show quantity controls
                <div className="mt-3 flex justify-between items-center bg-blue-50 border border-blue-400 rounded-lg p-1 sm:p-2">
                    <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-1 px-2 text-lg text-blue-600 hover:bg-blue-100 rounded-l-md transition"
                        aria-label="Decrease quantity"
                    >
                        –
                    </button>
                    <span className="font-bold text-base text-blue-700 mx-1 sm:text-lg sm:mx-2">
                        {quantity}
                    </span>
                    <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-1 px-2 text-lg text-blue-600 hover:bg-blue-100 rounded-r-md transition"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                    <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700 transition sm:ml-4"
                        aria-label="Remove item"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
              ) : (
                // If item is not in cart, show 'Add to Cart' button
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Cart Footer */}
      <CartFooter 
        totalSum={totalSum} 
        totalItems={totalItems} 
        onOpen={() => setIsModalOpen(true)} 
      />
    </div>
  );
}
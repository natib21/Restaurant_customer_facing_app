import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

// 🛒 CartModal Component
const CartModal = ({
  cartItems,
  totalSum,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart (0 Items)</h2>
          <p className="text-gray-600">Your cart is currently empty. Start adding some delicious items!</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-5 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto transform transition duration-300 scale-100 sm:p-6">
        <div className="flex justify-between items-center border-b border-amber-200 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Your Selection</h2>
          <button
            onClick={onClose}
            className="text-amber-500 hover:text-amber-700 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between items-start border-b border-amber-100 last:border-b-0 pb-3 sm:flex-row sm:items-center"
            >
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

              <div className="flex items-center space-x-3 w-full justify-between sm:space-x-4 sm:w-3/5">
                <div className="flex items-center border border-amber-300 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 px-2 text-lg text-amber-700 hover:bg-amber-50 rounded-l-lg transition sm:px-3 sm:text-xl"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="p-1 font-medium text-gray-800 w-6 text-center sm:w-8">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 px-2 text-lg text-amber-700 hover:bg-amber-50 rounded-r-lg transition sm:px-3 sm:text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-amber-600 w-20 text-right sm:w-24">
                  ETB {(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-amber-500 hover:text-amber-700 p-1 transition"
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

        <div className="mt-6 pt-4 border-t-2 border-amber-200 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-amber-600 sm:text-3xl">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => alert("Order functionality is not yet implemented!")}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg uppercase tracking-wider"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  );
};

// 💰 Cart Footer Component
const CartFooter = ({ totalSum, totalItems, onOpen }) => {
  if (totalItems === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-amber-100 uppercase tracking-wider">
            Cart Total ({totalItems} items)
          </span>
          <span className="text-xl font-extrabold text-white sm:text-2xl">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onOpen}
          className="w-full sm:w-auto bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 uppercase tracking-wide text-sm sm:text-base shrink-0"
        >
          View Order
        </button>
      </div>
    </div>
  );
};

function RestaurantHeader({ restaurantName, totalItems, onCartOpen }) {
  return (
    <header className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between md:gap-6 mb-6 md:mb-8 lg:mb-10 bg-white rounded-lg p-3 sm:p-4 md:p-5 border border-gray-100 shadow-sm sticky top-0 z-30">
      {/* Restaurant Name */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl md:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
          {restaurantName}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Delicious food for you</p>
      </div>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <button
          onClick={onCartOpen}
          className="flex items-center gap-2 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-bold text-xs md:text-sm">{totalItems}</span>
        </button>
      )}
    </header>
  )
}

// 🍔 Main Menu Component
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
      <RestaurantHeader restaurantName={restaurant} totalItems={totalItems} onCartOpen={() => setIsModalOpen(true)} />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* <hr className="mb-6 sm:mb-8 border-gray-200" /> */}

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
        <CartModal
          cartItems={cartItems}
          totalSum={totalSum}
          onClose={() => setIsModalOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 max-w-7xl mx-auto">
            {/* Total Sum Display */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-amber-300 uppercase tracking-wider">
                Total cart ({totalItems})
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">ETB {totalSum.toFixed(2)}</span>
            </div>

            {/* View Order Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 uppercase tracking-wide text-sm sm:text-base shrink-0"
            >
              Review Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

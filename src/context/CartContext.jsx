import { createContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
  // Initialize cart from localStorage with safe parsing
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("shoppingCart");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse cart from localStorage:", err);
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  // Add item or increase quantity
  const handleAddToCart = (menuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  };

  // Update quantity (can be +1 / -1)
  const handleUpdateQuantity = (itemId, change) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId) return item;
          const newQty = item.quantity + change;
          if (newQty <= 0) return null; // will be filtered out
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) // remove null items
    );
  };

  // Set exact quantity (useful for input fields)
  const setQuantity = (itemId, newQuantity) => {
    if (newQuantity < 0) return;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId) return item;
          if (newQuantity === 0) return null;
          return { ...item, quantity: newQuantity };
        })
        .filter(Boolean)
    );
  };

  // Remove single item
  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed values (memoized)
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalSum = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = totalItems; // alias - some people prefer this name

  // Value object - only change when needed
  const value = useMemo(
    () => ({
      cartItems,
      handleAddToCart,
      handleUpdateQuantity,
      setQuantity,        // new: direct quantity control
      handleRemoveItem,
      clearCart,          // new: very useful after order
      totalItems,
      totalSum,
      cartCount,
    }),
    [cartItems, totalItems, totalSum,cartCount] // dependencies
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext, CartProvider };
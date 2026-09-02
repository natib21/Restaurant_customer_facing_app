import { createContext, useMemo, useState, useEffect, useCallback } from "react";

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

  // Helper to generate unique cart item key based on id and selected options
  const generateCartItemId = (item, selectedOptions = [], instructions = "") => {
    const sortedOptions = [...selectedOptions]
      .sort((a, b) => (a.choiceName || "").localeCompare(b.choiceName || ""))
      .map(o => `${o.groupName}:${o.choiceName}`)
      .join("|");
    return `${item.id}_${sortedOptions}_${instructions.trim().toLowerCase()}`;
  };

  // Add item with full customization options
  const handleAddCustomizedItem = useCallback(({
    menuItem,
    selectedOptions = [],
    specialInstructions = "",
    quantity = 1,
  }) => {
    const cartItemId = generateCartItemId(menuItem, selectedOptions, specialInstructions);

    // Calculate modifier additions
    const modifiersTotal = selectedOptions.reduce((acc, opt) => acc + Number(opt.priceModifier || 0), 0);
    const unitPrice = Number(menuItem.price || 0) + modifiersTotal;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      }

      const newCartItem = {
        cartItemId,
        id: menuItem.id,
        menuItemId: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        basePrice: Number(menuItem.price || 0),
        unitPrice,
        price: unitPrice,
        quantity,
        totalPrice: unitPrice * quantity,
        selectedOptions,
        specialInstructions: specialInstructions.trim(),
      };

      return [...prev, newCartItem];
    });
  }, []);

  // Standard quick add (defaults to 1 quantity)
  const handleAddToCart = useCallback((menuItem) => {
    handleAddCustomizedItem({
      menuItem,
      selectedOptions: [],
      specialInstructions: "",
      quantity: 1,
    });
  }, [handleAddCustomizedItem]);

  // Update quantity for a specific cartItemId or fallback id
  const handleUpdateQuantity = useCallback((cartItemIdOrId, change) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId) {
            const newQty = item.quantity + change;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  // Set exact quantity
  const setQuantity = useCallback((cartItemIdOrId, newQuantity) => {
    if (newQuantity < 0) return;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId) {
            if (newQuantity === 0) return null;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  // Remove single item
  const handleRemoveItem = useCallback((cartItemIdOrId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId)
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Computed values (memoized)
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity || item.price * item.quantity), 0),
    [cartItems]
  );

  const totalSum = subtotal;
  const cartCount = totalItems;

  const value = useMemo(
    () => ({
      cartItems,
      handleAddToCart,
      handleAddCustomizedItem,
      handleUpdateQuantity,
      setQuantity,
      handleRemoveItem,
      clearCart,
      totalItems,
      subtotal,
      totalSum,
      cartCount,
    }),
    [
      cartItems,
      handleAddToCart,
      handleAddCustomizedItem,
      handleUpdateQuantity,
      setQuantity,
      handleRemoveItem,
      clearCart,
      totalItems,
      subtotal,
      totalSum,
      cartCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext, CartProvider };

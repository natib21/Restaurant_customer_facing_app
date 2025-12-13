import { createContext, useMemo, useState } from "react"

const CartContext = createContext()


function CartProvider({children}) {

    const [cartItems, setCartItems] = useState(() => {
          const savedCart = localStorage.getItem("shoppingCart");
          try {
            return savedCart ? JSON.parse(savedCart) : [];
          } catch (e) {
            console.error("Could not parse cart from local storage", e);
            return [];
          }
        });
       
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
    
   return <CartContext.Provider  value={{totalItems, totalSum, handleAddToCart, handleRemoveItem, handleUpdateQuantity, cartItems, setCartItems}}>
    {children}

   </CartContext.Provider>
}


export {CartContext, CartProvider}
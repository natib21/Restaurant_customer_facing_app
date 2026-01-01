import {  useEffect, useContext } from "react";
import Footer from "../features/menu/components/Footer.jsx";
import Header from "../features/menu/components/Header";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { useFetchMenu } from "../hooks/useFetchMenu.js";
import Spinner from "../components/Spinner.jsx";
import { FilteredMenuContext } from "../context/FilteredMenuContext.jsx";

export default function Menu() {
  const {  isLoading, error } = useFetchMenu();
  const { filteredMenus } = useContext(FilteredMenuContext);

  
  const { cartItems, totalItems } = useContext(CartContext);


 

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <p className="text-red-500 font-bold mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-amber-500 text-white rounded-full font-bold shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">
      
  

     

     

      {/* MAIN CONTENT */}
      <main className="flex-1 p-2 sm:p-4">
        {filteredMenus.length > 0 ? (
          <Main menus={filteredMenus} />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400 py-20">
            <p className="text-lg font-medium">No items match your search.</p>
          </div>
        )}
      </main>

      {totalItems > 0 && <Footer />}
    </div>
  );
}
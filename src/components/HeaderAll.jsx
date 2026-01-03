import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { FilteredMenuContext } from "../context/FilteredMenuContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

import { useState, useMemo } from "react";

export default function HeaderAll() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
 const { searchValue, setSearchValue, menu, restaurant, error } = useContext(FilteredMenuContext); 
 console.log("restaurant", restaurant)
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  

  function handleCartOpen() {
    navigate("/cart");
  }

  // Extract unique categories for the sidebar
  const categories = useMemo(() => {
    if (!menu) return [];
    const cats = menu.map((item) => item.category_name || "General");
    return ["All", ...new Set(cats)];
  }, [menu]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm p-3 sm:p-4 md:px-6 mb-2">
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR DRAWER */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Menu categories</h3>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setIsSidebarOpen(false)}
                className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* FIRST ROW — Menu Icon + Name + Cart */}
      <div className="flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 min-w-0">
          {/* SIDEBAR TOGGLE BUTTON */}

          { !error &&
            <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          }
          

          {/* Restaurant Name */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
              {restaurant}
            </h1>
            <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-wider">
              Delicious food for you
            </p>
          </div>
        </div>

        {/* Cart Button */}
        {!error &&
        <button
          onClick={handleCartOpen}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition shadow-sm
            ${totalItems > 0 ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          disabled={totalItems === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-bold text-xs">{totalItems}</span>
        </button>} 
      </div>
    

      {/* SECOND ROW — Search Bar */}
      <div className="mt-3 flex justify-center">
         {!error && <div className="relative w-full sm:max-w-md">
         
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 text-sm text-amber-400 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition"
          />
        </div>
          }
      </div>

    </header>
  );
}
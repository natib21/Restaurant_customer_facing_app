import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Header({ restaurantName, searchValue, onSearchChange, onToggleSidebar }) {
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  function handleCartOpen() {
    navigate("/cart");
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm p-3 sm:p-4 md:px-6 mb-2">
      
      {/* FIRST ROW — Menu Icon + Name + Cart */}
      <div className="flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 min-w-0">
          {/* SIDEBAR TOGGLE BUTTON */}
          <button 
            onClick={onToggleSidebar}
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

          {/* Restaurant Name */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
              {restaurantName}
            </h1>
            <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-wider">
              Delicious food for you
            </p>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={handleCartOpen}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition shadow-sm
            ${totalItems > 0 ? 'bg-amber-400 hover:bg-amber-500 text-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          disabled={totalItems === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-bold text-xs">{totalItems}</span>
        </button>
      </div>

      {/* SECOND ROW — Search Bar */}
      <div className="mt-3 flex justify-center">
        <div className="relative w-full sm:max-w-md">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition"
          />
        </div>
      </div>

    </header>
  );
}
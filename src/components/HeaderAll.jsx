import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import CallAssistanceModal from "./CallAssistanceModal";

export default function HeaderAll() {
  const navigate = useNavigate();
  const location = useLocation();

  const { restaurant, branch, tableNumber } = useContext(FilteredMenuContext);
  const { cartCount, totalSum } = useContext(CartContext);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);

  const pathname = location.pathname;

  // Suppress top header on loading / landing page
  if (pathname === "/" || pathname === "/qr") {
    return null;
  }

  const navigateTo = (path) => {
    navigate(`${path}${location.search || ""}`);
  };

  return (
    <>
      <header className="w-full top-0 sticky z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#efeeeb] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo & Branch */}
          <div
            onClick={() => navigateTo("/menu")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#005136] text-white flex items-center justify-center shadow-xs group-hover:bg-[#006c49] transition-colors">
              <span className="material-symbols-outlined text-[22px] fill">restaurant</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#005136] tracking-tight leading-tight">
                {restaurant || "Golden Fork"}
              </span>
              <span className="text-[11px] font-medium text-[#3f4943]">
                {branch || "Downtown Branch"}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigateTo("/menu")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                pathname === "/menu" ? "text-[#005136] border-b-2 border-[#005136]" : "text-[#3f4943] hover:text-[#1a1c1a]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              Menu
            </button>

            <button
              onClick={() => navigateTo("/cart")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                pathname === "/cart" ? "text-[#005136] border-b-2 border-[#005136]" : "text-[#3f4943] hover:text-[#1a1c1a]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>

            <button
              onClick={() => navigateTo("/history")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                pathname === "/history" || pathname === "/order" ? "text-[#005136] border-b-2 border-[#005136]" : "text-[#3f4943] hover:text-[#1a1c1a]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Orders
            </button>

            <button
              onClick={() => navigateTo("/favorites")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                pathname === "/favorites" ? "text-[#005136] border-b-2 border-[#005136]" : "text-[#3f4943] hover:text-[#1a1c1a]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              Favorites
            </button>

            <button
              onClick={() => navigateTo("/profile")}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                pathname === "/profile" ? "text-[#005136] border-b-2 border-[#005136]" : "text-[#3f4943] hover:text-[#1a1c1a]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              Profile
            </button>
          </nav>

          {/* Right Action Cluster: Table Badge, Call Waiter, Cart pill */}
          <div className="flex items-center gap-2.5">
            {/* Call Waiter button */}
            <button
              onClick={() => setIsAssistanceOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1a1c1a] rounded-xl text-xs font-semibold transition-colors"
              title="Call Waiter"
            >
              <span className="material-symbols-outlined text-[16px] text-[#005136]">support_agent</span>
              <span className="hidden sm:inline">Assistance</span>
            </button>

            {/* Table Number Badge */}
            <span className="bg-[#efeeeb] border border-[#e3e2e0] text-[#005136] text-xs font-bold px-3 py-1.5 rounded-xl">
              {tableNumber || "T-101"}
            </span>

            {/* Desktop Cart summary */}
            <button
              onClick={() => navigateTo("/cart")}
              className="hidden md:flex items-center gap-2 bg-[#005136] hover:bg-[#006c49] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              <span>{totalSum.toFixed(2)} ETB</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#005136] px-1.5 py-0.2 rounded-full text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Call Assistance Modal */}
      <CallAssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        tableNumber={tableNumber || "T-101"}
      />
    </>
  );
}

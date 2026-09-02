import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const pathname = location.pathname;

  // Suppress bottom nav on transactional loading or completed screens if needed
  if (pathname === "/" || pathname === "/qr" || pathname === "/completed") {
    return null;
  }

  const isMenuActive = pathname === "/menu";
  const isCartActive = pathname === "/cart";
  const isOrdersActive = pathname === "/order" || pathname === "/history" || pathname === "/tracking" || pathname === "/bill";
  const isProfileActive = pathname === "/profile" || pathname === "/favorites" || pathname === "/feedback" || pathname === "/telegram";

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-lg border-t border-[#efeeeb] shadow-[0px_-4px_20px_rgba(0,0,0,0.06)] flex justify-around items-center px-2 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {/* Menu Tab */}
      <button
        onClick={() => navigate(`/menu${location.search || ""}`)}
        className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-xl transition-all duration-200 ${
          isMenuActive
            ? "bg-[#006c49] text-white shadow-sm scale-95 font-semibold"
            : "text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb]"
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] mb-0.5 ${isMenuActive ? "fill" : ""}`}>
          restaurant_menu
        </span>
        <span className="text-[11px] tracking-tight">Menu</span>
      </button>

      {/* Cart Tab */}
      <button
        onClick={() => navigate(`/cart${location.search || ""}`)}
        className={`relative flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-xl transition-all duration-200 ${
          isCartActive
            ? "bg-[#006c49] text-white shadow-sm scale-95 font-semibold"
            : "text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb]"
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] mb-0.5 ${isCartActive ? "fill" : ""}`}>
          shopping_cart
        </span>
        <span className="text-[11px] tracking-tight">Cart</span>

        {/* Counter Badge */}
        {cartCount > 0 && (
          <span className="absolute top-1 right-2.5 bg-[#ba1a1a] text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Orders Tab */}
      <button
        onClick={() => navigate(`/history${location.search || ""}`)}
        className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-xl transition-all duration-200 ${
          isOrdersActive
            ? "bg-[#006c49] text-white shadow-sm scale-95 font-semibold"
            : "text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb]"
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] mb-0.5 ${isOrdersActive ? "fill" : ""}`}>
          receipt_long
        </span>
        <span className="text-[11px] tracking-tight">Orders</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => navigate(`/profile${location.search || ""}`)}
        className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-xl transition-all duration-200 ${
          isProfileActive
            ? "bg-[#006c49] text-white shadow-sm scale-95 font-semibold"
            : "text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb]"
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] mb-0.5 ${isProfileActive ? "fill" : ""}`}>
          person
        </span>
        <span className="text-[11px] tracking-tight">Profile</span>
      </button>
    </nav>
  );
}

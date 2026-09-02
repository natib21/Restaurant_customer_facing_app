import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Footer() {
  const { totalItems, totalSum } = useContext(CartContext);
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  function handleCartOpen() {
    navigate("/cart");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 border-t border-amber-400/80 shadow-2xl p-3 sm:p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-extrabold shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
            </span>
            <span className="text-lg sm:text-2xl font-black text-white">
              ETB {totalSum.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCartOpen}
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-gray-950 font-bold py-2.5 px-5 sm:px-7 rounded-xl transition shadow-lg shadow-amber-400/30 flex items-center gap-2 text-sm sm:text-base shrink-0"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


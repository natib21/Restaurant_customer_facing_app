import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";

export default function Footer({setIsModalOpen }) {
    const {totalItems, totalSum} = useContext(CartContext)
  if (totalItems === 0) return null;



  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium text-amber-300 uppercase tracking-wider">
            Total cart ({totalItems})
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 uppercase tracking-wide text-sm sm:text-base shrink-0"
        >
          Review Cart
        </button>
      </div>
    </div>
  );
}

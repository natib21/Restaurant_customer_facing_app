import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

// Define a common padding value for the main content to accommodate the fixed footer
// Footer height is approximately 6rem (p-4 py-6 md:py-8) + bottom spacing
const FOOTER_HEIGHT_CLASS = "pb-[10rem] md:pb-[10rem] lg:pb-[8rem]"; 


export default function Cart() {

  const navigate = useNavigate()

  const {
    cartItems,
    totalSum,
    handleUpdateQuantity: onUpdateQuantity,
    handleRemoveItem: onRemoveItem,
  } = useContext(CartContext);

  function handleReturnToMenu() {
    navigate("/menu")
  }

  // Mobile-first container for the entire page content
  // min-h-screen ensures it covers the full viewport height
  const pageContainerClass = `container mx-auto px-4 py-8 min-h-screen bg-gray-50 ${FOOTER_HEIGHT_CLASS}`;

  // --- Empty Cart View (Mobile-First Page Layout) ---
  if (cartItems.length === 0) {
    return (
      <div className={`${pageContainerClass} flex flex-col items-center justify-center text-center pb-8`}>
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm md:max-w-md lg:max-w-lg">
          <h1 className="text-3xl font-extrabold text-amber-600 mb-4">Your Cart</h1>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart (0 Items)</h2>
          <p className="text-gray-600 mb-6">Your cart is currently empty. Head back to the menu to find something delicious!</p>
          <button
            onClick={handleReturnToMenu}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 text-lg shadow-md"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  // --- Cart Items View (Mobile-First Page Layout with Sticky Footer) ---
// --- Cart Items View ---
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8"> {/* pb-24 for mobile footer spacing */}
      <div className="container mx-auto px-4 py-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center md:text-left">
          Your Selection
        </h1>

        {/* Main Grid Layout:
          - flex-col on mobile
          - md:flex-row on medium screens 
        */}
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          
          {/* LEFT COLUMN: List of Items (Flexible width) */}
          <div className="flex-grow space-y-4">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-center border-b border-amber-200 pb-3 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Items Summary</h2>
                <span className="text-sm text-gray-500">{cartItems.length} Items</span>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col border-b border-amber-100 last:border-b-0 pb-4">
                    <div className="flex items-start space-x-3 w-full mb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-grow">
                        <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">ETB {item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center border border-amber-300 rounded-lg bg-white">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 text-xl text-amber-700 hover:bg-amber-50 rounded-l-lg">–</button>
                        <span className="px-2 font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 text-xl text-amber-700 hover:bg-amber-50 rounded-r-lg">+</button>
                      </div>
                      <p className="font-bold text-lg text-amber-600">ETB {(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Checkout Card (Fixed width on md+) */}
          <aside className="md:w-[350px] lg:w-[400px] md:sticky md:top-8">
            <div className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-amber-500">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>ETB {totalSum.toFixed(2)}</span>
                </div>
                
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-extrabold text-amber-600">ETB {totalSum.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => alert("Order functionality is not yet implemented!")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] uppercase"
                >
                  Proceed to Order
                </button>
                <button
                  onClick={handleReturnToMenu}
                  className="w-full text-amber-600 font-semibold py-2 hover:underline"
                >
                  ← Back to Menu
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE ONLY: The bottom sticky bar still appears for users on phones */}
      <div className="md:hidden fixed inset-x-0 bottom-0 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.1)] p-4 border-t border-amber-200 z-50">
        <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-xl font-extrabold text-amber-600">ETB {totalSum.toFixed(2)}</span>
        </div>
        <button
            onClick={() => alert("Order!")}
            className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl shadow-md uppercase"
        >
            Proceed to Order
        </button>
      </div>
    </div>
  );
}
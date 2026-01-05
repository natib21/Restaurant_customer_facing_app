import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    totalSum,
    handleUpdateQuantity: onUpdateQuantity,
    handleRemoveItem: onRemoveItem,
  } = useContext(CartContext);

  function handleReturnToMenu() {
    navigate("/menu");
  }
  function goToOrder() {
    navigate("/order")
  }

  // --- Empty Cart View ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-amber-600 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Hungry? Add some delicious items to your cart!</p>
          <button
            onClick={handleReturnToMenu}
            className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl shadow-md"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-8"> {/* pb-32 gives space for mobile floating footer */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-8">
          Your Selection
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          
          {/* LEFT COLUMN: List of Items */}
          <div className="grow space-y-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                <h2 className="font-bold text-gray-800">Items Summary</h2>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{cartItems.length} Items</span>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-3">
                     
                      <div className="grow">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                          <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-amber-600 font-medium mt-1">ETB {item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-50 hover:bg-amber-50 text-amber-700">–</button>
                            <span className="px-3 font-semibold text-sm text-stone-800">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-50 hover:bg-amber-50 text-amber-700">+</button>
                          </div>
                          <p className="font-bold text-gray-900">ETB {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleReturnToMenu} className="w-full text-center py-2 text-amber-600 font-semibold text-sm">
              + Add more to your order
            </button>
          </div>

          {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
          <aside className="hidden md:block w-[350px] sticky top-8">
            <div className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-amber-500">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-extrabold text-amber-600">ETB {totalSum.toFixed(2)}</span>
              </div>
              <button
                onClick={() => goToOrder()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                PROCEED TO ORDER
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* MOBILE FLOATING FOOTER */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-gray-500 font-medium">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">ETB {totalSum.toFixed(2)}</span>
        </div>
        <button
          onClick={() => goToOrder()}
          className="w-full bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg active:bg-amber-600"
        >
          PROCEED TO ORDER
        </button>
      </div>
    </div>
  );
}
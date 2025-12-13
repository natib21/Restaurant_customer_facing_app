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
  return (
    // Outer container for the page
    <div className="min-h-screen bg-gray-50"> 
        {/* Main Content Area - Must scroll independently of the footer */}
        <div className={`${pageContainerClass}`}>
            
            {/* Page Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">Your Selection</h1>
            
            {/* Main Cart Content Container - Constrained width on MD/LG */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">

                {/* Header - Separated from the list */}
                <div className="flex justify-between items-center border-b border-amber-200 pb-3 mb-4">
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Items Summary</h2>
                </div>

                {/* List of Cart Items */}
                <div className="space-y-6">
                {cartItems.map((item) => (
                    <div
                    key={item.id}
                    className="flex flex-col border-b border-amber-100 last:border-b-0 pb-4"
                    >
                    {/* Top Row: Image, Name, Price */}
                    <div className="flex items-start space-x-3 w-full mb-3">
                        <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-grow">
                        <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                            Price per item: ETB {item.price.toFixed(2)}
                        </p>
                        </div>
                    </div>

                    {/* Bottom Row: Quantity Controls, Subtotal, Remove Button */}
                    <div className="flex items-center justify-between w-full pl-0 sm:pl-16">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-amber-300 rounded-lg">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-2 text-xl text-amber-700 hover:bg-amber-50 rounded-l-lg transition"
                            aria-label="Decrease quantity"
                        >
                            –
                        </button>
                        <span className="p-2 font-medium text-gray-800 w-8 text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-2 text-xl text-amber-700 hover:bg-amber-50 rounded-r-lg transition"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                        </div>

                        {/* Item Subtotal */}
                        <p className="font-bold text-lg text-amber-600 w-24 text-right">
                        ETB {(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Remove Button */}
                        <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-amber-500 hover:text-red-600 p-2 transition"
                        aria-label="Remove item"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </button>
                    </div>
                    </div>
                ))}
                </div>

            </div> 
            {/* End of max-w-4xl content container */}

        </div>
        {/* End of scrolling content area */}

        {/* --- Fixed Footer/Action Bar --- */}
        {/* fixed inset-x-0 bottom-0 makes it stick to the bottom of the screen */}
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.1)] p-4 md:p-6 lg:p-4 border-t border-amber-200">
            <div className="container mx-auto max-w-4xl">
                
                {/* Total Line */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                        ETB {totalSum.toFixed(2)}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => alert("Order functionality is not yet implemented!")}
                        className="w-full sm:w-2/3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg uppercase tracking-wider text-lg"
                    >
                        Proceed to Order
                    </button>
                    
                    <button
                        onClick={handleReturnToMenu}
                        className="w-full sm:w-1/3 border border-amber-500 text-amber-500 hover:bg-amber-50 font-bold py-3 rounded-xl transition duration-200"
                    >
                        back to menu 
                    </button>
                </div>
                
            </div>
        </div>
        {/* End of Fixed Footer */}
    </div>
  )
}
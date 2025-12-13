import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";


export default function Cart({
  // cartItems,
  // totalSum,
  onClose,
  // onUpdateQuantity,
  // onRemoveItem,
}) {

  const {
  cartItems,
  totalSum,
  handleUpdateQuantity: onUpdateQuantity,
  handleRemoveItem: onRemoveItem,
} = useContext(CartContext);



    if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart (0 Items)</h2>
          <p className="text-gray-600">Your cart is currently empty. Start adding some delicious items!</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-5 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto transform transition duration-300 scale-100 sm:p-6">
        <div className="flex justify-between items-center border-b border-amber-200 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Your Selection</h2>
          <button
            onClick={onClose}
            className="text-amber-500 hover:text-amber-700 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between items-start border-b border-amber-100 last:border-b-0 pb-3 sm:flex-row sm:items-center"
            >
              <div className="flex items-center space-x-3 w-full mb-2 sm:mb-0 sm:w-2/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md sm:w-16 sm:h-16"
                />
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    ETB {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full justify-between sm:space-x-4 sm:w-3/5">
                <div className="flex items-center border border-amber-300 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 px-2 text-lg text-amber-700 hover:bg-amber-50 rounded-l-lg transition sm:px-3 sm:text-xl"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="p-1 font-medium text-gray-800 w-6 text-center sm:w-8">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 px-2 text-lg text-amber-700 hover:bg-amber-50 rounded-r-lg transition sm:px-3 sm:text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-amber-600 w-20 text-right sm:w-24">
                  ETB {(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-amber-500 hover:text-amber-700 p-1 transition"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-amber-200 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-amber-600 sm:text-3xl">
            ETB {totalSum.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => alert("Order functionality is not yet implemented!")}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg uppercase tracking-wider"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  )
}

import { useContext } from "react";
import { CartContext } from "../../../context/CartContext.jsx";

export default function Main({ menus }) {
  const {
    cartItems,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useContext(CartContext);

  return (
    <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 pb-32">
        {menus.map((item) => {
          const cartItem = cartItems.find((cart) => cart.id === item.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div
              key={item.id}
              className="
                bg-white rounded-xl shadow-md
                hover:shadow-lg transition-all duration-300
                p-3 sm:p-5
                border border-gray-100 hover:border-amber-300
                flex flex-col
              "
            >
              {/* IMAGE */}
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="
                  w-full
                  h-28 sm:h-48
                  object-cover rounded-lg
                  mb-2 sm:mb-3
                "
              />

              {/* TITLE */}
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2">
                {item.name}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-[11px] sm:text-sm text-gray-600 mt-1 line-clamp-1 sm:line-clamp-2">
                {item.description}
              </p>

              {/* PRICE */}
              <div className="flex justify-between items-start mt-2 sm:mt-3 mb-2 sm:mb-3">
                <p className="text-base sm:text-xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  ETB {item.price}
                </p>

                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    ⭐ {item.rating}
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-600 font-semibold">
                    {item.prepTime}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              {quantity > 0 ? (
                <div className="mt-auto">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg p-1.5">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="flex-1 py-1 text-amber-700 font-bold text-sm"
                    >
                      −
                    </button>

                    <span className="flex-1 text-center font-bold text-amber-900 text-sm">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="flex-1 py-1 text-amber-700 font-bold text-sm"
                    >
                      +
                    </button>

                    <button
  onClick={() => handleRemoveItem(item.id)}
  className="flex-1 text-red-950 hover:text-red-900 transition hover:bg-red-50 rounded-lg py-1"
>
     <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-4 w-4 mx-auto"
  fill="currentColor"
  viewBox="0 0 20 20"
>
  <path
    fillRule="evenodd"
    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
    clipRule="evenodd"
  />
</svg>

</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item)}
                  className="
                    mt-auto w-full
                    bg-linear-to-r from-amber-400 to-amber-500
                    text-gray-900 font-bold
                    py-1.5 sm:py-2.5
                    rounded-lg
                    text-xs sm:text-sm
                  "
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

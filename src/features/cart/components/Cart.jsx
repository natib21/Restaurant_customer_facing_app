import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import { FilteredMenuContext } from "../../../context/FilteredMenuContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems,
    subtotal,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useContext(CartContext);

  const { tableNumber } = useContext(FilteredMenuContext);

  const [kitchenNote, setKitchenNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  function handleReturnToMenu() {
    navigate(`/menu${location.search || ""}`);
  }

  function goToPlaceOrder() {
    navigate(`/order${location.search || ""}`, {
      state: { kitchenNote },
    });
  }

  // --- Empty Cart View ---
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-[#efeeeb] text-[#005136] rounded-2xl flex items-center justify-center mb-4 shadow-xs">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1c1a] mb-2">Your Cart is Empty</h1>
        <p className="text-sm text-[#3f4943] mb-6 leading-relaxed">
          Looks like you haven't added any dishes yet. Browse our menu to discover delicious meals!
        </p>
        <button
          onClick={handleReturnToMenu}
          className="w-full py-3.5 px-6 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Explore Menu</span>
        </button>
      </div>
    );
  }

  const taxAmount = subtotal * 0.15; // 15% standard
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-36 md:pb-16 pt-2">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        {/* Page Title */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReturnToMenu}
              className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
              aria-label="Back to menu"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Your Order</h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#efeeeb] text-[#005136] rounded-xl border border-[#bec9c0]/30">
            Table {tableNumber || "T-101"}
          </span>
        </div>

        <div className="space-y-6">
          {/* CART ITEMS LIST */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] shadow-xs overflow-hidden divide-y divide-[#efeeeb]">
            {cartItems.map((item) => {
              const itemKey = item.cartItemId || item.id;
              const itemUnitPrice = Number(item.unitPrice || item.price || 0);
              const itemTotal = Number(item.totalPrice || itemUnitPrice * item.quantity);

              // Gather modifiers label
              const optionsSummary = Array.isArray(item.selectedOptions)
                ? item.selectedOptions.map((o) => o.choiceName).join(", ")
                : "";

              return (
                <div key={itemKey} className="p-4 sm:p-5 flex gap-3.5 sm:gap-4 items-center">
                  {/* Food Image */}
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0 bg-[#efeeeb]"
                  />

                  {/* Item info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-[#1a1c1a] text-sm sm:text-base leading-snug">
                          {item.name}
                        </h3>
                        {optionsSummary && (
                          <p className="text-xs text-[#3f4943] mt-0.5">{optionsSummary}</p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[11px] text-[#855300] italic mt-0.5">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(itemKey)}
                        className="text-[#6f7a72] hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-[#ffdad6]/40 transition-colors"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#efeeeb] rounded-xl px-1.5 py-0.5 border border-[#bec9c0]/40">
                        <button
                          onClick={() => handleUpdateQuantity(itemKey, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] transition active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#1a1c1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(itemKey, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] transition active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="font-bold text-sm sm:text-base text-[#005136]">
                        {itemTotal.toFixed(2)} ETB
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add a note for the kitchen */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-4 shadow-xs">
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1a1c1a]"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#005136]">
                  edit_note
                </span>
                <span>Add a note for the kitchen</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-[#6f7a72]">
                {showNoteInput ? "expand_less" : "expand_more"}
              </span>
            </button>

            {showNoteInput && (
              <div className="mt-3 pt-3 border-t border-[#efeeeb]">
                <textarea
                  rows={2}
                  value={kitchenNote}
                  onChange={(e) => setKitchenNote(e.target.value)}
                  placeholder="e.g. Please bring appetizers first, extra napkins, separate dressings..."
                  className="w-full p-3 text-xs sm:text-sm text-[#1a1c1a] border border-[#e3e2e0] rounded-xl bg-[#faf9f6] focus:bg-white focus:border-[#005136] focus:ring-1 focus:ring-[#005136] outline-none transition resize-none placeholder:text-[#6f7a72]"
                />
              </div>
            )}
          </div>

          {/* Add more dishes button */}
          <button
            onClick={handleReturnToMenu}
            className="w-full py-3 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#005136] font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add More Dishes to Order</span>
          </button>

          {/* ORDER SUMMARY */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-5 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#1a1c1a] pb-2 border-b border-[#efeeeb]">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm text-[#3f4943]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1a1c1a]">{subtotal.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (15%)</span>
                <span className="font-semibold text-[#1a1c1a]">{taxAmount.toFixed(2)} ETB</span>
              </div>
              <div className="pt-3 border-t border-[#efeeeb] flex justify-between items-center text-lg font-bold text-[#1a1c1a]">
                <span>Total Due</span>
                <span className="text-[#005136]">{grandTotal.toFixed(2)} ETB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM PLACE ORDER CTA */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t border-[#efeeeb] p-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#3f4943] uppercase tracking-wider">
              Total with Tax
            </span>
            <span className="text-lg font-bold text-[#005136]">{grandTotal.toFixed(2)} ETB</span>
          </div>

          <button
            onClick={goToPlaceOrder}
            className="flex-1 max-w-xs bg-[#005136] hover:bg-[#006c49] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Place Order</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

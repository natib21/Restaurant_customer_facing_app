import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { CustomerContext } from "../context/CustomerContext";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import CallAssistanceModal from "../components/CallAssistanceModal";
import { placeOrderUrl } from "../url/url";

export default function Order() {
  const { cartItems, totalSum, clearCart } = useContext(CartContext);
  const { customer } = useContext(CustomerContext);
  const { tableNumber } = useContext(FilteredMenuContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);

  const kitchenNote = location.state?.kitchenNote || "";
  const savedTable = tableNumber || localStorage.getItem("tableNumber") || "T-101";

  const executeOrderPlacement = async () => {
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const formattedItems = cartItems.map((item) => ({
      menuItemId: item.id || item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions || [],
      notes: item.specialInstructions || kitchenNote || "",
      unitPrice: Number(item.unitPrice || item.price || 0),
      totalPrice: Number(item.totalPrice || (item.price || 0) * item.quantity),
      image: item.image,
    }));

    const finalPayload = {
      items: formattedItems,
      customer: customer?.id || null,
      customerName: customer?.name || "Guest",
      customerPhone: customer?.phone || null,
      branchId: "670a1b2c3d4e5f6789018888",
      table: savedTable,
      notes: kitchenNote,
      subtotal: totalSum,
      totalAmount: totalSum * 1.15,
    };

    try {
      const token = localStorage.getItem("sessionToken");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(placeOrderUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(finalPayload),
      });

      const orderResult = await response.json();

      if (!response.ok || orderResult?.status !== "success") {
        throw new Error(orderResult?.message || "Failed to place order on the kitchen server. Please try again.");
      }

      const returnedOrder = orderResult?.data?.order || orderResult?.data;
      const orderId = returnedOrder?._id || returnedOrder?.id || returnedOrder?.orderNumber;

      const newOrderRecord = {
        id: orderId,
        items: [...formattedItems],
        totalAmount: returnedOrder?.total || totalSum * 1.15,
        subtotal: returnedOrder?.subtotal || totalSum,
        table: returnedOrder?.tableNumber || savedTable,
        customerName: returnedOrder?.customerName || customer?.name || "Guest",
        customerPhone: returnedOrder?.customerPhone || customer?.phone || null,
        createdAt: returnedOrder?.createdAt || new Date().toISOString(),
        status: returnedOrder?.status || "pending",
      };

      // Save to recent orders for order history
      try {
        const existingHistory = JSON.parse(localStorage.getItem("recentOrders") || "[]");
        localStorage.setItem(
          "recentOrders",
          JSON.stringify([newOrderRecord, ...existingHistory])
        );
      } catch (storageErr) {
        console.error("Failed to save order history:", storageErr);
      }

      setConfirmedOrder(newOrderRecord);
      clearCart();
      if (orderId) {
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      console.error("API order placement failed:", error);
      setSubmitError(error.message || "Failed to submit order. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- LIVE ORDER TRACKING SCREEN (When Order is placed) ---
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-36 pt-2">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-6">
          {/* Header Banner */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#9df4c8]/30 text-[#005136] flex items-center justify-center mx-auto ring-8 ring-[#9df4c8]/20">
              <span className="material-symbols-outlined text-[36px] font-bold">check</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Order Received!</h1>
              <p className="text-xs text-[#3f4943] mt-1">
                The kitchen has received your order for Table {confirmedOrder.table}.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#efeeeb] px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#005136]">
              <span>Reference #{confirmedOrder.id}</span>
            </div>
          </div>

          {/* LIVE PROGRESS STEP TRACKER */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#efeeeb]">
              <h2 className="text-base font-bold text-[#1a1c1a]">Kitchen Live Status</h2>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#855300] bg-[#ffddb8] px-2.5 py-0.5 rounded-full pulse-amber">
                <span className="w-2 h-2 rounded-full bg-[#fea619]" />
                Preparing
              </span>
            </div>

            {/* Vertical Stepper */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#efeeeb]">
              {/* Step 1: Received */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#005136] text-white flex items-center justify-center ring-4 ring-[#ffffff]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1a]">Order Received</h3>
                  <p className="text-xs text-[#3f4943]">Sent to kitchen terminal</p>
                </div>
              </div>

              {/* Step 2: Accepted */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#005136] text-white flex items-center justify-center ring-4 ring-[#ffffff]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1a]">Order Accepted</h3>
                  <p className="text-xs text-[#3f4943]">Chef confirmed availability</p>
                </div>
              </div>

              {/* Step 3: Preparing (Active) */}
              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#fea619] text-white flex items-center justify-center ring-4 ring-[#ffffff] animate-pulse">
                  <span className="material-symbols-outlined text-[12px] font-bold">soup_kitchen</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#005136]">Currently Cooking</h3>
                  <p className="text-xs text-[#3f4943]">Estimated ready in 10-15 minutes</p>
                </div>
              </div>

              {/* Step 4: Ready */}
              <div className="relative flex items-start gap-3 opacity-50">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#efeeeb] text-[#6f7a72] flex items-center justify-center ring-4 ring-[#ffffff]">
                  <span className="w-2 h-2 rounded-full bg-[#6f7a72]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1c1a]">Ready for Serving</h3>
                  <p className="text-xs text-[#3f4943]">Plating and quality check</p>
                </div>
              </div>

              {/* Step 5: Served */}
              <div className="relative flex items-start gap-3 opacity-50">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#efeeeb] text-[#6f7a72] flex items-center justify-center ring-4 ring-[#ffffff]">
                  <span className="w-2 h-2 rounded-full bg-[#6f7a72]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1c1a]">Served at Table</h3>
                  <p className="text-xs text-[#3f4943]">Enjoy your meal!</p>
                </div>
              </div>
            </div>
          </div>

          {/* ITEM STATUS BREAKDOWN */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1a1c1a]">Dishes in this Order</h2>
            <div className="divide-y divide-[#efeeeb]">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#efeeeb] text-[#005136] flex items-center justify-center font-bold text-xs">
                      {item.quantity}x
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1a1c1a]">{item.name}</h4>
                      {item.notes && <p className="text-[11px] text-[#855300]">"{item.notes}"</p>}
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#9df4c8]/30 text-[#005136]">
                    Cooking
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate(`/menu${location.search || ""}`)}
              className="py-3.5 px-4 bg-[#005136] hover:bg-[#006c49] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
              <span>Back to Menu</span>
            </button>

            <button
              onClick={() => navigate(`/bill${location.search || ""}`)}
              className="py-3.5 px-4 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1a1c1a] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              <span>View Bill</span>
            </button>

            <button
              onClick={() => setIsAssistanceOpen(true)}
              className="py-3.5 px-4 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1a1c1a] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>Call Waiter</span>
            </button>
          </div>
        </div>

        <CallAssistanceModal
          isOpen={isAssistanceOpen}
          onClose={() => setIsAssistanceOpen(false)}
          tableNumber={confirmedOrder.table}
        />
      </div>
    );
  }

  // --- EMPTY CART STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#efeeeb] text-[#005136] rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">shopping_cart</span>
        </div>
        <h2 className="text-xl font-bold text-[#1a1c1a] mb-2">No active items to order</h2>
        <p className="text-xs text-[#3f4943] mb-6 leading-relaxed">
          Please add items to your cart first before confirming the table order.
        </p>
        <button
          onClick={() => navigate(`/menu${location.search || ""}`)}
          className="w-full py-3.5 bg-[#005136] text-white font-bold rounded-xl shadow-md text-xs"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  // --- CONFIRM ORDER SCREEN BEFORE SENDING TO KITCHEN ---
  const tax = totalSum * 0.15;
  const grandTotal = totalSum + tax;

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-36 pt-2">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Confirm Order</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#efeeeb] text-[#005136] rounded-xl border border-[#bec9c0]/30">
            Table {savedTable}
          </span>
        </div>

        {/* Order review list */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1a1c1a] pb-2 border-b border-[#efeeeb]">
            Items for Table {savedTable}
          </h2>

          <div className="divide-y divide-[#efeeeb]">
            {cartItems.map((item) => (
              <div key={item.cartItemId || item.id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-[#1a1c1a]">
                    {item.quantity}x {item.name}
                  </h4>
                  {Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0 && (
                    <p className="text-xs text-[#3f4943]">
                      {item.selectedOptions.map((o) => o.choiceName).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-[#1a1c1a]">
                  {(Number(item.price || item.unitPrice || 0) * item.quantity).toFixed(2)} ETB
                </span>
              </div>
            ))}
          </div>

          {kitchenNote && (
            <div className="bg-[#faf9f6] p-3 rounded-xl border border-[#efeeeb] text-xs text-[#855300] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Kitchen note: "{kitchenNote}"</span>
            </div>
          )}

          {/* Pricing breakdown */}
          <div className="pt-3 border-t border-[#efeeeb] space-y-2 text-sm text-[#3f4943]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1a1c1a]">{totalSum.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15%)</span>
              <span className="font-semibold text-[#1a1c1a]">{tax.toFixed(2)} ETB</span>
            </div>
            <div className="pt-2 border-t border-[#efeeeb] flex justify-between items-center text-lg font-bold text-[#1a1c1a]">
              <span>Total Amount</span>
              <span className="text-[#005136]">{grandTotal.toFixed(2)} ETB</span>
            </div>
          </div>
        </div>

        {/* Authorization Note */}
        <div className="bg-[#efeeeb] p-4 rounded-2xl text-xs text-[#3f4943] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#005136] text-[20px] shrink-0">
            info
          </span>
          <p>
            This order will be immediately sent to the restaurant's kitchen for preparation. You can
            pay at your table with card or cash upon finishing.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold rounded-xl">
            {submitError}
          </div>
        )}

        {/* Send to Kitchen Action */}
        <button
          onClick={executeOrderPlacement}
          disabled={submitting}
          className="w-full py-4 bg-[#005136] hover:bg-[#006c49] disabled:opacity-70 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              <span>Sending Order to Kitchen...</span>
            </>
          ) : (
            <>
              <span>Send Order to Kitchen • {grandTotal.toFixed(2)} ETB</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

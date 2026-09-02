import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import { CartContext } from "../context/CartContext";
import CallAssistanceModal from "../components/CallAssistanceModal";

export default function Bill() {
  const navigate = useNavigate();
  const { tableNumber } = useContext(FilteredMenuContext);
  const { totalSum, cartItems } = useContext(CartContext);

  const [paymentMethod, setPaymentMethod] = useState("waiter");
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);

  // Retrieve most recent order or calculate based on cart/state
  const [activeOrder] = useState(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentOrders") || "[]");
      if (recent && recent.length > 0) return recent[0];
    } catch {
      // fallback
    }
    if (cartItems.length > 0) {
      return {
        id: `DRAFT-${Date.now().toString().slice(-4)}`,
        items: cartItems,
        totalAmount: totalSum,
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  });

  const subtotal = Number(activeOrder?.totalAmount || activeOrder?.subtotal || totalSum || 0);
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax;

  if (!activeOrder && totalSum === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 text-center py-20">
          <div className="w-16 h-16 bg-[#efeeeb] text-[#6f7a72] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[32px]">receipt_long</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a1c1a] mb-2">No Active Bill</h2>
          <p className="text-sm text-[#3f4943] mb-6">You don't have any placed orders or items in your cart yet.</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 bg-[#005136] text-white font-bold rounded-xl shadow-md hover:bg-[#006c49] transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Your Bill</h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#efeeeb] text-[#005136] rounded-xl border border-[#bec9c0]/30">
            Table {tableNumber || "T-101"}
          </span>
        </div>

        {/* Bill Receipt Card */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs mb-6 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-[#efeeeb]">
            <div>
              <span className="text-xs uppercase font-bold text-[#6f7a72] tracking-wider">
                Order Number
              </span>
              <p className="text-lg font-bold font-mono text-[#1a1c1a]">#{activeOrder.id}</p>
            </div>
            <span className="px-3 py-1 bg-[#ffddb8] text-[#855300] text-xs font-bold rounded-full">
              Payment Pending
            </span>
          </div>

          {/* Itemized list */}
          <div className="space-y-3 pb-4 border-b border-[#efeeeb]">
            <span className="text-xs uppercase font-bold text-[#6f7a72] tracking-wider block">
              Item Details
            </span>
            <div className="space-y-2">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[#1a1c1a]">
                    <span className="w-5 font-bold text-[#005136]">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold text-[#1a1c1a]">
                    {(Number(item.totalPrice || item.price || item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)} ETB
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm text-[#3f4943]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1a1c1a]">{subtotal.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>VAT & Service (15%)</span>
              <span className="font-semibold text-[#1a1c1a]">{tax.toFixed(2)} ETB</span>
            </div>
            <div className="pt-3 border-t border-[#efeeeb] flex justify-between items-center text-xl font-bold text-[#1a1c1a]">
              <span>Total Due</span>
              <span className="text-[#005136]">{grandTotal.toFixed(2)} ETB</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs mb-6">
          <h2 className="text-base font-bold text-[#1a1c1a] mb-4">Select Payment Method</h2>

          <div className="space-y-3">
            {/* Pay at restaurant */}
            <label
              onClick={() => setPaymentMethod("waiter")}
              className={`flex items-start gap-3.5 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === "waiter"
                  ? "border-[#005136] bg-[#9df4c8]/10 ring-1 ring-[#005136]"
                  : "border-[#e3e2e0] bg-[#faf9f6]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "waiter"}
                onChange={() => setPaymentMethod("waiter")}
                className="mt-1 text-[#005136] focus:ring-[#005136]"
              />
              <div className="grow">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#005136]">
                    payments
                  </span>
                  <span className="text-sm font-bold text-[#1a1c1a]">Pay at Restaurant</span>
                </div>
                <p className="text-xs text-[#3f4943] mt-1">
                  Please ask your waiter for the bill to pay with Cash, Debit Card, or POS.
                </p>
              </div>
            </label>

            {/* Digital Wallets (Telebirr / CBE Birr) */}
            <div className="p-4 border border-[#e3e2e0] rounded-xl bg-[#faf9f6] opacity-75">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#3f4943]">
                    account_balance_wallet
                  </span>
                  <span className="text-sm font-bold text-[#1a1c1a]">Digital Wallet (Telebirr, CBE)</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#efeeeb] text-[#3f4943] px-2 py-0.5 rounded-md">
                  In Restaurant POS
                </span>
              </div>
              <p className="text-xs text-[#3f4943] mt-1">
                Tell your waiter you wish to pay via Telebirr or CBE Birr QR code.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Call Waiter */}
        <button
          onClick={() => setIsAssistanceOpen(true)}
          className="w-full py-4 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">person_raised_hand</span>
          <span>Call Waiter for the Bill</span>
        </button>
      </div>

      <CallAssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        tableNumber={tableNumber || "T-101"}
      />
    </div>
  );
}

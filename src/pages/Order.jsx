import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { CustomerContext } from "../context/CustomerContext"; // Import Customer Context
import LoginForm from "../features/order/components/LoginForm";
import OrderList from "../features/order/components/OrderList";
import Spinner from "../components/Spinner";
import { placeOrderUrl } from "../url/url";

function Order() {
  const navigate = useNavigate();
  
  // 1. Contexts
  const { cartItems, totalSum, clearCart } = useContext(CartContext);
  const { customer, logout } = useContext(CustomerContext); // Get customer from global state
  console.log("Current Customer in Order Page:", customer);

  // 2. Local UI State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 3. Prepare order payload (automatically updates when customer context changes)
  const orderPayload = useMemo(() => {
    const branchId = "670a1b2c3d4e5f6789018888"; // Replace with your logic if dynamic

    const formattedItems = cartItems.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      notes: item.notes || "",
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
    }));

    return {
      items: formattedItems,
      customer: customer?.id || null, // Use ID from context
      branchId: branchId,
      notes: "",
      subtotal: totalSum,
      totalAmount: totalSum,
    };
  }, [cartItems, totalSum, customer]);

  // 4. Submit Order Logic
  const handleSubmitOrder = async () => {
    if (!customer) {
      setSubmitError("Please log in first.");
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No session token found. Please log in again.");
      }

      const response = await fetch(placeOrderUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || "Failed to place order");
      }

      console.log("✅ Order created successfully:", orderData);

      // Success actions
      clearCart();
      alert("Order placed successfully!");
      navigate("/history");

    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(error.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col container mx-auto p-4 gap-6 max-w-4xl min-h-screen">
      
      {/* 1. Order summary / items list */}
      <div className="w-full">
        <OrderList orderPayload={orderPayload} />
      </div>

      {/* 2. Authentication Section */}
      {!customer ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">Customer Details</h2>
          <LoginForm /> 
          {/* LoginForm now updates CustomerContext directly */}
        </div>
      ) : (
        /* 3. Success / Order Placement Section */
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg flex-1">
              <div className="bg-green-500 rounded-full p-1 text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">Logged in as</p>
                <p className="text-lg font-semibold">{customer.name}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline ml-4 pt-2"
            >
              Change User?
            </button>
          </div>

          {/* Error message */}
          {submitError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 font-medium">
              ⚠️ {submitError}
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={submitting || cartItems.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:bg-gray-300 disabled:scale-100 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all text-base uppercase tracking-widest"
          >
            {submitting ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Submitting Order...</span>
              </>
            ) : (
              <span>Confirm Order • ETB {totalSum.toFixed(2)}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Order;
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import LoginForm from "../features/order/components/LoginForm";
import OrderList from "../features/order/components/OrderList";
import Spinner from "../components/Spinner"; 
import { placeOrderUrl } from "../url/url";

function Order() {
  const { cartItems, totalSum } = useContext(CartContext);
  
  // 1. Local state for customer (initially null until login; now stores {id, name})
  const [customer, setCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 2. Prepare the payload (reactive to both cart and login status)
  const orderPayload = useMemo(() => {
    const branchId = "670a1b2c3d4e5f6789018888"; 

    const formattedItems = cartItems.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      notes: item.notes || "",
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
    }));

    return {
      items: formattedItems,
      customer: customer?.id || null, // Use customer.id if available
      branchId: branchId,
      notes: "",
      subtotal: totalSum,
      totalAmount: totalSum,
    };
  }, [cartItems, totalSum, customer]);

  // --- ADD THE LOG HERE ---
  console.log("🚀 Current Order Payload:", orderPayload);

  // New: Handle order submission after login
  const handleSubmitOrder = async () => {
    if (!customer) {
      setSubmitError("Please log in first.");
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

      if (!response.ok) {
        throw new Error(`Order submission failed: ${response.statusText}`);
      }

      const orderData = await response.json();
      console.log("✅ Order created:", orderData);
      // Optional: Clear cart, show success toast, redirect, etc.
      alert("Order placed successfully!"); // Replace with a proper notification
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col container mx-auto p-4 gap-6">
      {/* 3. OrderList just needs the payload for display */}
      <OrderList orderPayload={orderPayload} />

      {/* 4. LoginForm handles the login and sets the customer back up here */}
      {!customer ? (
        <LoginForm 
          onLoginSuccess={(customerData) => setCustomer(customerData)} 
          onLoginError={(error) => setSubmitError(error)} // Optional: Pass error handler down
        />
      ) : (
        <div className="space-y-4">
          <div 
            className="p-4 bg-green-50 text-green-700 rounded-lg" 
            role="status"
            aria-label="Login successful"
          >
            Welcome, <strong>{customer.name}</strong>! You're logged in and ready to order.
          </div>
          
          {/* New: Submit button after login */}
          <div className="flex flex-col gap-2">
            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                Error: {submitError}
              </div>
            )}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || cartItems.length === 0}
              className="
                w-full
                bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                text-white font-medium
                py-3 px-4
                rounded-md
                shadow-sm
                transition-colors
                uppercase tracking-wide text-sm
              "
            >
              {submitting ? <Spinner /> : `Place Order ($${totalSum.toFixed(2)})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
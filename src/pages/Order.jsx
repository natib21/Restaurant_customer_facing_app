import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import LoginForm from "../features/order/components/LoginForm";
import OrderList from "../features/order/components/OrderList";
import Spinner from "../components/Spinner";
import { placeOrderUrl } from "../url/url";

function Order() {
  const { cartItems, totalSum, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Prepare order payload
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
      customer: customer?.id || null,
      branchId: branchId,
      notes: "",
      subtotal: totalSum,
      totalAmount: totalSum,
    };
  }, [cartItems, totalSum, customer]);

  console.log("🚀 Current Order Payload:", orderPayload);

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

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
        throw new Error(`Order failed: ${errorMessage}`);
        }
      }

      const orderData = await response.json();
      console.log("✅ Order created successfully:", orderData);

      // Success actions
      clearCart();                    // Clear the cart after success
      // You can also save orderData.id or other info if needed

      // Optional: better UX than alert
      // toast.success("Order placed successfully!");
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
    <div className="flex flex-col container mx-auto p-4 gap-6 max-w-4xl">
      {/* Order summary / items list */}
      <OrderList orderPayload={orderPayload} />

      {/* Login or Place Order section */}
      {!customer ? (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Login to continue</h2>
          <LoginForm
            onLoginSuccess={(customerData) => setCustomer(customerData)}
            onLoginError={(error) => setSubmitError(error)}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <div
            className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              Welcome back, <strong>{customer.name}</strong>!
              <br className="sm:hidden" />
              <span className="text-sm opacity-80">You're ready to place your order.</span>
            </div>
          </div>

          {/* Error message */}
          {submitError && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
              {submitError}
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={submitting || cartItems.length === 0}
            className={`
              w-full
              flex items-center justify-center gap-3
              bg-amber-600 hover:bg-amber-700 
              disabled:bg-amber-300 disabled:cursor-not-allowed
              text-white font-medium
              py-4 px-6
              rounded-lg
              shadow-md hover:shadow-lg
              transition-all
              text-base uppercase tracking-wider
            `}
          >
            {submitting ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Processing...</span>
              </>
            ) : (
              `Place Order • ETB ${totalSum.toFixed(2)}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Order;
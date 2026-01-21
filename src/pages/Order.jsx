import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import LoginForm from "../features/order/components/LoginForm";
import OrderList from "../features/order/components/OrderList";

function Order() {
  const { cartItems, totalSum } = useContext(CartContext);
  
  // 1. Local state for customer (initially null until login)
  const [customerId, setCustomerId] = useState(null);

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
      customer: customerId, // This will be null until setCustomerId is called
      branchId: branchId,
      notes: "",
      subtotal: totalSum,
      totalAmount: totalSum,
    };
  }, [cartItems, totalSum, customerId]);

  // --- ADD THE LOG HERE ---
  console.log("🚀 Current Order Payload:", orderPayload);

  return (
    <div className="flex flex-col container mx-auto p-4 gap-6">
      {/* 3. OrderList just needs the payload for display */}
      <OrderList orderPayload={orderPayload} />

      {/* 4. LoginForm handles the login and sets the ID back up here */}
      {!customerId ? (
        <LoginForm onLoginSuccess={(id) => setCustomerId(id)} />
      ) : (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          Logged in as customer: <strong>{customerId}</strong>
        </div>
      )}
    </div>
  );
}

export default Order;
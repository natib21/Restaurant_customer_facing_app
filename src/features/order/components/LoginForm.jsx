import { useState, useContext, useEffect } from "react";
import { CustomerContext } from "../../../context/CustomerContext";
import Spinner from "../../../components/Spinner";
import { createCustomerUrl } from "../../../url/url";

export default function LoginForm({ onCancel, onSuccess, onGuestSubmit }) {
  const { customer, login } = useContext(CustomerContext);

  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d+]/g, ""); // allow digits and +
    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name to proceed with your order.");
      return;
    }

    const trimmedPhone = phone.trim();

    // If NO phone is provided, proceed directly as a guest customer
    if (!trimmedPhone) {
      const guestCustomer = {
        id: null,
        name: trimmedName,
        phone: null,
        isGuest: true
      };
      login(guestCustomer);
      if (onGuestSubmit) {
        onGuestSubmit(guestCustomer);
      } else if (onSuccess) {
        onSuccess(guestCustomer);
      }
      return;
    }

    // Phone IS provided -> validate and check CRM
    let normalizedPhone = trimmedPhone;
    if (normalizedPhone.startsWith("09")) {
      normalizedPhone = "251" + normalizedPhone.slice(1);
    } else if (normalizedPhone.startsWith("9") && normalizedPhone.length === 9) {
      normalizedPhone = "251" + normalizedPhone;
    }

    if (normalizedPhone.startsWith("251") && normalizedPhone.length < 12) {
      setError("Please enter a valid 12-digit Ethiopian phone number (e.g. 251911223344) or leave blank.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("sessionToken");

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(createCustomerUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: trimmedName, phone: normalizedPhone }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.data?.customer?.id) {
        const customerId = result.data.customer.id;
        const fullName = result.data.fullName || result.data.customer.name || trimmedName;
        const customerData = {
          id: customerId,
          name: fullName,
          phone: normalizedPhone,
        };
        login(customerData);
        if (onSuccess) onSuccess(customerData);
      } else {
        // If CRM has an issue or customer doesn't exist yet in backend schema, still allow the order to proceed with customer info
        console.warn("CRM lookup note:", result?.message);
        const fallbackCustomer = {
          id: result?.data?.customer?.id || null,
          name: trimmedName,
          phone: normalizedPhone,
        };
        login(fallbackCustomer);
        if (onSuccess) onSuccess(fallbackCustomer);
      }
    } catch (err) {
      console.error("CRM Connection Error:", err);
      // Fallback gracefully so customer can still order
      const fallbackCustomer = {
        id: null,
        name: trimmedName,
        phone: normalizedPhone,
      };
      login(fallbackCustomer);
      if (onSuccess) onSuccess(fallbackCustomer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5">
      <div className="mb-4 p-3 bg-amber-50/80 border border-amber-100 rounded-xl">
        <p className="text-stone-800 font-medium text-xs sm:text-sm">
          Please provide your details for the kitchen order.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Abebe Kebede"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3.5 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm outline-none transition"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Phone Number
            </label>
            <span className="text-[11px] font-medium text-gray-400">Optional</span>
          </div>
          <input
            type="tel"
            placeholder="e.g. 0911223344 or 2519..."
            value={phone}
            onChange={handlePhoneChange}
            className="block w-full px-3.5 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm outline-none transition"
          />
          <p className="mt-1 text-[11px] text-gray-500">
            Enter your phone to earn loyalty rewards and receive order status updates.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 text-white" />
                <span>Checking Customer Info...</span>
              </>
            ) : (
              "Confirm & Proceed"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-2.5 px-4 rounded-xl border border-gray-200 transition text-xs uppercase tracking-wide"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
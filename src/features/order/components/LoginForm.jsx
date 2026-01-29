import { useState, useContext , useEffect} from "react";
import { CustomerContext } from "../../../context/CustomerContext";
import Spinner from "../../../components/Spinner";
import { createCustomerUrl } from "../../../url/url";

export default function LoginForm({ onCancel, onSuccess }) {
  // Access the login function from our new Context
  const { login } = useContext(CustomerContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("2519"); // Ethiopia prefix logic
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 4000);

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [error]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // 1. Only allow numbers
    // 2. Ensure it always starts with 2519
    // 3. Limit to 12 digits total
    if (/^\d*$/.test(value) && value.startsWith("2519") && value.length <= 12) {
      setPhone(value);
    } else if (value.length < 4) {
      setPhone("2519");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (phone.length < 12) {
      setError("Please enter a valid 9-digit number after the 2519 prefix.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("sessionToken");
    
    if (!token) {
      setError("No session token found. Please refresh the page and try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(createCustomerUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create/login customer");
      }

      const customerId = result?.data?.customer?.id;
      const fullName = result?.data?.fullName || result?.data?.customer?.name || name;

      if (customerId) {
        // Update the global Context state
        login({ 
          id: customerId, 
          name: fullName,
          phone: phone 
        });
        
        // If we were in "Switch User" mode, notify the parent to close the form
        if (onSuccess) onSuccess();

      } else {
        setError("Invalid response from server: No customer ID found.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl  p-4">
      <div className="mb-4 p-2 bg-amber-50 rounded-lg">
        <p className="text-center text-amber-800 font-medium text-sm">
          Please enter your details to place your order.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Error Message Display */}
        {error && (
          <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g., Abebe Kebede"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="2519..."
            value={phone}
            onChange={handlePhoneChange}
            className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm font-mono outline-none transition-all"
            required
          />
          <p className="mt-1 text-[10px] text-gray-400">
            Format: 251 (Country) + 9 (Prefix) + 8 digits
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 px-4 rounded-md shadow-sm transition-colors uppercase tracking-widest text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="w-4 h-4" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Confirm & Continue"
            )}
          </button>

          {/* BACK BUTTON: Only shows if the user clicked "Change User" and wants to go back */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-medium py-2 px-4 rounded-md border border-gray-200 transition-colors uppercase tracking-wide text-[10px] sm:text-xs"
            >
              ← Back to Order
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
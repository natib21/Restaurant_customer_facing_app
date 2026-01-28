import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { createCustomerUrl } from "../../../url/url";

export default function LoginForm({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("2519"); // Start with the required prefix
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // 1. Only allow numbers
    // 2. Ensure it always starts with 2519
    // 3. Limit to 12 digits (251 + 9 digits)
    if (/^\d*$/.test(value) && value.startsWith("2519") && value.length <= 12) {
      setPhone(value);
    } else if (value.length < 4) {
      // Prevent user from deleting the "2519" prefix entirely
      setPhone("2519");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: 251 + 9 digits = 12 characters
    if (!name || phone.length < 12) {
      alert("Please enter a valid 9-digit number after the prefix.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("sessionToken");
    
    if (!token) {
      alert("No session token found. Please log in first.");
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

      if (!response.ok) throw new Error("Failed to create/login customer");

      const data = await response.json();
      const customerId = data?.data?.customer?.id;
      const fullName = data?.data?.fullName || name;

      if (customerId) {
        onLoginSuccess({ id: customerId, name: fullName });
      } else {
        alert("Invalid response from server: No customer ID found.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md ">
      <div className="mb-1 p-1 bg-gray-50 rounded-lg">
        <p className="text-center text-stone-600 font-medium text-sm">
          Please enter your details to order.
        </p>
      </div>

      <form className="space-y-1" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="2519..."
            value={phone}
            onChange={handlePhoneChange}
            className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm font-mono"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Format: 2519XXXXXXXX</p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-3/4 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors uppercase tracking-wide text-xs sm:text-sm"
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
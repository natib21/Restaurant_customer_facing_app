import { useState } from "react";

import Spinner from "../../../components/Spinner";
import { createCustomerUrl } from "../../../url/url";


// export default function LoginForm({ onLoginSuccess }) {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !phone) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     setLoading(true);
//     const token = localStorage.getItem("sessionToken");
//     if (!token) {
//       alert("No session token found. Please log in first.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(createCustomerUrl, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           phone,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create/login customer");
//       }

//       const data = await response.json();
//       // Assuming the API response has { id: 'customerId' }; adjust based on actual response structure
//       const customerId = data.id || data.customerId;
//       if (customerId) {
//         onLoginSuccess(customerId);
//       } else {
//         alert("Invalid response from server.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="mb-6 p-3 bg-gray-50 rounded-lg">
//         <p className="text-center text-gray-600 font-medium text-sm">
//           Please enter your details to order.
//         </p>
//       </div>

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., John Doe"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             placeholder="e.g., +251 912 345 678"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
//             required
//           />
//         </div>

//         <div className="flex justify-center pt-2">
//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               w-full sm:w-3/4
//               bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300
//               text-white font-medium
//               py-2 px-4
//               rounded-md
//               shadow-sm
//               transition-colors
//               uppercase tracking-wide text-xs sm:text-sm
//             "
//           >
//             {loading ? <Spinner /> : "Order"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
export default function LoginForm({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please fill in all fields.");
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
        body: JSON.stringify({
          name,
          phoneNumber: phone, // Assuming the API expects 'phoneNumber'; adjust if needed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create/login customer");
      }

      const data = await response.json();
      // Extract customer ID from the nested structure: data.customer.id
      const customerId = data?.data?.customer?.id;
      if (customerId) {
        onLoginSuccess(customerId);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-600 font-medium text-sm">
          Please enter your details to order.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g., +251 912 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            required
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-3/4
              bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300
              text-white font-medium
              py-2 px-4
              rounded-md
              shadow-sm
              transition-colors
              uppercase tracking-wide text-xs sm:text-sm
            "
          >
            {loading ? <Spinner /> : "Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
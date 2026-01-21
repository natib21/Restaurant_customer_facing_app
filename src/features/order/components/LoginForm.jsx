import Spinner from "../../../components/Spinner";

export default function LoginForm({ onLoginSuccess }) {
  // Assuming onLoginSuccess is passed as prop, but not used in UI yet
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-600 font-medium text-sm">
          Please enter your details to order.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g., +251 912 345 678"
            className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            className="
              w-full sm:w-3/4
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              py-2 px-4
              rounded-md
              shadow-sm
              transition-colors
              uppercase tracking-wide text-xs sm:text-sm
            "
            onClick={() => {
              // Placeholder for login logic
              // e.g., validate form and call onLoginSuccess('some-id')
            }}
          >
            Order
          </button>
        </div>
      </form>
    </div>
  );
}
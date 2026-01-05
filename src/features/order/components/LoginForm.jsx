import Spinner from "../../../components/Spinner";

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm rounded-2xl md:rounded-3xl lg:rounded-3xl">

        {/* Header */}
        <h2 className="text-2xl font-bold text-stone-200 mb-4 text-center drop-shadow-sm">
          🍽️ Welcome!
        </h2>

        <p className="text-center text-stone-400 font-medium rounded-lg p-3 mb-8 shadow-inner">
          Please enter your details to view the menu & order.
        </p>

        {/* FORM UI ONLY */}
        <form className="space-y-6">

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-semibold text-stone-400 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              className="block w-full px-4 py-3 text-stone-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 transition duration-150 bg-stone-100"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-semibold text-stone-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g., +251 912 345 678"
              className="block w-full px-4 py-3 text-stone-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 transition duration-150 bg-stone-100"
            />
          </div>

          {/* HIDDEN SOURCE */}
          <input type="hidden" name="source" value="guest" />

          {/* BUTTON */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full sm:w-3/4 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-3 px-4 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/30 uppercase tracking-wide text-sm"
            >
              Continue to Menu →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

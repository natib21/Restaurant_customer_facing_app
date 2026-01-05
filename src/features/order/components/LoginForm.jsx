import Spinner from "../../../components/Spinner";

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="
        relative w-full max-w-md
        bg-linear-to-r from-gray-900 via-gray-800 to-gray-900
        shadow-2xl backdrop-blur-sm
        rounded-2xl md:rounded-3xl
        p-3 sm:p-6
      ">
        <p className="text-center text-stone-400 font-medium rounded-lg p-2 sm:p-3 mb-2 sm:mb-6 shadow-inner text-sm">
          Please enter your details to order.
        </p>

        <form className="space-y-3 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-400 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              className="block w-full px-3 py-2 sm:px-4 sm:py-3 text-stone-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 bg-stone-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g., +251 912 345 678"
              className="block w-full px-3 py-2 sm:px-4 sm:py-3 text-stone-900 placeholder-gray-500 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 bg-stone-100 text-sm"
            />
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="button"
              className="
                w-full sm:w-3/4
                bg-linear-to-r from-amber-400 to-amber-500
                text-gray-900 font-bold
                py-2 sm:py-3 px-4
                rounded-full
                shadow-lg shadow-amber-500/30
                uppercase tracking-wide text-xs sm:text-sm
              "
            >
              Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

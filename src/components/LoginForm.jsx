import Spinner from "./Spinner";

export default function LoginForm({ handleSubmit, handleChange, formData, loading }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-amber-400 shadow-2xl p-4 sm:p-6 backdrop-blur-sm rounded-2xl md:rounded-3xl lg:rounded-3xl">

        {/* Decorative Glow */}
        <div className="absolute inset-x-0 -top-10 mx-auto w-40 h-40 rounded-full blur-3xl"></div>

        <h2 className="text-2xl font-bold text-stone-200 mb-4 text-center drop-shadow-sm">
          🍽️ Welcome!
        </h2>
        {!loading ?
            <p className="text-center text-stone-400 font-medium rounded-lg p-3 mb-8 shadow-inner">
          Please Enter your details to view the menu & order.
        </p> : ""
        }
        

        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 space-y-3">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-semibold text-stone-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g., John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`block w-full px-4 py-3
                  ${formData.fullName.trim() === "" ? "bg-stone-300" : "bg-stone-100"}
                  text-stone-900 placeholder-gray-500
                  border-2 border-gray-300 rounded-lg shadow-sm
                  focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                  transition duration-150`}
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-semibold text-stone-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g., +251 912 345 678"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`block w-full px-4 py-3
                  ${formData.fullName.trim() === "" ? "bg-stone-300" : "bg-stone-100"}
                  text-stone-900 placeholder-gray-500
                  border-2 border-gray-300 rounded-lg shadow-sm
                  focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                  transition duration-150`}
              />
            </div>

            {/* HIDDEN SOURCE */}
            <input
              type="hidden"
              name="source"
              value={formData.source || "guest"}
              onChange={handleChange}
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="ml-1.5 w-3/4 sm:w-auto bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold py-2 px-2 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 uppercase tracking-wide text-sm sm:text-base shrink-0"
            >
              Continue to Menu →
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

export default function Header({ restaurantName, totalItems, onCartOpen, searchValue, onSearchChange }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm p-3 sm:p-4 md:p-5 mb-4 rounded-lg">

      {/* FIRST ROW — Name + Cart */}
      <div className="flex items-center justify-between gap-3">
        
        {/* Restaurant Name */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
            {restaurantName}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Delicious food for you
          </p>
        </div>

        {/* Cart Button */}
        {totalItems > 0 && (
          <button
            onClick={onCartOpen}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-1.5 rounded-lg font-semibold text-sm transition shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            <span className="font-bold text-xs">{totalItems}</span>
          </button>
        )}
      </div>

      {/* SECOND ROW — Search Bar */}
      <div className="mt-3">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search food..."
          className="
            text-stone-700
            w-full
            sm:w-1/2
            lg:w-1/2
            px-3 py-2
            text-sm
            border border-gray-300
            rounded-lg
            bg-stone-100
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
            transition
          "
        />
      </div>

    </header>
  );
}

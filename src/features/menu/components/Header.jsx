export default function Header({ restaurantName, totalItems, onCartOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm p-3 sm:p-4 md:p-5 mb-6 md:mb-8 lg:mb-10 rounded-lg">
      <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between md:gap-6">

        {/* Restaurant Name */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
            {restaurantName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Delicious food for you
          </p>
        </div>

        {/* Cart Button */}
        {totalItems > 0 && (
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
          >
            {/* Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            {/* Item Count */}
            <span className="font-bold text-xs md:text-sm">
              {totalItems}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

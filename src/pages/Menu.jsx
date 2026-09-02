import { useContext } from "react";
import Footer from "../features/menu/components/Footer.jsx";
import Main from "../features/menu/components/Main.jsx";
import { CartContext } from "../context/CartContext.jsx";
import Spinner from "../components/Spinner.jsx";
import { FilteredMenuContext } from "../context/FilteredMenuContext.jsx";
import { Utensils, AlertTriangle, RefreshCw, QrCode, Sparkles } from "lucide-react";

export default function Menu() {
  const {
    filteredMenus,
    categories,
    activeCategory,
    setActiveCategory,
    searchValue,
    setSearchValue,
    restaurant,
    branch,
    tableNumber,
    isSessionExpired,
    sessionError,
    retrySession,
    isLoading,
    error,
  } = useContext(FilteredMenuContext);

  const { totalItems } = useContext(CartContext);

  // SESSION LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] p-6 text-center">
        <Spinner />
        <p className="mt-4 text-base font-semibold text-gray-800">
          Connecting to {restaurant || "Restaurant"}...
        </p>
        <span className="text-xs text-amber-600 font-medium mt-1">
          Setting up Table {tableNumber || "T-101"} • Loading digital menu
        </span>
      </div>
    );
  }

  // EXPIRED SESSION SCREEN (Requirement Section 25)
  if (isSessionExpired) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Session Expired</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your table session has expired. Please scan the QR code on your table again to continue ordering.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("qrSession");
            window.location.href = "/";
          }}
          className="w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR Again</span>
        </button>
      </div>
    );
  }

  // INVALID QR / SESSION ERROR SCREEN (Requirement Section 26)
  if (sessionError || (error && !filteredMenus.length)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Open Table</h2>
        <p className="text-sm text-gray-600 mb-6">
          {sessionError || "The QR code may be invalid or expired. Please rescan the table QR code."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={retrySession}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-x-hidden">
      {/* TABLE WELCOME BAR */}
      <section className="bg-linear-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-200/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-gray-800">{restaurant}</span>
            {branch && <span className="text-gray-500">• {branch}</span>}
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-2xs border border-amber-200/80 font-bold text-amber-900">
            <Utensils className="w-3 h-3 text-amber-600" />
            <span>Table {tableNumber || "T-101"}</span>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS (HORIZONTALLY SCROLLABLE) */}
      {categories.length > 1 && (
        <section className="sticky top-[57px] sm:top-[65px] z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 py-2.5 px-3 sm:px-6 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 shrink-0
                    ${
                      isActive
                        ? "bg-amber-400 text-gray-950 shadow-sm ring-1 ring-amber-400 scale-[1.02]"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* MAIN MENU LISTING */}
      <div className="flex-1 max-w-7xl w-full mx-auto">
        {filteredMenus.length > 0 ? (
          <Main menus={filteredMenus} />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No items found</h3>
            <p className="text-xs text-gray-500 max-w-xs mb-4">
              {searchValue
                ? `No dishes matched "${searchValue}". Try searching something else.`
                : "No dishes available in this category at the moment."}
            </p>
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="px-4 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-200 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM CART BAR */}
      {totalItems > 0 && <Footer />}
    </div>
  );
}

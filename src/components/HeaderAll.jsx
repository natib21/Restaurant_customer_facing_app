
import { useContext, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext"
import { FilteredMenuContext } from "../context/FilteredMenuContext"


export default function HeaderAll({ onNavigate }) {
  const navigate = useNavigate()
   const location = useLocation();
  const hideOnRoutes = ["/cart", "/order"];
const hideSearch = hideOnRoutes.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [translateOffset, setTranslateOffset] = useState(0)
  const sidebarRef = useRef(null)

  // Contexts
  const { searchValue, setSearchValue, restaurant, error } = useContext(FilteredMenuContext)
  const { totalItems } = useContext(CartContext)

  // --- Gesture Logic for Sidebar ---
  const handleTouchStart = (e) => {
    if (!isSidebarOpen) return
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
    const rect = sidebarRef.current?.getBoundingClientRect()
    setSidebarWidth(rect?.width || 0)
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !isSidebarOpen) return
    const touchX = e.touches[0].clientX
    let deltaX = touchX - startX
    if (deltaX > 0) deltaX = 0 // Prevent dragging to the right
    const offsetPercent = (deltaX / sidebarWidth) * 100
    setTranslateOffset(Math.max(-100, offsetPercent))
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaX = e.changedTouches[0].clientX - startX
    // If swiped left more than 50px, close it
    if (deltaX < -50) {
      setIsSidebarOpen(false)
    }
    setTranslateOffset(0)
  }

  // --- Improved Navigation Logic ---
  const navigateTo = (path) => {
    setIsSidebarOpen(false) // Close the drawer
    navigate(path)          // Actual route change
    if (onNavigate) onNavigate(path) // Callback for parent if needed
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm p-3 sm:p-4 md:px-6">
      
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR DRAWER - FLOATING CARD EXPERIENCE */}
      <aside
        ref={sidebarRef}
        className="fixed top-16 left-3 w-72 max-w-[calc(100vw-1.5rem)] bg-white z-50 shadow-2xl transition-all duration-300 ease-in-out rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
        style={{
          opacity: isSidebarOpen ? 1 : 0,
          transform: isSidebarOpen 
            ? `translateX(${translateOffset}%) scale(1)` 
            : "translateX(-10%) scale(0.95)",
          pointerEvents: isSidebarOpen ? "auto" : "none",
          transformOrigin: "top left",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Explore</h3>
              <p className="text-xs text-gray-500 font-medium">Quick Navigation</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1.5 flex-1">
            <button
              onClick={() => navigateTo("/menu")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Menu
            </button>
            <button
              onClick={() => navigateTo("/cart")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Cart ({totalItems})
            </button>
            <button
            onClick={()=> navigateTo("/order")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Review Order
              
            </button>
            <button
            onClick={()=> navigateTo("/history")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Order History
              
            </button>
          </nav>

          <div className="mt-auto pt-6">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Current Order</p>
              <p className="text-xs text-amber-900 font-medium">You have {totalItems} items ready.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER TOP BAR */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {!error && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-linear-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent truncate">
              {restaurant || "Loading..."}
            </h1>
          </div>
        </div>

        {!error && !hideSearch && (
          <button
            onClick={() => navigateTo("/cart")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition shadow-sm ${
              totalItems > 0 ? "bg-amber-400 text-gray-900" : "bg-gray-100 text-gray-400"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-bold text-xs">{totalItems}</span>
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      {!hideSearch && <div className="mt-3 flex justify-center">
        {!error && (
          <div className="relative w-full sm:max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 text-sm text-stone-700 border border-gray-200 rounded-xl bg-gray-50 focus:ring-1 focus:ring-amber-400 outline-none transition"
            />
          </div>
        )}
      </div>}
    </header>
  )
}
import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";

export default function DataFetcherComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, tableNumber, restaurant } = useContext(FilteredMenuContext);

  useEffect(() => {
    // If session is done loading and there is no error, transition smoothly to menu
    if (!isLoading && !error) {
      const timer = setTimeout(() => {
        navigate({
          pathname: "/menu",
          search: location.search || "",
        }, { replace: true });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, navigate, location.search]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-6">
        <div className="max-w-md w-full p-6 bg-[#ffffff] border border-[#ffdad6] rounded-2xl shadow-lg text-center">
          <div className="w-14 h-14 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a1c1a] mb-2">Unable to Load Menu</h2>
          <p className="text-sm text-[#3f4943] mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate(`/menu${location.search || ""}`)}
            className="w-full py-3.5 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl transition shadow-md text-sm"
          >
            Open Menu Directly
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#faf9f6] text-[#1a1c1a] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#efeeeb] to-transparent opacity-60 pointer-events-none" />

      <main className="flex flex-col items-center max-w-sm w-full z-10 text-center">
        {/* Logo Animation Area with pulsing outer rings */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#005136]/10 loading-pulse" />
          <div
            className="absolute inset-2 rounded-2xl bg-[#005136]/15 loading-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <div className="relative z-10 w-20 h-20 bg-[#005136] rounded-2xl flex items-center justify-center shadow-xl">
            <span className="material-symbols-outlined text-white text-[38px] fill">
              restaurant
            </span>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-1.5 mb-6">
          <h1 className="text-2xl font-bold text-[#005136] tracking-tight">
            {restaurant || "Golden Fork"}
          </h1>
          <p className="text-sm text-[#3f4943] max-w-[240px] mx-auto">
            Connecting to {restaurant || "Golden Fork Restaurant"}
          </p>
        </div>

        {/* Table Context Pill */}
        <div className="bg-[#efeeeb] py-1.5 px-4 rounded-xl flex items-center gap-1.5 mb-8 shadow-xs border border-[#bec9c0]/40">
          <span className="material-symbols-outlined text-[#005136] text-[18px]">
            table_restaurant
          </span>
          <span className="text-xs font-bold text-[#1a1c1a]">Table {tableNumber || "T-101"}</span>
        </div>

        {/* Loading Progress Bar */}
        <div className="flex flex-col items-center space-y-3 w-full max-w-[220px]">
          <div className="w-full h-1 bg-[#e9e8e5] rounded-full overflow-hidden">
            <div className="h-full bg-[#005136] rounded-full animate-progress" />
          </div>
          <p className="text-[11px] font-semibold text-[#3f4943]/80 uppercase tracking-widest">
            Loading your menu...
          </p>
        </div>
      </main>
    </div>
  );
}

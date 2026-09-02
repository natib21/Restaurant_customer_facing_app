import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import { CartContext } from "../context/CartContext";
import ItemCustomizerModal from "../features/menu/components/ItemCustomizerModal";

export default function Favorites() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filteredMenus } = useContext(FilteredMenuContext);
  const { handleAddToCart, handleAddCustomizedItem } = useContext(CartContext);

  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem("goldenForkFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  const toggleFavorite = (e, itemId) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const updated = prev.filter((id) => id !== itemId);
      try {
        localStorage.setItem("goldenForkFavorites", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Find favorited dishes from menu items
  const favoriteItems = (filteredMenus || []).filter((item) =>
    favoriteIds.includes(item.id)
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/menu${location.search || ""}`)}
              className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Your Favorites</h1>
              <p className="text-xs text-[#3f4943]">Quick access to your preferred dishes</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] fill">favorite</span>
            {favoriteItems.length} Saved
          </span>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto bg-white rounded-2xl border border-[#efeeeb] shadow-xs">
            <div className="w-16 h-16 bg-[#ffdad6]/60 text-[#ba1a1a] rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] fill">favorite</span>
            </div>
            <h2 className="text-lg font-bold text-[#1a1c1a] mb-1">No favorites saved yet</h2>
            <p className="text-xs text-[#3f4943] mb-6 leading-relaxed">
              Tap the heart icon on any dish card across the menu to quickly bookmark your top picks here.
            </p>
            <button
              onClick={() => navigate(`/menu${location.search || ""}`)}
              className="py-3 px-6 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-md transition text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>Explore Restaurant Menu</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-44 bg-[#efeeeb] overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ffffff]/90 hover:bg-[#ffffff] flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    title="Remove from favorites"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] fill">
                      favorite
                    </span>
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#1a1c1a]/70 backdrop-blur-md rounded text-white text-[10px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#fea619] fill">star</span>
                    <span>{item.rating || "4.8"}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#1a1c1a] text-sm sm:text-base line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#3f4943] line-clamp-2 mb-3">
                      {item.description || "Freshly crafted with premium ingredients."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#efeeeb] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#005136]">
                      {Number(item.price || 0).toFixed(2)} ETB
                    </span>
                    <button
                      onClick={() => {
                        if (item.optionGroups && item.optionGroups.length > 0) {
                          setSelectedItemForModal(item);
                        } else {
                          handleAddToCart(item);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#005136] hover:bg-[#006c49] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ItemCustomizerModal
        item={selectedItemForModal}
        isOpen={Boolean(selectedItemForModal)}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddCustomizedItem}
      />
    </div>
  );
}

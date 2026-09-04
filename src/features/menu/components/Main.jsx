import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext.jsx";
import ItemCustomizerModal from "./ItemCustomizerModal.jsx";
import QuantityModal from "./QuantityModal.jsx";
import { useNavigate } from "react-router-dom";

export default function Main({ menus }) {
  const {
    cartItems,
    handleAddCustomizedItem,
    handleUpdateQuantity,
  } = useContext(CartContext);

  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [quantityModalItem, setQuantityModalItem] = useState(null);
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem("goldenForkFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (e, item) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      let updated;
      if (prev.includes(item.id)) {
        updated = prev.filter((id) => id !== item.id);
      } else {
        updated = [...prev, item.id];
      }
      try {
        localStorage.setItem("goldenForkFavorites", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  return (
    <main className="flex-1 px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-28">
        {menus.map((item) => {
          const matchedCartItems = cartItems.filter(
            (cart) => cart.id === item.id || cart.menuItemId === item.id
          );
          const totalQuantity = matchedCartItems.reduce((acc, c) => acc + c.quantity, 0);
          const isAvailable = item.isAvailable !== false;
          const isFavorited = favoriteIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`bg-[#ffffff] rounded-2xl border border-[#efeeeb] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
                !isAvailable ? "opacity-60" : "hover:border-[#bec9c0]"
              }`}
            >
              {/* FOOD PHOTO & OVERLAY BADGES */}
              <div
                onClick={() => isAvailable && navigate(`/menu/${item.id}`)}
                className={`relative h-44 sm:h-48 bg-[#efeeeb] overflow-hidden ${
                  isAvailable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                <img
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                {/* Top Left: Star rating or Bestseller */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#1a1c1a]/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-white text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-[#fea619] fill">
                    star
                  </span>
                  <span>{item.rating || "4.8"}</span>
                </div>

                {/* Top Right: Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, item)}
                  aria-label="Toggle favorite"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#ffffff]/80 backdrop-blur-md hover:bg-[#ffffff] flex items-center justify-center transition-transform active:scale-90 shadow-xs"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-colors ${
                      isFavorited ? "text-[#ba1a1a] fill" : "text-[#3f4943]"
                    }`}
                  >
                    favorite
                  </span>
                </button>

                {/* Bottom Left: Prep time badge */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-[#ffffff]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[#1a1c1a] text-[10px] font-medium shadow-xs">
                  <span className="material-symbols-outlined text-[12px] text-[#005136]">
                    schedule
                  </span>
                  <span>{item.prepTime || "15 min"}</span>
                </div>
              </div>

              {/* ITEM CONTENT */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div
                  onClick={() => isAvailable && navigate(`/menu/${item.id}`)}
                  className={isAvailable ? "cursor-pointer" : ""}
                >
                  {/* Dish Name & Dietary tags */}
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#1a1c1a] leading-snug group-hover:text-[#005136] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#3f4943] line-clamp-2 mb-3 leading-relaxed">
                    {item.description || "Crafted with fresh ingredients and served with house signature dressing."}
                  </p>

                  {/* Dietary Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.isVegetarian && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#9df4c8]/30 text-[#005136] rounded-md">
                        Vegetarian
                      </span>
                    )}
                    {item.spicyLevel > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#ffdad6] text-[#ba1a1a] rounded-md">
                        Spicy
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#efeeeb] text-[#3f4943] rounded-md">
                      {item.category || "Main"}
                    </span>
                  </div>
                </div>

                {/* PRICE & ADD ACTION */}
                <div className="pt-2 border-t border-[#efeeeb] flex items-center justify-between gap-2 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#6f7a72] tracking-wider">
                      Price
                    </span>
                    <span className="text-base font-bold text-[#005136]">
                      {Number(item.price || 0).toFixed(2)} ETB
                    </span>
                  </div>

                  {/* Add or Stepper Controls */}
                  {totalQuantity > 0 ? (
                    <div className="flex items-center bg-[#efeeeb] rounded-xl p-1 border border-[#bec9c0]/40">
                      <button
                        onClick={() => {
                          const target = matchedCartItems[0];
                          if (target) handleUpdateQuantity(target.cartItemId || target.id, -1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] transition"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-[#1a1c1a]">
                        {totalQuantity}
                      </span>
                      <button
                        onClick={() => {
                          const target = matchedCartItems[0];
                          if (target) handleUpdateQuantity(target.cartItemId || target.id, 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] transition"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const hasOptions = (item.optionGroups && item.optionGroups.length > 0) || (item.options && item.options.length > 0);
                          if (hasOptions) {
                            setSelectedItemForModal(item);
                          } else {
                            setQuantityModalItem(item);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#005136] hover:bg-[#006c49] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[15px]">add</span>
                        <span>Add</span>
                      </button>

                      {/* Quantity modal for simple quick-add items */}
                      <QuantityModal
                        item={quantityModalItem}
                        isOpen={Boolean(quantityModalItem && quantityModalItem.id === item.id)}
                        onClose={() => setQuantityModalItem(null)}
                        onConfirm={(qty) => {
                          if (quantityModalItem) {
                            handleAddCustomizedItem({ menuItem: quantityModalItem, selectedOptions: [], specialInstructions: "", quantity: qty });
                          }
                          setQuantityModalItem(null);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        key={selectedItemForModal?.id || "customizer"}
        item={selectedItemForModal}
        isOpen={Boolean(selectedItemForModal)}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddCustomizedItem}
      />
    </main>
  );
}

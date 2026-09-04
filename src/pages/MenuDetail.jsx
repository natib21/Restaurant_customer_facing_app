import { useContext, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import { CartContext } from "../context/CartContext";
import ItemCustomizerModal from "../features/menu/components/ItemCustomizerModal";
import QuantityModal from "../features/menu/components/QuantityModal";

export default function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { filteredMenus, menu } = useContext(FilteredMenuContext);
  const { cartItems, handleAddCustomizedItem, handleUpdateQuantity } = useContext(CartContext);

  const [customizerOpenFor, setCustomizerOpenFor] = useState(null);
  const [quantityModalItem, setQuantityModalItem] = useState(null);

  const item = useMemo(() => {
    const list = filteredMenus && filteredMenus.length ? filteredMenus : menu || [];
    return list.find((m) => String(m.id) === String(id) || String(m.menuItemId) === String(id));
  }, [filteredMenus, menu, id]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Item not found</h2>
          <button onClick={() => navigate('/menu')} className="px-4 py-2 bg-[#005136] text-white rounded-xl">Back to Menu</button>
        </div>
      </div>
    );
  }

  const matched = cartItems.filter((c) => c.id === item.id || c.menuItemId === item.id);
  const qty = matched.reduce((s, c) => s + c.quantity, 0);

  const hasOptions = (item.optionGroups && item.optionGroups.length > 0) || (item.options && item.options.length > 0);

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-[#005136]">Back</button>

      <div className="bg-[#ffffff] rounded-2xl overflow-hidden">
        <div className="w-full h-72 bg-[#efeeeb]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <p className="text-sm text-[#3f4943] mb-3">{item.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6f7a72]">Price</div>
              <div className="text-lg font-bold text-[#005136]">{Number(item.price || 0).toFixed(2)} ETB</div>
            </div>

            {/* Add or qty controls */}
            {qty > 0 ? (
              <div className="flex items-center gap-2 bg-[#efeeeb] rounded-xl p-1">
                <button onClick={() => handleUpdateQuantity(matched[0].cartItemId || matched[0].id, -1)} className="w-10 h-10 flex items-center justify-center">-</button>
                <div className="font-bold">{qty}</div>
                <button onClick={() => handleUpdateQuantity(matched[0].cartItemId || matched[0].id, 1)} className="w-10 h-10 flex items-center justify-center">+</button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    if (hasOptions) setCustomizerOpenFor(item);
                    else setQuantityModalItem(item);
                  }}
                  className="px-4 py-2 bg-[#005136] text-white rounded-xl"
                >
                  Add
                </button>

                <QuantityModal
                  item={quantityModalItem}
                  isOpen={Boolean(quantityModalItem)}
                  onClose={() => setQuantityModalItem(null)}
                  onConfirm={(qty) => {
                    if (quantityModalItem) {
                      handleAddCustomizedItem({ menuItem: quantityModalItem, selectedOptions: [], specialInstructions: "", quantity: qty });
                    }
                    setQuantityModalItem(null);
                  }}
                />
              </div>
            )}
          </div>

          {/* Show more metadata */}
          <div className="mt-4 text-sm text-[#3f4943]">
            <div>Prep time: {item.prepTime || '15 min'}</div>
            {item.isVegetarian && <div>Vegetarian</div>}
            {item.spicyLevel > 0 && <div>Spicy level: {item.spicyLevel}</div>}
          </div>
        </div>
      </div>

      <ItemCustomizerModal
        key={customizerOpenFor?.id || 'customizer-detail'}
        item={customizerOpenFor}
        isOpen={Boolean(customizerOpenFor)}
        onClose={() => setCustomizerOpenFor(null)}
        onAddToCart={handleAddCustomizedItem}
      />
    </div>
  );
}

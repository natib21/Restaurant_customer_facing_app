import { useState, useMemo } from "react";

export default function ItemCustomizerModal({ item, isOpen, onClose, onAddToCart }) {
  // Derive option groups or default groups
  const displayGroups = useMemo(() => {
    const hasCustomOptionGroups = item?.optionGroups && item.optionGroups.length > 0;
    return hasCustomOptionGroups
      ? item.optionGroups
      : [
          {
            optionGroupName: "Size",
            required: true,
            choices: [
              { choiceName: "Regular", priceModifier: 0 },
              { choiceName: "Large", priceModifier: 50 },
            ],
          },
        ];
  }, [item]);

  const defaultAddons = useMemo(() => [
    { choiceName: "Extra Sauce", priceModifier: 10 },
    { choiceName: "Extra Cheese", priceModifier: 30 },
  ], []);

  // Initialize selected options with first required option choices
  const initialOptions = useMemo(() => {
    const initial = {};
    if (displayGroups.length > 0) {
      displayGroups.forEach((g) => {
        const gName = g.optionGroupName || g.name || "Option";
        if (g.choices && g.choices.length > 0) {
          initial[gName] = g.choices[0];
        }
      });
    }
    return initial;
  }, [displayGroups]);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [validationError, setValidationError] = useState("");

  // Handle Radio Selection for single-choice group
  const handleOptionSelect = (groupName, choice) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: choice,
    }));
    setValidationError("");
  };

  // Handle Checkbox Selection for Add-ons
  const handleAddonToggle = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.choiceName === addon.choiceName || a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.choiceName !== addon.choiceName && a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  // Live Unit Price Calculation
  const unitPrice = useMemo(() => {
    if (!item) return 0;
    let price = Number(item.price || 0);

    // Add selected option modifiers
    Object.values(selectedOptions).forEach((opt) => {
      if (opt && opt.priceModifier) {
        price += Number(opt.priceModifier);
      }
    });

    // Add selected addon modifiers
    selectedAddons.forEach((addon) => {
      if (addon && addon.priceModifier) {
        price += Number(addon.priceModifier);
      }
    });

    return price;
  }, [item, selectedOptions, selectedAddons]);

  const totalPrice = unitPrice * quantity;

  // Handle submit to cart
  const handleConfirm = () => {
    // Flatten all selected options into array format
    const allSelected = [
      ...Object.entries(selectedOptions).map(([groupName, choice]) => ({
        groupName,
        choiceName: choice.choiceName || choice.name,
        priceModifier: Number(choice.priceModifier || 0),
      })),
      ...selectedAddons.map((addon) => ({
        groupName: "Add-ons",
        choiceName: addon.choiceName || addon.name,
        priceModifier: Number(addon.priceModifier || 0),
      })),
    ];

    onAddToCart({
      menuItem: item,
      selectedOptions: allSelected,
      specialInstructions,
      quantity,
    });

    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1a1c1a]/50 backdrop-blur-xs z-10 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div
        className="relative z-20 w-full sm:max-w-xl bg-[#ffffff] rounded-t-2xl sm:rounded-2xl shadow-[0px_-8px_30px_rgba(0,0,0,0.15)] max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Grab Handle */}
        <div className="w-full flex justify-center py-2 sm:hidden absolute top-0 z-30 pointer-events-none">
          <div className="w-12 h-1 bg-[#bec9c0] rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pb-28">
          {/* Hero Image */}
          <div className="relative w-full h-[240px] sm:h-[280px] bg-[#efeeeb]">
            <img
              src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 bg-[#ffffff]/80 hover:bg-[#ffffff] text-[#1a1c1a] backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="px-5 pt-5 pb-4">
            {/* Header & Price */}
            <div className="flex justify-between items-start mb-1.5">
              <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">{item.name}</h1>
              <span className="text-xl font-bold text-[#005136] whitespace-nowrap ml-3">
                {Number(item.price || 0).toFixed(2)} ETB
              </span>
            </div>

            <p className="text-sm text-[#3f4943] leading-relaxed mb-4">
              {item.description || "Freshly prepared with authentic ingredients and our signature seasoning."}
            </p>

            {/* Tags / Metadata */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="inline-flex items-center px-3 py-1 bg-[#efeeeb] rounded-lg">
                <span className="material-symbols-outlined text-[16px] mr-1 text-[#3f4943] fill">timer</span>
                <span className="text-xs font-medium text-[#3f4943]">{item.prepTime || "15 min"}</span>
              </div>

              {item.spicyLevel > 0 ? (
                <div className="inline-flex items-center px-3 py-1 bg-[#ffdad6]/50 rounded-lg">
                  <span className="material-symbols-outlined text-[16px] mr-1 text-[#ba1a1a] fill">local_fire_department</span>
                  <span className="text-xs font-medium text-[#ba1a1a]">
                    {item.spicyLevel === 1 ? "Mild Spicy" : item.spicyLevel === 2 ? "Medium Spicy" : "Hot Spicy"}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 bg-[#9df4c8]/30 rounded-lg">
                  <span className="material-symbols-outlined text-[16px] mr-1 text-[#005136] fill">eco</span>
                  <span className="text-xs font-medium text-[#005136]">Chef Choice</span>
                </div>
              )}
            </div>

            {/* Customization Sections */}
            {displayGroups.map((group) => {
              const groupName = group.optionGroupName || group.name || "Option";
              return (
                <div key={groupName} className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-bold text-[#1a1c1a]">{groupName}</h2>
                    {group.required && (
                      <span className="text-xs font-semibold text-[#005136] bg-[#9df4c8]/30 px-2.5 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {(group.choices || []).map((choice) => {
                      const isSelected = selectedOptions[groupName]?.choiceName === choice.choiceName;
                      const priceMod = Number(choice.priceModifier || 0);

                      return (
                        <label
                          key={choice.choiceName}
                          onClick={() => handleOptionSelect(groupName, choice)}
                          className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#005136] bg-[#9df4c8]/10 ring-1 ring-[#005136]"
                              : "border-[#e3e2e0] bg-[#faf9f6] hover:bg-[#efeeeb]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={groupName}
                              checked={isSelected}
                              onChange={() => handleOptionSelect(groupName, choice)}
                              className="w-4 h-4 text-[#005136] focus:ring-[#005136] border-[#bec9c0]"
                            />
                            <span className="text-sm font-semibold text-[#1a1c1a]">{choice.choiceName}</span>
                          </div>
                          <span className="text-sm text-[#3f4943]">
                            {priceMod > 0 ? `+${priceMod.toFixed(2)} ETB` : "+0 ETB"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Add-ons */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold text-[#1a1c1a]">Add-ons</h2>
                <span className="text-xs font-medium text-[#3f4943]">Optional</span>
              </div>

              <div className="space-y-2.5">
                {defaultAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.choiceName === addon.choiceName);
                  return (
                    <label
                      key={addon.choiceName}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddonToggle(addon);
                      }}
                      className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? "border-[#005136] bg-[#9df4c8]/10"
                          : "border-[#e3e2e0] bg-[#faf9f6] hover:bg-[#efeeeb]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#005136] rounded focus:ring-[#005136] border-[#bec9c0]"
                        />
                        <span className="text-sm font-semibold text-[#1a1c1a]">{addon.choiceName}</span>
                      </div>
                      <span className="text-sm text-[#3f4943]">+{addon.priceModifier.toFixed(2)} ETB</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-[#1a1c1a] mb-1.5">
                Special Request / Cooking Notes
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., Dressing on the side, extra crispy, less ice..."
                className="w-full p-3 text-sm text-[#1a1c1a] border border-[#e3e2e0] rounded-xl bg-[#faf9f6] focus:bg-white focus:border-[#005136] focus:ring-1 focus:ring-[#005136] outline-none transition resize-none placeholder:text-[#3f4943]/60"
              />
            </div>

            {/* Validation Error */}
            {validationError && (
              <p className="text-xs font-semibold text-[#ba1a1a] mb-3">{validationError}</p>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-[#ffffff] border-t border-[#e3e2e0] p-4 flex items-center justify-between gap-3 z-40 shadow-[0px_-4px_20px_rgba(0,0,0,0.08)]">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#efeeeb] rounded-xl px-2 py-1.5 w-32 justify-between border border-[#bec9c0]/40">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] disabled:opacity-30 transition active:scale-95"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="text-base font-bold text-[#1a1c1a]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#005136] rounded-lg hover:bg-[#e9e8e5] transition active:scale-95"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleConfirm}
            className="flex-1 bg-[#005136] hover:bg-[#006c49] text-white font-semibold rounded-xl py-3.5 px-4 flex justify-between items-center shadow-md active:scale-[0.98] transition-all"
          >
            <span>Add to Cart</span>
            <span className="font-bold text-sm bg-white/15 px-2.5 py-1 rounded-lg">
              {totalPrice.toFixed(2)} ETB
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

export default function QuantityModal({ item, isOpen, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0">
      <div
        className="fixed inset-0 bg-[#1a1c1a]/50 backdrop-blur-xs z-10"
        onClick={onClose}
      />

      <div className="relative z-20 w-full sm:max-w-lg bg-[#ffffff] rounded-t-2xl sm:rounded-2xl shadow-[0px_-8px_30px_rgba(0,0,0,0.15)] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#e3e2e0] flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a1c1a]">{item.name}</h3>
            <p className="text-sm text-[#3f4943]">{item.description}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-[#1a1c1a]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1a1c1a] mb-2">Quantity</label>
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center bg-[#efeeeb] text-[#005136]"
                aria-label="Decrease"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                className="w-20 text-center border border-[#e3e2e0] p-2"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-[#efeeeb] text-[#005136]"
                aria-label="Increase"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <div className="text-sm text-[#3f4943]">
            Unit price: <span className="font-semibold text-[#1a1c1a]">{Number(item.price || 0).toFixed(2)} ETB</span>
          </div>
        </div>

        <div className="p-4 border-t border-[#e3e2e0] flex items-center gap-3">
          <button
            onClick={() => {
              onConfirm(quantity);
            }}
            className="flex-1 bg-[#005136] hover:bg-[#006c49] text-white font-semibold py-3 rounded-xl"
          >
            Add {quantity} • {(Number(item.price || 0) * quantity).toFixed(2)} ETB
          </button>
        </div>
      </div>
    </div>
  );
}

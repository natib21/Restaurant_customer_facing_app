export default function OrderSummary({ order }) {
  if (!order) return null;

  const subtotal = Number(order.subtotal || order.totalAmount || 0);
  const tax = Number(order.tax || (subtotal * 0.15));
  const total = Number(order.totalAmount || (subtotal + tax));
  const itemsCount = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;

  return (
    <section className="bg-[#ffffff] rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#efeeeb] overflow-hidden">
      <div className="p-4 border-b border-[#efeeeb] flex justify-between items-center bg-[#faf9f6]/70">
        <h3 className="font-bold text-sm text-[#1a1c1a] tracking-tight">Order Summary</h3>
        <span className="text-xs text-[#3f4943] font-medium">
          {itemsCount} {itemsCount === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm text-[#3f4943]">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} ETB</span>
        </div>

        <div className="flex justify-between text-sm text-[#3f4943]">
          <span>VAT & Service (15%)</span>
          <span>{tax.toFixed(2)} ETB</span>
        </div>

        <div className="pt-2 border-t border-[#efeeeb] flex justify-between items-baseline">
          <span className="text-sm font-bold text-[#1a1c1a]">Total</span>
          <span className="text-xl font-bold text-[#005136]">
            {total.toFixed(2)} ETB
          </span>
        </div>
      </div>
    </section>
  );
}

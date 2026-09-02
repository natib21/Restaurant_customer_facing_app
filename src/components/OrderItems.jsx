import OrderItem from "./OrderItem";

export default function OrderItems({ items = [], itemStatuses = {} }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#ffffff] rounded-2xl p-6 text-center border border-[#efeeeb]">
        <p className="text-sm text-[#3f4943]">No items in this order.</p>
      </div>
    );
  }

  const totalItemCount = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-lg font-bold text-[#1a1c1a] tracking-tight">Order Items</h4>
        <span className="text-xs font-semibold px-2.5 py-1 bg-[#efeeeb] text-[#3f4943] rounded-full">
          {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const itemId = item._id || item.id || item.menuItemId || `item-${idx}`;
          return (
            <OrderItem
              key={itemId}
              item={item}
              itemStatus={itemStatuses[itemId] || item.status}
            />
          );
        })}
      </div>
    </section>
  );
}

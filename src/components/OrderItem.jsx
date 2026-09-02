export default function OrderItem({ item, itemStatus }) {
  if (!item) return null;

  const currentStatus = (itemStatus || item.status || "").toLowerCase();

  // Determine badge styling based on item status
  const getBadgeConfig = () => {
    switch (currentStatus) {
      case "ready":
        return {
          bg: "bg-[#81d8ad]/25 text-[#005136] border border-[#81d8ad]/40",
          icon: "check_circle",
          label: "Ready",
        };
      case "preparing":
        return {
          bg: "bg-[#fea619]/20 text-[#684000] border border-[#fea619]/30",
          icon: "skillet",
          label: "Preparing",
        };
      case "served":
        return {
          bg: "bg-[#005136] text-white",
          icon: "room_service",
          label: "Served",
        };
      case "accepted":
        return {
          bg: "bg-[#efeeeb] text-[#005136] border border-[#bec9c0]",
          icon: "done",
          label: "Accepted",
        };
      case "canceled":
      case "cancelled":
        return {
          bg: "bg-[#ffdad6] text-[#ba1a1a]",
          icon: "cancel",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-[#efeeeb] text-[#6f7a72]",
          icon: "schedule",
          label: "Pending",
        };
    }
  };

  const badge = getBadgeConfig();
  const quantity = item.quantity || 1;
  const unitPrice = Number(item.price || item.unitPrice || 0);
  const totalPrice = Number(item.totalPrice || (unitPrice * quantity));
  const notes = item.notes || item.specialInstructions || "";

  // Food image with fallback
  const fallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
  const imageUrl = item.image || item.imageUrl || item.imagePath || fallbackImage;

  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 flex items-center gap-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#efeeeb]/70 transition-all hover:border-[#bec9c0]/50">
      {/* Food Image */}
      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#efeeeb] relative">
        <img
          src={imageUrl}
          alt={item.name || "Dish item"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h5 className="font-semibold text-[15px] sm:text-base text-[#1a1c1a] truncate pr-2">
            {item.name}
          </h5>
          <span className="font-bold text-[15px] text-[#1a1c1a] shrink-0">
            {totalPrice > 0 ? `${totalPrice.toFixed(2)} ETB` : ""}
          </span>
        </div>

        <p className="text-xs text-[#3f4943] mb-1.5 flex items-center gap-2">
          <span>Qty: {quantity}</span>
          {unitPrice > 0 && totalPrice !== unitPrice && (
            <span className="text-[#6f7a72]">({unitPrice.toFixed(2)} each)</span>
          )}
        </p>

        {notes ? (
          <p className="text-xs text-[#6f7a72] italic truncate mb-2 max-w-[220px]">
            "{notes}"
          </p>
        ) : null}

        {/* Live Status Badge */}
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide gap-1 ${badge.bg}`}>
          <span className="material-symbols-outlined text-[14px]">
            {badge.icon}
          </span>
          <span className="uppercase text-[10px]">{badge.label}</span>
        </div>
      </div>
    </div>
  );
}

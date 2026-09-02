import { useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import useOrderStatus from "../hooks/useOrderStatus";
import OrderTracker from "../components/OrderTracker";

export default function OrderDetails() {
  const { orderId: paramOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve orderId from param, search param, or latest localStorage order
  const activeOrderId = useMemo(() => {
    if (paramOrderId) return paramOrderId;
    const queryId = searchParams.get("id") || searchParams.get("orderId");
    if (queryId) return queryId;

    try {
      const stored = localStorage.getItem("recentOrders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0]?.id || parsed[0]?._id || null;
        }
      }
    } catch {
      // fallback
    }
    return null;
  }, [paramOrderId, searchParams]);

  const sessionToken = localStorage.getItem("sessionToken");

  const {
    order,
    orderStatus,
    itemStatuses,
    connectionStatus,
    isLoading,
    error,
    refreshOrder,
  } = useOrderStatus(activeOrderId, sessionToken);

  // Polished Skeleton Loading State
  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-32 pt-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-36 bg-[#efeeeb] rounded-lg" />
              <div className="h-4 w-24 bg-[#efeeeb] rounded-md" />
            </div>
            <div className="h-6 w-16 bg-[#efeeeb] rounded-full" />
          </div>

          {/* Banner Skeleton */}
          <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#efeeeb] flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#efeeeb]" />
            <div className="h-5 w-48 bg-[#efeeeb] rounded-lg" />
            <div className="h-4 w-64 bg-[#efeeeb] rounded-md" />
          </div>

          {/* Stepper Skeleton */}
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#efeeeb]">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#efeeeb]" />
                  <div className="h-3 w-12 bg-[#efeeeb] rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Items Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-28 bg-[#efeeeb] rounded-md" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#ffffff] rounded-2xl p-4 border border-[#efeeeb] flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-[#efeeeb]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#efeeeb] rounded-md" />
                  <div className="h-3 w-20 bg-[#efeeeb] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error / No Order found
  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-32 pt-8">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl flex items-center justify-center mx-auto ring-8 ring-[#ffdad6]/40">
            <span className="material-symbols-outlined text-[32px]">error</span>
          </div>

          <h2 className="text-xl font-bold text-[#1a1c1a]">Order Not Found</h2>
          <p className="text-sm text-[#3f4943] leading-relaxed">
            {error || "We couldn't retrieve the details for this order. It might have expired or not yet been created."}
          </p>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => refreshOrder()}
              className="w-full py-3.5 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Retry</span>
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="w-full py-3.5 bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] font-bold rounded-xl transition text-sm"
            >
              Browse Menu
            </button>
            <button
              onClick={() => navigate("/history")}
              className="w-full py-3.5 text-[#005136] hover:underline font-semibold text-sm"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-32 pt-12">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 bg-[#efeeeb] text-[#6f7a72] rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">timer</span>
          </div>
          <h2 className="text-xl font-bold text-[#1a1c1a]">No Active Order</h2>
          <p className="text-sm text-[#3f4943]">
            You don't have an active order being tracked right now.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 bg-[#005136] text-white font-bold rounded-xl shadow-xs hover:bg-[#006c49] transition text-sm"
          >
            Start an Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2 sm:pt-4">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <OrderTracker
          order={order}
          orderStatus={orderStatus}
          itemStatuses={itemStatuses}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  );
}

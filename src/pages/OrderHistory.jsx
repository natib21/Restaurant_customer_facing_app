import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FilteredMenuContext } from "../context/FilteredMenuContext";
import { CartContext } from "../context/CartContext";
import { getMyOrdersUrl } from "../url/url";

export default function OrderHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = useContext(FilteredMenuContext);
  const { handleAddToCart } = useContext(CartContext);

  const [activeFilter, setActiveFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("sessionToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(getMyOrdersUrl, { headers });
        if (res.ok) {
          const result = await res.json();
          if (isMounted) {
            const fetchedOrders = result?.data?.orders || result?.data || [];
            if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
              setOrders(fetchedOrders);
              return;
            }
          }
        }
        
        // Check localStorage for recent orders submitted in current session
        const stored = localStorage.getItem("recentOrders");
        if (stored && isMounted) {
          try {
            setOrders(JSON.parse(stored));
          } catch {
            setOrders([]);
          }
        } else if (isMounted) {
          setOrders([]);
        }
      } catch (err) {
        console.error("Order history fetch error:", err);
        const stored = localStorage.getItem("recentOrders");
        if (stored && isMounted) {
          try {
            setOrders(JSON.parse(stored));
          } catch {
            setOrders([]);
          }
        } else if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Completed") return order.status === "Completed" || order.status === "Served";
    if (activeFilter === "In Progress") return order.status !== "Completed" && order.status !== "Cancelled";
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      handleAddToCart(item);
    });
    navigate(`/cart${location.search || ""}`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/menu${location.search || ""}`)}
              className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Order History</h1>
              <p className="text-xs text-[#3f4943]">Review and track all your table orders</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#efeeeb] text-[#005136] rounded-xl border border-[#bec9c0]/30">
            Table {tableNumber || "T-101"}
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 pb-1">
          {["All", "In Progress", "Completed"].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#006c49] text-white shadow-xs"
                    : "bg-[#efeeeb] text-[#3f4943] hover:bg-[#e9e8e5]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#005136] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#3f4943] font-medium">Loading your orders from kitchen...</p>
          </div>
        ) : error ? (
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">error</span>
            </div>
            <h3 className="text-base font-bold text-[#1a1c1a]">Unable to load orders</h3>
            <p className="text-xs text-[#3f4943]">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[#efeeeb] text-[#6f7a72] rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">receipt_long</span>
            </div>
            <h3 className="text-base font-bold text-[#1a1c1a]">No orders found</h3>
            <p className="text-xs text-[#3f4943]">You don't have any past orders in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              const isCompleted = order.status === "Completed" || order.status === "Served";

              return (
                <div
                  key={order.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/orders/${order.id || order._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/orders/${order.id || order._id}`);
                  }}
                  className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-5 shadow-xs space-y-4 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1a1c1a]">
                          {order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`}
                        </span>
                        <span className="text-[11px] text-[#6f7a72]">• Table {order.table || order.tableNumber}</span>
                        {order.customerName && (
                          <span className="text-[11px] text-[#6f7a72]">• {order.customerName}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#3f4943] mt-0.5">{orderDate}</p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isCompleted ? 'bg-[#9df4c8]/40 text-[#005136]' : 'bg-[#ffddb8] text-[#855300]'}`}>
                      {order.status || "In Kitchen"}
                    </span>
                    {order.orderType && (
                      <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-[#efeeeb] text-[#3f4943]">{order.orderType}</span>
                    )}
                    {order.source && (
                      <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-[#efeeeb] text-[#3f4943]">{order.source}</span>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="bg-[#faf9f6] rounded-xl p-3 space-y-1.5 border border-[#efeeeb]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-[#3f4943]">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-[#1a1c1a]">
                          {Number(item.price || item.totalPrice || item.unitPrice || 0).toFixed(2)} ETB
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#efeeeb]">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-[#6f7a72]">Total</span>
                      <span className="text-base font-bold text-[#005136]">
                        {Number(order.totalAmount || 0).toFixed(2)} ETB
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id || order._id}`); }}
                        className="px-3 py-1.5 bg-[#81d8ad]/20 hover:bg-[#81d8ad]/35 text-[#005136] text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span>Track</span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/bill${location.search || ""}`); }}
                        className="px-3 py-1.5 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1a1c1a] text-xs font-semibold rounded-xl transition"
                      >
                        Bill
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleReorder(order); }}
                        className="px-3 py-1.5 bg-[#005136] hover:bg-[#006c49] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

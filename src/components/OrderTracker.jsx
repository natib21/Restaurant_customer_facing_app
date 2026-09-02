import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusTimeline from "./OrderStatusTimeline";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import CallAssistanceModal from "./CallAssistanceModal";

export default function OrderTracker({
  order,
  orderStatus = "pending",
  itemStatuses = {},
  connectionStatus = "connected",
}) {
  const navigate = useNavigate();
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);

  const statusNormalized = (orderStatus || order?.status || "pending").toLowerCase();
  const isCancelled = statusNormalized === "canceled" || statusNormalized === "cancelled";
  const isServed = statusNormalized === "served" || statusNormalized === "completed";
  const isReady = statusNormalized === "ready";

  const orderIdDisplay =
    order?.id || order?._id || order?.orderNumber || "ORD-LIVE";
  const tableDisplay =
    order?.tableNumber || order?.table || localStorage.getItem("tableNumber") || "Table";

  const formattedTime = order?.createdAt
    ? new Date(order.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  // Banner status configuration
  const getHeroCardConfig = () => {
    switch (statusNormalized) {
      case "accepted":
        return {
          title: "Your order has been accepted!",
          subtitle: "The kitchen has received your ticket and is queuing preparation.",
          icon: "check_circle",
          bgColor: "bg-[#ffffff]",
          iconBg: "bg-[#005136] text-white",
          glow: false,
        };
      case "preparing":
        return {
          title: "Your order is being prepared...",
          subtitle: "Our chefs are cooking your fresh meal right now.",
          icon: "skillet",
          bgColor: "bg-[#ffffff]",
          iconBg: "bg-[#fea619] text-[#684000]",
          glow: false,
        };
      case "ready":
        return {
          title: "Your order is ready!",
          subtitle: "Your delicious meal is ready to be served.",
          icon: "notifications_active",
          bgColor: "bg-[#ffffff]",
          iconBg: "bg-[#005136] text-white",
          glow: true,
        };
      case "served":
      case "completed":
        return {
          title: "Served",
          subtitle: "Your order has been served! Enjoy your meal.",
          icon: "room_service",
          bgColor: "bg-[#ffffff]",
          iconBg: "bg-[#005136] text-white",
          glow: false,
        };
      case "canceled":
      case "cancelled":
        return {
          title: "Order Cancelled",
          subtitle:
            "This order was cancelled by the restaurant. Please contact staff for assistance.",
          icon: "cancel",
          bgColor: "bg-[#ffdad6]",
          iconBg: "bg-[#ba1a1a]/10 text-[#ba1a1a]",
          glow: false,
        };
      default:
        return {
          title: "Your order is pending...",
          subtitle: "Sending ticket to the kitchen staff.",
          icon: "hourglass_top",
          bgColor: "bg-[#ffffff]",
          iconBg: "bg-[#efeeeb] text-[#005136]",
          glow: false,
        };
    }
  };

  const hero = getHeroCardConfig();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1c1a] tracking-tight">
            Order #{String(orderIdDisplay).slice(-6).toUpperCase()}
          </h1>
          <span className="text-sm font-semibold text-[#005136] px-2.5 py-0.5 bg-[#81d8ad]/20 rounded-full">
            {tableDisplay.startsWith("T-") || tableDisplay.startsWith("Table")
              ? tableDisplay
              : `Table ${tableDisplay}`}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-[#3f4943]">
          <p>Placed at {formattedTime}</p>

          {/* Connection indicator */}
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-[#006c49] animate-pulse"
                  : connectionStatus === "reconnecting"
                  ? "bg-[#fea619] animate-ping"
                  : "bg-[#6f7a72]"
              }`}
            />
            <span
              className={
                connectionStatus === "connected"
                  ? "text-[#006c49]"
                  : connectionStatus === "reconnecting"
                  ? "text-[#855300]"
                  : "text-[#6f7a72]"
              }
            >
              {connectionStatus === "connected"
                ? "Live Update"
                : connectionStatus === "reconnecting"
                ? "Reconnecting..."
                : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Status Hero Banner */}
      {isCancelled ? (
        <div className="bg-[#ffdad6] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xs border border-[#ffb4ab]">
          <div className="w-16 h-16 rounded-full bg-[#ba1a1a]/15 text-[#ba1a1a] flex items-center justify-center mb-4 ring-8 ring-[#ba1a1a]/5">
            <span className="material-symbols-outlined text-[36px] font-bold">
              cancel
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#ba1a1a] mb-1">
            Order Cancelled
          </h2>
          <p className="text-xs sm:text-sm text-[#410002] max-w-[280px] leading-relaxed">
            This order was cancelled by the restaurant. Please contact staff for assistance.
          </p>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => setIsAssistanceOpen(true)}
              className="w-full py-3.5 px-4 bg-[#ba1a1a] text-white font-bold rounded-xl shadow-xs hover:bg-[#93000a] transition flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>Contact Staff</span>
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="w-full py-3.5 px-4 bg-white border border-[#bec9c0] text-[#1a1c1a] font-bold rounded-xl hover:bg-[#efeeeb] transition text-sm"
            >
              Return to Menu
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${hero.bgColor} rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-[#efeeeb] relative overflow-hidden flex flex-col items-center text-center`}
        >
          {hero.glow && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#9df4c8]/20 to-transparent pointer-events-none" />
          )}

          <div
            className={`relative z-10 w-16 h-16 rounded-full ${hero.iconBg} flex items-center justify-center mb-3 shadow-md ${
              isReady ? "animate-pulse" : ""
            }`}
          >
            <span className="material-symbols-outlined text-[32px] font-bold">
              {hero.icon}
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 text-[#005136] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#005136] animate-ping" />
            <span>Live Kitchen Status</span>
          </div>

          <h3 className="relative z-10 text-xl font-bold text-[#1a1c1a] mb-1">
            {hero.title}
          </h3>
          <p className="relative z-10 text-xs sm:text-sm text-[#3f4943] max-w-[280px]">
            {hero.subtitle}
          </p>
        </div>
      )}

      {/* Stepper Timeline */}
      {!isCancelled && (
        <OrderStatusTimeline currentStatus={statusNormalized} />
      )}

      {/* Contextual Action Buttons */}
      {isServed && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/feedback")}
            className="w-full py-3.5 px-4 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">star_rate</span>
            <span>Rate your experience</span>
          </button>
          <button
            onClick={() => navigate("/bill")}
            className="w-full py-3.5 px-4 bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] font-bold rounded-xl border border-[#bec9c0]/50 transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>Request the bill</span>
          </button>
        </section>
      )}

      {/* Order Items */}
      <OrderItems
        items={order?.items || []}
        itemStatuses={itemStatuses}
      />

      {/* Financial Summary */}
      <OrderSummary order={order} />

      {/* Staff Assistance Modal */}
      <CallAssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        tableNumber={tableDisplay}
      />
    </div>
  );
}

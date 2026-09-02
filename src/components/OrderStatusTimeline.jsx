export default function OrderStatusTimeline({ currentStatus = "pending" }) {
  const steps = [
    { key: "pending", label: "Pending", icon: "hourglass_top" },
    { key: "accepted", label: "Accepted", icon: "check" },
    { key: "preparing", label: "Preparing", icon: "skillet" },
    { key: "ready", label: "Ready", icon: "notifications_active" },
    { key: "served", label: "Served", icon: "room_service" },
  ];

  const statusNormalized = (currentStatus || "pending").toLowerCase();

  const getStepIndex = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 3;
      case "served":
      case "completed":
        return 4;
      case "cancelled":
      case "canceled":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(statusNormalized);
  const isCancelled = currentIndex === -1;

  if (isCancelled) {
    return (
      <div className="bg-[#ffffff] rounded-2xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#ffdad6]">
        <div className="flex items-center gap-3 text-[#ba1a1a]">
          <span className="material-symbols-outlined text-[24px]">cancel</span>
          <div className="text-sm font-semibold">Order processing stopped</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#efeeeb]">
      <div className="flex justify-between items-start relative px-1 sm:px-3">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isLast = idx === steps.length - 1;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 flex-1 group"
            >
              {/* Stepper Node */}
              {isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-[#005136] text-white flex items-center justify-center shadow-xs transition-transform duration-300">
                  <span className="material-symbols-outlined text-[18px] font-bold">
                    check
                  </span>
                </div>
              ) : isCurrent ? (
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-4 border-[#005136] flex items-center justify-center shadow-md -mt-0.5 animate-pulse-slow">
                    <div className="w-3 h-3 bg-[#005136] rounded-full" />
                  </div>
                  <span className="absolute -inset-1 rounded-full border border-[#005136]/30 animate-ping-subtle pointer-events-none" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#efeeeb] text-[#6f7a72] flex items-center justify-center border border-[#bec9c0]/60">
                  <span className="material-symbols-outlined text-[16px]">
                    {step.icon}
                  </span>
                </div>
              )}

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs mt-2 text-center font-medium transition-colors ${
                  isCurrent
                    ? "font-bold text-[#005136] scale-105"
                    : isCompleted
                    ? "text-[#005136]"
                    : "text-[#6f7a72]"
                }`}
              >
                {step.label}
              </span>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-500 ${
                    idx < currentIndex ? "bg-[#005136]" : "bg-[#efeeeb]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

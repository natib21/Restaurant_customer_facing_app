import { useState } from "react";

export default function CallAssistanceModal({ isOpen, onClose, tableNumber = "T-101" }) {
  const [selectedType, setSelectedType] = useState("waiter");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        // auto dismiss after 3 seconds if still open
        handleClose();
      }, 3000);
    }, 600);
  };

  const handleClose四周 = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    handleClose四周();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1a1c1a]/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
      />

      {/* Sheet Container */}
      <div className="fixed bottom-0 left-0 w-full bg-[#ffffff] rounded-t-2xl md:rounded-2xl shadow-[0px_-8px_30px_rgba(0,0,0,0.12)] z-50 transition-transform duration-300 pb-10 pt-4 px-5 flex flex-col md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-12">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-[#e3e2e0] rounded-full mx-auto mb-6 cursor-grab" />

        {!isSubmitted ? (
          <div className="flex flex-col w-full animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1a1c1a]">Need assistance?</h2>
                <p className="text-sm text-[#3f4943] mt-1">What can we help you with at table {tableNumber}?</p>
              </div>
              <button
                onClick={handleClose}
                className="text-[#3f4943] hover:text-[#1a1c1a] p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Options (Bento-style Grid) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Option 1: Bill */}
              <label
                onClick={() => setSelectedType("bill")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
                  selectedType === "bill"
                    ? "bg-[#006c49] text-white border-[#006c49] shadow-sm"
                    : "bg-[#faf9f6] text-[#1a1c1a] border-[#e3e2e0] hover:border-[#6f7a72]"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">receipt</span>
                <span className="text-sm font-semibold">Request the bill</span>
              </label>

              {/* Option 2: Waiter */}
              <label
                onClick={() => setSelectedType("waiter")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
                  selectedType === "waiter"
                    ? "bg-[#006c49] text-white border-[#006c49] shadow-sm"
                    : "bg-[#faf9f6] text-[#1a1c1a] border-[#e3e2e0] hover:border-[#6f7a72]"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">person_raised_hand</span>
                <span className="text-sm font-semibold">Call waiter</span>
              </label>

              {/* Option 3: Water */}
              <label
                onClick={() => setSelectedType("water")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
                  selectedType === "water"
                    ? "bg-[#006c49] text-white border-[#006c49] shadow-sm"
                    : "bg-[#faf9f6] text-[#1a1c1a] border-[#e3e2e0] hover:border-[#6f7a72]"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
                <span className="text-sm font-semibold">Need water</span>
              </label>

              {/* Option 4: Other */}
              <label
                onClick={() => setSelectedType("other")}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
                  selectedType === "other"
                    ? "bg-[#006c49] text-white border-[#006c49] shadow-sm"
                    : "bg-[#faf9f6] text-[#1a1c1a] border-[#e3e2e0] hover:border-[#6f7a72]"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                <span className="text-sm font-semibold">Something else</span>
              </label>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#005136] hover:bg-[#006c49] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md active:scale-[0.99] disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>Send Request</span>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-6 text-center w-full animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#9df4c8]/30 text-[#005136] flex items-center justify-center mb-4 ring-8 ring-[#9df4c8]/20">
              <span className="material-symbols-outlined text-[36px] font-bold">check</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1c1a] mb-1">Request sent</h3>
            <p className="text-sm text-[#3f4943] max-w-[260px] mx-auto mb-6">
              A staff member has been notified for table {tableNumber} and will assist you shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full border border-[#6f7a72] text-[#1a1c1a] font-semibold py-3.5 rounded-xl flex items-center justify-center hover:bg-[#efeeeb] transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </>
  );
}

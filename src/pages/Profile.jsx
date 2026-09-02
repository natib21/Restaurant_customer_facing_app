import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerContext } from "../context/CustomerContext";
import { FilteredMenuContext } from "../context/FilteredMenuContext";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, updateCustomer } = useContext(CustomerContext);
  const { tableNumber } = useContext(FilteredMenuContext);

  const [telegramEnabled, setTelegramEnabled] = useState(() => {
    return localStorage.getItem("telegramAlerts") === "true";
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer?.name || "Guest Customer");
  const [phone, setPhone] = useState(customer?.phone || "+251 912 345 678");

  const toggleTelegram = () => {
    const nextState = !telegramEnabled;
    setTelegramEnabled(nextState);
    localStorage.setItem("telegramAlerts", String(nextState));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomer({ name, phone });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 space-y-6">
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
            <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Your Profile</h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#efeeeb] text-[#005136] rounded-xl border border-[#bec9c0]/30">
            Table {tableNumber || "T-101"}
          </span>
        </div>

        {/* User Card */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#005136] text-white flex items-center justify-center text-xl font-bold shadow-xs">
              {name?.charAt(0)?.toUpperCase() || "G"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1c1a] leading-tight">{name}</h2>
              <p className="text-xs text-[#3f4943] mt-0.5">{phone}</p>
              <span className="inline-block text-[11px] font-semibold text-[#005136] bg-[#9df4c8]/30 px-2 py-0.2 rounded-md mt-1.5">
                Dine-in Customer
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-[#3f4943] hover:text-[#1a1c1a] rounded-xl hover:bg-[#efeeeb] transition-colors"
            title="Edit info"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isEditing ? "close" : "edit"}
            </span>
          </button>
        </div>

        {/* Edit Info Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="bg-[#ffffff] rounded-2xl border border-[#005136] p-5 shadow-xs space-y-3 animate-fade-in">
            <h3 className="text-sm font-bold text-[#1a1c1a]">Edit Your Info</h3>
            <div>
              <label className="block text-xs font-semibold text-[#3f4943] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-sm border border-[#e3e2e0] rounded-xl bg-[#faf9f6] focus:bg-white focus:border-[#005136] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3f4943] mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-sm border border-[#e3e2e0] rounded-xl bg-[#faf9f6] focus:bg-white focus:border-[#005136] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#005136] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Loyalty Membership Card */}
        <div className="bg-gradient-to-br from-[#005136] to-[#006c49] text-white rounded-2xl p-6 shadow-md relative overflow-hidden space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9df4c8] font-bold">
                Golden Fork Member
              </span>
              <h3 className="text-2xl font-black mt-1">1,250 <span className="text-sm font-normal text-white/80">pts</span></h3>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
              Silver Status
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1.5 font-medium">
              <span>Progress to Gold Tier</span>
              <span>750 pts remaining</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#fea619] rounded-full w-[62%]" />
            </div>
          </div>
        </div>

        {/* Bento Navigation Links */}
        <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] shadow-xs divide-y divide-[#efeeeb] overflow-hidden">
          {/* Order History */}
          <button
            onClick={() => navigate(`/history${location.search || ""}`)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#faf9f6] transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#efeeeb] text-[#005136] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1c1a]">Order History</h4>
                <p className="text-xs text-[#3f4943]">View past meals & receipts</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#6f7a72]">chevron_right</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => navigate(`/favorites${location.search || ""}`)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#faf9f6] transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/40 text-[#ba1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] fill">favorite</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1c1a]">Favorites</h4>
                <p className="text-xs text-[#3f4943]">Your saved top dishes</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#6f7a72]">chevron_right</span>
          </button>

          {/* Feedback & Review */}
          <button
            onClick={() => navigate(`/feedback${location.search || ""}`)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#faf9f6] transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffddb8]/60 text-[#855300] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] fill">star</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1c1a]">Give Feedback</h4>
                <p className="text-xs text-[#3f4943]">Rate your dining experience</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#6f7a72]">chevron_right</span>
          </button>

          {/* Telegram Notifications */}
          <div className="p-4 flex items-center justify-between hover:bg-[#faf9f6] transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1c1a]">Telegram Alerts</h4>
                <p className="text-xs text-[#3f4943]">Receive live food readiness updates</p>
              </div>
            </div>

            <button
              onClick={toggleTelegram}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                telegramEnabled ? "bg-[#005136]" : "bg-[#bec9c0]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  telegramEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

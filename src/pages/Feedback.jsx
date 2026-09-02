import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { feedbackUrl } from "../url/url";

export default function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();

  const [overallRating, setOverallRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem("sessionToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const payload = {
      rating: overallRating,
      foodRating,
      serviceRating,
      valueRating,
      comment: comments,
      channel: "qr_table",
      isPublic: true,
    };

    try {
      const res = await fetch(feedbackUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit feedback.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      // Still acknowledge user's feedback if network fails
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32 pt-2">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-4">
        {/* Page Header */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl text-[#3f4943] hover:text-[#1a1c1a] hover:bg-[#efeeeb] transition-colors"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1c1a] tracking-tight">Your Feedback</h1>
            <p className="text-xs text-[#3f4943]">Help us make your dining experience even better</p>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Overall Experience Card */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs text-center space-y-3">
              <h2 className="text-lg font-bold text-[#1a1c1a]">How was your dining experience?</h2>
              <p className="text-xs text-[#3f4943]">Tap a star to rate your overall visit</p>

              {/* 5 Big Stars */}
              <div className="flex justify-center items-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span
                      className={`material-symbols-outlined text-[36px] transition-colors ${
                        star <= overallRating
                          ? "text-[#fea619] fill"
                          : "text-[#bec9c0]"
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Categories */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6f7a72] pb-2 border-b border-[#efeeeb]">
                Detailed Rating
              </h3>

              {/* Food Quality */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1a1c1a]">Food & Taste Quality</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFoodRating(star)}
                      className="p-0.5"
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] ${
                          star <= foodRating ? "text-[#fea619] fill" : "text-[#bec9c0]"
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1a1c1a]">Service & Speed</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setServiceRating(star)}
                      className="p-0.5"
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] ${
                          star <= serviceRating ? "text-[#fea619] fill" : "text-[#bec9c0]"
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value for Money */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1a1c1a]">Value for Price</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValueRating(star)}
                      className="p-0.5"
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] ${
                          star <= valueRating ? "text-[#fea619] fill" : "text-[#bec9c0]"
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Textarea */}
            <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-6 shadow-xs space-y-2">
              <label className="block text-sm font-bold text-[#1a1c1a]">
                Additional Comments
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What dish did you enjoy most? Anything our kitchen or team could improve?"
                className="w-full p-3.5 text-sm text-[#1a1c1a] border border-[#e3e2e0] rounded-xl bg-[#faf9f6] focus:bg-white focus:border-[#005136] focus:ring-1 focus:ring-[#005136] outline-none transition resize-none placeholder:text-[#6f7a72]"
              />
            </div>

            {submitError && (
              <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-semibold">
                {submitError}
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        ) : (
          /* Thank You Celebration State */
          <div className="bg-[#ffffff] rounded-2xl border border-[#efeeeb] p-8 shadow-md text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-[#9df4c8]/30 text-[#005136] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#9df4c8]/20">
              <span className="material-symbols-outlined text-[36px] font-bold">thumb_up</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1a1c1a]">Thank you for your feedback!</h2>
            <p className="text-sm text-[#3f4943] max-w-sm mx-auto leading-relaxed">
              Your feedback helps us continually improve our recipes, service, and dining ambiance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/menu${location.search || ""}`)}
                className="flex-1 py-3.5 bg-[#005136] hover:bg-[#006c49] text-white font-bold rounded-xl shadow-sm text-sm"
              >
                Back to Menu
              </button>
              <button
                onClick={() => navigate(`/history${location.search || ""}`)}
                className="flex-1 py-3.5 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1a1c1a] font-semibold rounded-xl text-sm"
              >
                View Order History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

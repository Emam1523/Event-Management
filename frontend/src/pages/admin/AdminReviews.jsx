import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiTrash2, FiMessageSquare, FiUser } from "react-icons/fi";
import { appReviewsAPI } from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";
import { format, isValid } from "date-fns";

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar
        key={s}
        className={
          s <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"
        }
        size={14}
        style={{ fill: s <= rating ? "currentColor" : "none" }}
      />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === star).length / reviews.length) *
            100,
        )
      : 0,
  }));

  useEffect(() => {
    appReviewsAPI
      .getAll()
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await appReviewsAPI.delete(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showNotification("Review deleted.", "success");
    } catch {
      showNotification("Failed to delete.", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          App Reviews
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          User feedback and ratings for the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-zinc-900/80 border border-white/8 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
            Average Rating
          </p>
          <p className="text-5xl font-black text-white mb-2">{avgRating}</p>
          <StarDisplay rating={Math.round(avgRating)} />
        </div>
        <div className="rounded-2xl bg-zinc-900/80 border border-white/8 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
            Total Reviews
          </p>
          <p className="text-5xl font-black text-white">{reviews.length}</p>
        </div>
        <div className="rounded-2xl bg-zinc-900/80 border border-white/8 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
            Rating Breakdown
          </p>
          <div className="space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-500 w-3">
                  {star}
                </span>
                <FiStar
                  size={10}
                  className="text-amber-400"
                  style={{ fill: "currentColor" }}
                />
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/80 border border-white/8 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <FiMessageSquare className="text-brand-orange text-lg" />
          <h2 className="font-black text-white">All Reviews</h2>
          <span className="ml-auto text-[10px] bg-white/5 text-zinc-400 px-3 py-1 rounded-full font-bold">
            {reviews.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-2 border-white/10 border-t-brand-orange rounded-full animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center">
            <FiMessageSquare className="text-zinc-700 text-4xl mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No reviews yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-6 flex items-start gap-5 hover:bg-white/2 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-orange to-rose-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {review.user?.name?.charAt(0)?.toUpperCase() || <FiUser />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <p className="font-black text-white text-sm">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <StarDisplay rating={review.rating} />
                    <span className="text-[10px] text-zinc-600 font-medium ml-auto">
                      {isValid(new Date(review.createdAt))
                        ? format(new Date(review.createdAt), "MMM d, yyyy")
                        : ""}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <FiTrash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;

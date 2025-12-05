import React, { useEffect, useState, useCallback } from "react";
import ReviewSubmit from "./ReviewSubmit";
import ReviewList from "./ReviewList";
import { reviewService } from "../services/reviewService";
import type { ItemReviewResponse, Review } from "../types/review";

interface Props {
  menuItem: { _id: string; title?: string; imageURL?: string; description?: string };
  onClose: () => void;
}

const ReviewModal: React.FC<Props> = ({ menuItem, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getItemReviews(menuItem._id);
      const data = res.data as ItemReviewResponse;
      setReviews(data.reviews);
      setAvg(data.averageRating);
      setTotal(data.totalReviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [menuItem._id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-auto max-h-[90vh] p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">Reviews — {menuItem.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-lg font-bold text-yellow-600">
                {avg.toFixed(1)} ★
              </div>
              <div className="text-sm text-gray-600">{total} review{total !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-lg">Write a review</h3>
            <ReviewSubmit menuItemId={menuItem._id} onSubmitted={load} />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg">Recent reviews</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
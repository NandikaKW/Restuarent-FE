import React, { useState } from "react";
import { reviewService } from "../services/reviewService";
import StarRating from "./StarRating";

interface Props {
  menuItemId: string;
  onSubmitted?: () => void;
}

const ReviewSubmit: React.FC<Props> = ({ menuItemId, onSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return alert("Please add a rating (1-5 stars).");
    try {
      setLoading(true);
      await reviewService.submitReview({ menuItemId, rating, comment });
      setComment("");
      setRating(0);
      onSubmitted?.();
      alert("Review submitted. It will appear after admin approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mt-1 block w-full border rounded p-2 text-sm"
          placeholder="Share your experience..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;

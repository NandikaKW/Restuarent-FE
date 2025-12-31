import React, { useState } from "react";
import { reviewService } from "../services/reviewService";
import StarRating from "./StarRating";
import '../components/componentStyles/ReviewSubmit.css';

interface Props {
  menuItemId: string;
  onSubmitted?: () => void;
}

const ReviewSubmit: React.FC<Props> = ({ menuItemId, onSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const RATING_TEXTS = [
    "Select your rating",
    "Poor - Not satisfied",
    "Fair - Could be better",
    "Good - Met expectations",
    "Very Good - Exceeded expectations",
    "Excellent - Absolutely loved it!"
  ];

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please add a rating (1-5 stars) before submitting.");
      return;
    }
    
    try {
      setLoading(true);
      await reviewService.submitReview({ menuItemId, rating, comment });
      setComment("");
      setRating(0);
      setHoverRating(0);
      onSubmitted?.();
      alert("🎉 Review submitted successfully! It will appear after admin approval.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStarHover = (star: number) => {
    if (!loading) setHoverRating(star);
  };

  const handleStarClick = (star: number) => {
    if (!loading) {
      setRating(star);
      setHoverRating(0);
    }
  };

  const handleStarLeave = () => {
    if (!loading) setHoverRating(0);
  };

  const getRatingText = (rating: number): string => {
    return RATING_TEXTS[rating] || RATING_TEXTS[0];
  };

  const getRatingDisplay = () => {
    const displayRating = hoverRating || rating;
    return {
      text: getRatingText(displayRating),
      value: rating > 0 ? `${rating}.0 / 5.0` : ""
    };
  };

  const ratingDisplay = getRatingDisplay();

  return (
    <div className="review-submit-container">
      
      <div className="review-submit-header">
        <i className="fa-solid fa-pen-to-square"></i>
        <div>
          <h3 className="review-submit-title">Write Your Review</h3>
          <p className="review-submit-subtitle">Your feedback matters to us</p>
        </div>
      </div>

      
      <div className="review-rating-section">
        <label className="review-label">
          <i className="fa-solid fa-star"></i>
          Your Rating
        </label>
        
        <div className="review-rating-wrapper">
          <div className="review-stars-container" onMouseLeave={handleStarLeave}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`review-star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                disabled={loading}
              >
                <i className="fa-solid fa-star"></i>
              </button>
            ))}
          </div>
          
          <div className="review-rating-feedback">
            <span className={`review-rating-status ${rating > 0 ? 'has-rating' : ''}`}>
              {ratingDisplay.text}
            </span>
            {rating > 0 && (
              <span className="review-rating-value">
                {ratingDisplay.value}
              </span>
            )}
          </div>
        </div>
      </div>

      
      <div className="review-comment-section">
        <label className="review-label">
          <i className="fa-solid fa-comment-dots"></i>
          Your Review
        </label>
        
        <div className="review-textarea-wrapper">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="review-textarea"
            placeholder="Share your experience with this item... What did you like? What could be improved?"
            disabled={loading}
            maxLength={500}
          />
          <div className="review-textarea-footer">
            <span className={`review-char-count ${comment.length > 400 ? 'warning' : ''}`}>
              {comment.length} / 500 characters
            </span>
            {comment.length > 400 && (
              <span className="review-char-warning">
                <i className="fa-solid fa-exclamation-triangle"></i>
                Approaching character limit
              </span>
            )}
          </div>
        </div>
        
        <div className="review-tips">
          <p className="review-tips-title">
            <i className="fa-solid fa-lightbulb"></i>
            Review Tips:
          </p>
          <ul className="review-tips-list">
            <li>Be specific about what you liked or disliked</li>
            <li>Mention portion size, taste, and presentation</li>
            <li>Share if the item met your expectations</li>
          </ul>
        </div>
      </div>

      
      <div className="review-submit-actions">
        <button
          onClick={handleSubmit}
          className={`review-submit-btn ${rating > 0 ? 'active' : ''}`}
          disabled={loading || rating === 0}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Submitting Review...
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane"></i>
              Submit Review
            </>
          )}
        </button>
        
        <div className="review-note">
          <i className="fa-solid fa-shield-alt"></i>
          <span>Your review will be moderated before appearing publicly</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
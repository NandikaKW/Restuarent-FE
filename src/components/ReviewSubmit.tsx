import React, { useState } from "react";
import { reviewService } from "../services/reviewService";
import './componentStyles/ReviewSubmit.css';

interface Props {
  menuItemId: string;
  onSubmitted?: () => void;
}

// Custom Success Popup Component
const SuccessPopup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <div className="success-popup-icon">
          <i className="fa-solid fa-leaf"></i>
        </div>
        <div className="success-popup-content">
          <h4>Success!</h4>
          <p>{message}</p>
        </div>
        <button className="success-popup-close" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
  );
};

const ReviewSubmit: React.FC<Props> = ({ menuItemId, onSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setErrorMessage("Please select a rating");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      await reviewService.submitReview({ menuItemId, rating, comment });
      setComment("");
      setRating(0);
      onSubmitted?.();
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage("Failed to submit review");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const ratingTexts = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="submit-container">
      
      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup 
          message="Your review has been submitted successfully! It will appear after admin approval." 
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {errorMessage}
        </div>
      )}

      {/* Rating */}
      <div className="rating-section">
        <label>Your Rating <span className="required">*</span></label>
        <div className="stars-wrapper">
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={loading}
                aria-label={`Rate ${star} stars`}
              >
                <i className="fa-solid fa-star"></i>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="rating-text">{ratingTexts[rating-1]}</span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="comment-section">
        <label>Your Review (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience with this item..."
          disabled={loading}
          maxLength={500}
        />
        <div className="char-count">
          {comment.length}/500 characters
        </div>
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button
          onClick={handleSubmit}
          className={`submit-btn ${rating > 0 ? 'active' : ''}`}
          disabled={loading || rating === 0}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Submitting...
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane"></i>
              Submit Review
            </>
          )}
        </button>
        <p className="note">
          <i className="fa-solid fa-shield-alt"></i>
          Your review will be moderated before appearing publicly
        </p>
      </div>
    </div>
  );
};

export default ReviewSubmit;
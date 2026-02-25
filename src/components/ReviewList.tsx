import React, { useState } from "react";
import StarRating from "./StarRating";
import type { Review } from "../types/review";
import './componentStyles/ReviewList.css';

interface Props {
  reviews: Review[];
}

// Stylish Report Confirmation Dialog
const ReportDialog: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  return (
    <div className="report-dialog-overlay" onClick={onCancel}>
      <div className="report-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="report-dialog-header">
          <div className="report-dialog-icon">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <h3>Report Review</h3>
          <button className="report-dialog-close" onClick={onCancel}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="report-dialog-body">
          <p>Are you sure you want to report this review?</p>
          <p className="report-dialog-note">Our moderation team will review this report within 24 hours.</p>
        </div>
        <div className="report-dialog-actions">
          <button className="report-dialog-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="report-dialog-confirm" onClick={onConfirm}>
            <i className="fa-solid fa-flag"></i>
            Report Review
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Message Component
const SuccessMessage: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-message">
      <i className="fa-solid fa-leaf"></i>
      <span>{message}</span>
    </div>
  );
};

const ReviewList: React.FC<Props> = ({ reviews }) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getUserName = (review: Review): string => {
    if (review.userName) return review.userName;
    if (typeof review.userId === "object" && review.userId !== null) {
      const firstName = review.userId.firstName || "";
      const lastName = review.userId.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      if (review.userId.email) return review.userId.email.split('@')[0];
    }
    return "Anonymous User";
  };

  const getUserInitials = (review: Review): string => {
    const name = getUserName(review);
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleHelpful = (reviewId: string) => {
    setSuccessMessage("Thanks for marking this review as helpful!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleReportClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setShowReportDialog(true);
  };

  const handleReportConfirm = () => {
    setShowReportDialog(false);
    setSuccessMessage("Review reported successfully. Our team will review it.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleReportCancel = () => {
    setShowReportDialog(false);
    setSelectedReviewId(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="list-empty">
        <i className="fa-solid fa-comment-slash"></i>
        <p>No reviews yet</p>
        <span>Be the first to share your experience!</span>
      </div>
    );
  }

  return (
    <div className="list-container">
      
      {/* Report Dialog */}
      {showReportDialog && (
        <ReportDialog 
          onConfirm={handleReportConfirm}
          onCancel={handleReportCancel}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage 
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            
            {/* Header */}
            <div className="review-header">
              <div className="review-avatar">
                {getUserInitials(review)}
              </div>
              <div className="review-info">
                <h4>{getUserName(review)}</h4>
                <span className="review-date">
                  <i className="fa-solid fa-calendar"></i>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div className="review-rating">
                <span className="rating-value">{review.rating.toFixed(1)}</span>
                <StarRating rating={review.rating} readOnly size={14} />
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="review-comment">{review.comment}</p>
            )}

            {/* Footer */}
            <div className="review-footer">
              <span className={`status ${review.status}`}>
                <i className={`fa-solid ${review.status === "approved" ? 'fa-check-circle' : 'fa-clock'}`}></i>
                {review.status === "approved" ? 'Verified Purchase' : 'Pending Review'}
              </span>
              <div className="review-actions">
                <button onClick={() => handleHelpful(review._id)}>
                  <i className="fa-regular fa-thumbs-up"></i>
                  Helpful
                </button>
                <button onClick={() => handleReportClick(review._id)}>
                  <i className="fa-regular fa-flag"></i>
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
import React from "react";
import StarRating from "./StarRating";
import type { Review } from "../types/review";
import '../components/componentStyles/ReviewList.css';

interface Props {
  reviews: Review[];
}

const ReviewList: React.FC<Props> = ({ reviews }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getUserName = (review: Review): string => {
    if (review.userName) return review.userName;
    
    if (typeof review.userId === "object") {
      const firstName = review.userId.firstName || "";
      const lastName = review.userId.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      
      if (review.userId.email) {
        const email = review.userId.email;
        return email.split('@')[0];
      }
    }
    
    return "Anonymous User";
  };

  const getUserInitials = (review: Review): string => {
    const name = getUserName(review);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRatingInfo = (rating: number) => {
    const ratingTexts: { [key: number]: string } = {
      5: "Excellent",
      4: "Very Good", 
      3: "Good",
      2: "Fair",
      1: "Poor"
    };
    
    let colorClass = "text-red-600";
    if (rating >= 4.5) colorClass = "text-green-600";
    else if (rating >= 3.5) colorClass = "text-yellow-600";
    else if (rating >= 2.5) colorClass = "text-orange-600";
    
    return {
      text: ratingTexts[rating] || "Rated",
      colorClass
    };
  };

  const handleHelpful = (reviewId: string) => {
    alert(`Thanks for marking review ${reviewId} as helpful!`);
  };

  const handleReport = (reviewId: string) => {
    alert(`Reported review ${reviewId} to admin`);
  };

  return (
    <div className="review-list-container">
      {reviews.length === 0 ? (
        <div className="review-empty-state">
          <div className="review-empty-icon">
            <i className="fa-solid fa-comment-dots"></i>
          </div>
          <h3 className="review-empty-title">No Reviews Yet</h3>
          <p className="review-empty-text">
            Be the first to share your experience with this item!
          </p>
        </div>
      ) : (
        <div className="review-items-grid">
          {reviews.map((review) => {
            const userName = getUserName(review);
            const userInitials = getUserInitials(review);
            const formattedDate = formatDate(review.createdAt);
            const ratingInfo = getRatingInfo(review.rating);
            
            return (
              <div key={review._id} className="review-card">
                {/* Header */}
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">
                      {userInitials}
                    </div>
                    <div className="review-user-info">
                      <h4 className="review-user-name">{userName}</h4>
                      <div className="review-meta">
                        <span className="review-date">
                          <i className="fa-solid fa-calendar-days"></i>
                          {formattedDate}
                        </span>
                        {review.status === "approved" && (
                          <span className="review-verified">
                            <i className="fa-solid fa-badge-check"></i>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="review-rating-badge">
                    <div className="review-rating-score">
                      <span className={`review-rating-number ${ratingInfo.colorClass}`}>
                        {review.rating.toFixed(1)}
                      </span>
                      <span className="review-rating-outof">/5</span>
                    </div>
                    <div className="review-rating-text">
                      {ratingInfo.text}
                    </div>
                  </div>
                </div>

                
                <div className="review-stars">
                  <StarRating rating={review.rating} readOnly size={18} />
                </div>

                
                {review.comment && (
                  <div className="review-comment">
                    <p className="review-comment-text">"{review.comment}"</p>
                  </div>
                )}

                
                <div className="review-actions">
                  <div className="review-action-buttons">
                    <button 
                      className="review-action-btn helpful" 
                      onClick={() => handleHelpful(review._id)}
                    >
                      <i className="fa-solid fa-thumbs-up"></i>
                      Helpful
                    </button>
                    
                    
                    <div className="review-action-spacer"></div>
                    
                    <button 
                      className="review-action-btn report" 
                      onClick={() => handleReport(review._id)}
                    >
                      <i className="fa-solid fa-flag"></i>
                      Report
                    </button>
                  </div>
                  
                  {review.menuItemSnapshot && (
                    <div className="review-item-info">
                      <i className="fa-solid fa-utensils"></i>
                      <span>{review.menuItemSnapshot.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
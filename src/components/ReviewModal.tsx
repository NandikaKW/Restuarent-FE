import React, { useEffect, useState, useCallback } from "react";
import ReviewSubmit from "./ReviewSubmit";
import ReviewList from "./ReviewList";
import { reviewService } from "../services/reviewService";
import type { ItemReviewResponse, Review } from "../types/review";
import '../components/componentStyles/ReviewModal.css';

interface Props {
  menuItem: { _id: string; title?: string; imageURL?: string; description?: string };
  onClose: () => void;
}

type TabType = 'submit' | 'list';

const ReviewModal: React.FC<Props> = ({ menuItem, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('submit');

  const loadReviews = useCallback(async () => {
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
    loadReviews();
  }, [loadReviews]);

  const getRatingInfo = (rating: number) => {
    if (rating >= 4.5) return { color: "rating-excellent", text: "Excellent" };
    if (rating >= 3.5) return { color: "rating-good", text: "Good" };
    if (rating >= 2.5) return { color: "rating-average", text: "Average" };
    return { color: "rating-poor", text: "Needs Improvement" };
  };

  const ratingInfo = getRatingInfo(avg);
  const verifiedCount = reviews.filter(r => r.status === "approved").length;

  return (
    <div 
      className="review-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="review-modal-container">
        
        <div className="review-modal-header">
          <div className="review-modal-title-section">
            <div className="review-modal-badge">
              <i className="fa-solid fa-star"></i>
              Reviews
            </div>
            <h2 className="review-modal-title">{menuItem.title}</h2>
            <p className="review-modal-subtitle">
              Share your experience and read what others think
            </p>
          </div>

          <button onClick={onClose} className="review-modal-close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        
        <div className="review-summary-card">
          <div className="review-summary-content">
            <div className="review-average-rating">
              <div className={`review-rating-circle ${ratingInfo.color}`}>
                <span className="review-rating-number">{avg.toFixed(1)}</span>
                <span className="review-rating-outof">/5</span>
              </div>
              <div className="review-rating-details">
                <div className="review-rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fa-solid fa-star ${i < Math.floor(avg) ? 'star-filled' : 'star-empty'}`}
                    ></i>
                  ))}
                </div>
                <span className="review-rating-text">{ratingInfo.text}</span>
              </div>
            </div>
            
            <div className="review-summary-stats">
              <div className="review-stat-item">
                <i className="fa-solid fa-comment"></i>
                <div>
                  <h3>{total}</h3>
                  <p>Total Reviews</p>
                </div>
              </div>
              <div className="review-stat-item">
                <i className="fa-solid fa-users"></i>
                <div>
                  <h3>{verifiedCount}</h3>
                  <p>Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="review-tab-navigation">
          <button 
            className={`review-tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Write Review
          </button>
          <button 
            className={`review-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <i className="fa-solid fa-comments"></i>
            View Reviews ({total})
          </button>
        </div>

        
        <div className="review-modal-content">
          {activeTab === 'submit' ? (
            <div className="review-tab-content active">
              <div className="review-form-section">
                <div className="review-section-header">
                  <div className="review-section-icon">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </div>
                  <div>
                    <h3 className="review-section-title">Share Your Experience</h3>
                    <p className="review-section-subtitle">Your feedback helps others make better choices</p>
                  </div>
                </div>
                <ReviewSubmit menuItemId={menuItem._id} onSubmitted={loadReviews} />
              </div>
            </div>
          ) : (
            <div className="review-tab-content active">
              <div className="review-list-section">
                <div className="review-section-header">
                  <div className="review-section-icon">
                    <i className="fa-solid fa-comments"></i>
                  </div>
                  <div>
                    <h3 className="review-section-title">Customer Reviews</h3>
                    <p className="review-section-subtitle">
                      {total} {total === 1 ? 'review' : 'reviews'} from our community
                    </p>
                  </div>
                </div>
                
                {loading ? (
                  <div className="review-loading">
                    <div className="review-loading-spinner">
                      <i className="fa-solid fa-utensils fa-spin"></i>
                    </div>
                    <p className="review-loading-text">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <ReviewList reviews={reviews} />
                ) : (
                  <div className="review-empty-state">
                    <div className="review-empty-icon">
                      <i className="fa-solid fa-comment-slash"></i>
                    </div>
                    <h3 className="review-empty-title">No Reviews Yet</h3>
                    <p className="review-empty-text">
                      Be the first to share your thoughts about this item!
                    </p>
                    <button 
                      className="review-write-first-btn"
                      onClick={() => setActiveTab('submit')}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      Write the First Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
import React, { useEffect, useState, useCallback, useRef } from "react";
import ReviewSubmit from "./ReviewSubmit";
import ReviewList from "./ReviewList";
import { reviewService } from "../services/reviewService";
import type { ItemReviewResponse, Review } from "../types/review";
import './componentStyles/ReviewModal.css';

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
  const modalRef = useRef<HTMLDivElement>(null);

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
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
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
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-container" ref={modalRef}>
        
        {/* Simple Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <span className="modal-badge">
              <i className="fa-solid fa-star"></i> Reviews
            </span>
            <h2 className="modal-title">{menuItem.title || "Item"}</h2>
          </div>
          <button onClick={onClose} className="modal-close">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Simple Summary */}
        <div className="modal-summary">
          <div className="rating-circle">
            <span className="rating-number">{avg.toFixed(1)}</span>
          </div>
          <div className="rating-stats">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa-solid fa-star ${i < Math.floor(avg) ? 'filled' : ''}`}></i>
              ))}
            </div>
            <span className="rating-text">{ratingInfo.text}</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-comment"></i>
            <span>{total} reviews</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-check-circle"></i>
            <span>{verifiedCount} verified</span>
          </div>
        </div>

        {/* Simple Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <i className="fa-solid fa-pen"></i>
            Write Review
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <i className="fa-solid fa-list"></i>
            View Reviews ({total})
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-content">
          {activeTab === 'submit' ? (
            <ReviewSubmit menuItemId={menuItem._id} onSubmitted={loadReviews} />
          ) : (
            <>
              {loading ? (
                <div className="loading-state">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-comment-slash"></i>
                  <p>No reviews yet</p>
                  <span>Be the first to share your experience!</span>
                  <button onClick={() => setActiveTab('submit')}>
                    Write First Review
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
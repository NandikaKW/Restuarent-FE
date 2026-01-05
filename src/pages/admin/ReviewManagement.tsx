import React, { useEffect, useState } from "react";
import { adminReviewService } from "../../services/reviewService";
import type { Review } from "../../types/review";
import { format } from "date-fns";
import "../../components/componentStyles/ReviewManagement.css"; 


const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const statusParam = filter === "all" ? undefined : filter;
      const res = await adminReviewService.getAllReviews(page, limit, statusParam);
      const data = res.data;
      setReviews(data.reviews);
      setTotalPages(data.pagination?.totalPages || 1);
      
      // Calculate stats
      const totalReviews = data.reviews;
      const statsData = {
        total: data.pagination?.totalCount || 0,
        pending: totalReviews.filter((r: Review) => r.status === "pending").length,
        approved: totalReviews.filter((r: Review) => r.status === "approved").length,
        rejected: totalReviews.filter((r: Review) => r.status === "rejected").length
      };
      setStats(statsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      setActionLoading(id);
      await adminReviewService.updateReviewStatus(id, status);
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      load(); // Refresh stats
    } catch (err: any) {
      console.error(err);
      alert("Failed to update review status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);
      await adminReviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setShowDeleteModal(false);
      setSelectedReview(null);
      load(); // Refresh stats
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = search === "" ||
      (review.userName && review.userName.toLowerCase().includes(searchTerm)) ||
      (typeof review.userId === "object" && 
        `${(review.userId as any).firstName || ""} ${(review.userId as any).lastName || ""}`
          .toLowerCase().includes(searchTerm)) ||
      (review.menuItemSnapshot?.title && 
        review.menuItemSnapshot.title.toLowerCase().includes(searchTerm)) ||
      (typeof review.menuItemId === "object" && 
        (review.menuItemId as any).title?.toLowerCase().includes(searchTerm)) ||
      review.comment?.toLowerCase().includes(searchTerm);
    
    return matchesSearch;
  });

  const getUserName = (review: Review) => {
    if (review.userName) return review.userName;
    if (typeof review.userId === "object") {
      const user = review.userId as any;
      return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    }
    return "User";
  };

  const getItemName = (review: Review) => {
    if (review.menuItemSnapshot?.title) return review.menuItemSnapshot.title;
    if (typeof review.menuItemId === "object") {
      return (review.menuItemId as any).title || "Item";
    }
    return "Item";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="rm-stars">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas fa-star ${i < rating ? 'rm-star-filled' : 'rm-star-empty'}`}
          />
        ))}
        <span className="rm-rating-text">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="review-management-page">
      {/* Header */}
      <div className="rm-header">
        <h2>Review Management</h2>
        <p>Manage and moderate customer reviews</p>
      </div>

      {/* Stats */}
      <div className="rm-stats">
        <div className="rm-stat-card">
          <div className="rm-stat-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="rm-stat-content">
            <h3>{stats.total}</h3>
            <p>Total Reviews</p>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="rm-stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="rm-stat-content">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>

        <div className="rm-stat-card">
          <div className="rm-stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="rm-stat-content">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rm-controls">
        <div className="rm-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by user, item, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rm-filter-buttons">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`rm-filter-btn ${filter === f ? 'rm-filter-active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rm-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={load} className="rm-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rm-loading">
          <div className="rm-loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rm-empty">
          <i className="fas fa-comment-slash"></i>
          <h3>No Reviews Found</h3>
          <p>No reviews found matching your search criteria.</p>
        </div>
      ) : (
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Item</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => {
                const status = review.status;
                const isPending = status === "pending";
                
                return (
                  <tr key={review._id} className={`rm-status-${status}`}>
                    <td>
                      <div className="rm-user-name">{getUserName(review)}</div>
                      {review.userEmail && (
                        <div className="rm-user-email">{review.userEmail}</div>
                      )}
                    </td>
                    
                    <td>
                      <div className="rm-item-name">{getItemName(review)}</div>
                    </td>
                    
                    <td>
                      {renderStars(review.rating)}
                    </td>
                    
                    <td>
                      <div className="rm-comment">
                        {review.comment?.substring(0, 60) || "No comment"}
                        {review.comment && review.comment.length > 60 && "..."}
                      </div>
                      {review.comment && review.comment.length > 60 && (
                        <button 
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDetailsModal(true);
                          }}
                          className="rm-view-more"
                        >
                          View more
                        </button>
                      )}
                    </td>
                    
                    <td>
                      <div className={`rm-status rm-status-${status}`}>
                        {status}
                      </div>
                    </td>
                    
                    <td>
                      <div className="rm-date">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</div>
                      <div className="rm-time">{format(new Date(review.createdAt), 'hh:mm a')}</div>
                    </td>
                    
                    <td>
                      <div className="rm-actions">
                        {isPending && (
                          <>
                            <button 
                              onClick={() => handleStatus(review._id, "approved")}
                              disabled={actionLoading === review._id}
                              className="rm-approve-btn"
                              title="Approve"
                            >
                              {actionLoading === review._id ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-check"></i>
                              )}
                            </button>
                            <button 
                              onClick={() => handleStatus(review._id, "rejected")}
                              disabled={actionLoading === review._id}
                              className="rm-reject-btn"
                              title="Reject"
                            >
                              {actionLoading === review._id ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-times"></i>
                              )}
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDetailsModal(true);
                          }}
                          className="rm-view-btn"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDeleteModal(true);
                          }}
                          className="rm-delete-btn"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredReviews.length > 0 && (
        <div className="rm-pagination">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
            className="rm-pagination-btn rm-pagination-prev"
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          
          <div className="rm-pagination-info">
            Page <span className="rm-page-current">{page}</span> of <span className="rm-page-total">{totalPages}</span>
          </div>
          
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="rm-pagination-btn rm-pagination-next"
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className="rm-modal-overlay">
          <div className="rm-modal">
            <div className="rm-modal-header">
              <h3>Review Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="rm-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="rm-modal-body">
              <div className="rm-modal-section">
                <h4>User Information</h4>
                <div className="rm-modal-row">
                  <div><strong>Name:</strong> <span>{getUserName(selectedReview)}</span></div>
                  {selectedReview.userEmail && (
                    <div><strong>Email:</strong> <span>{selectedReview.userEmail}</span></div>
                  )}
                </div>
              </div>
              
              <div className="rm-modal-section">
                <h4>Item Reviewed</h4>
                <div className="rm-modal-row">
                  <div><strong>Item:</strong> <span>{getItemName(selectedReview)}</span></div>
                  <div><strong>Rating:</strong> <span>{renderStars(selectedReview.rating)}</span></div>
                </div>
              </div>
              
              <div className="rm-modal-section">
                <h4>Review Details</h4>
                <div className="rm-modal-row">
                  <div><strong>Status:</strong> 
                    <span className={`rm-status rm-status-${selectedReview.status}`}>
                      {selectedReview.status}
                    </span>
                  </div>
                  <div><strong>Date:</strong> <span>{format(new Date(selectedReview.createdAt), 'MMM dd, yyyy hh:mm a')}</span></div>
                </div>
              </div>
              
              {selectedReview.comment && (
                <div className="rm-modal-section">
                  <h4>Full Comment</h4>
                  <div className="rm-full-comment">
                    {selectedReview.comment}
                  </div>
                </div>
              )}
            </div>
            
            <div className="rm-modal-footer">
              <button onClick={() => setShowDetailsModal(false)} className="rm-close-btn">
                Close
              </button>
              {selectedReview.status === "pending" && (
                <div className="rm-modal-actions">
                  <button 
                    onClick={() => {
                      handleStatus(selectedReview._id, "approved");
                      setShowDetailsModal(false);
                    }}
                    className="rm-approve-action-btn"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      handleStatus(selectedReview._id, "rejected");
                      setShowDetailsModal(false);
                    }}
                    className="rm-reject-action-btn"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedReview && (
        <div className="rm-modal-overlay">
          <div className="rm-modal">
            <div className="rm-modal-header rm-delete-header">
              <h3>Delete Review</h3>
              <button onClick={() => setShowDeleteModal(false)} className="rm-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="rm-modal-body">
              <div className="rm-delete-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Are you sure you want to delete this review?</p>
              </div>
              
              <div className="rm-delete-details">
                <div><strong>User:</strong> <span>{getUserName(selectedReview)}</span></div>
                <div><strong>Item:</strong> <span>{getItemName(selectedReview)}</span></div>
                <div><strong>Rating:</strong> <span>{renderStars(selectedReview.rating)}</span></div>
                <div><strong>Status:</strong> 
                  <span className={`rm-status rm-status-${selectedReview.status}`}>
                    {selectedReview.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="rm-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="rm-keep-btn">
                Keep Review
              </button>
              <button 
                onClick={() => handleDelete(selectedReview._id)}
                disabled={actionLoading === selectedReview._id}
                className="rm-confirm-delete-btn"
              >
                {actionLoading === selectedReview._id ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
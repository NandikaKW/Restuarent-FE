// components/ReviewList.tsx
import React from "react";
import StarRating from "./StarRating";
import type { Review } from "../types/review";
// import { FaUserCircle } from "react-icons/fa";

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
        return email.split('@')[0]; // Show username part of email
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

  const getRatingText = (rating: number): string => {
    const ratings = {
      5: "Excellent",
      4: "Good", 
      3: "Average",
      2: "Poor",
      1: "Terrible"
    };
    return ratings[rating as keyof typeof ratings] || "Rated";
  };

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {reviews.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <div className="text-gray-400 text-4xl mb-2">📝</div>
          <h3 className="font-medium text-gray-600">No reviews yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div 
            key={review._id} 
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* User Info & Rating Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {getUserInitials(review)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {getUserName(review)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                    {review.status === "approved" && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Rating Badge */}
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <StarRating rating={review.rating} readOnly size={16} />
                  <span className="text-sm font-semibold text-gray-700">
                    {review.rating}.0
                  </span>
                </div>
                <div className="text-xs font-medium text-yellow-600">
                  {getRatingText(review.rating)}
                </div>
              </div>
            </div>
            
            {/* Comment */}
            {review.comment && (
              <div className="mt-3">
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            )}
            
            {/* Helpful Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="flex gap-3">
                <button 
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  onClick={() => alert("Thanks for your feedback!")}
                >
                  👍 Helpful
                </button>
                <button 
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  onClick={() => alert("Reported to admin")}
                >
                  ⚠️ Report
                </button>
              </div>
              
              {review.menuItemSnapshot && (
                <div className="text-xs text-gray-400">
                  {review.menuItemSnapshot.title}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
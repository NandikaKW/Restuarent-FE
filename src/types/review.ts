export type ReviewStatus = "pending" | "approved" | "rejected";

// types/review.ts
export interface Review {
  _id: string;
  userId: string | { 
    _id: string; 
    firstName: string; 
    lastName: string; 
    email: string;
  };
  menuItemId: string | { _id: string; title?: string; imageURL?: string };
  rating: number;
  comment?: string;
  status: ReviewStatus;
  userName?: string;
  userEmail?: string;
  menuItemSnapshot?: {
    _id?: string;
    title?: string;
    imageURL?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface ItemReviewResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [k in 1|2|3|4|5]: number };
}

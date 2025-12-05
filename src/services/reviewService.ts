// services/reviewService.ts
import { api } from "./api";
import type { Review } from "../types/review";

// ===============================
// USER SIDE SERVICE
// ===============================
export const reviewService = {
  // Get reviews of a specific menu item
  // CHANGE THIS: /reviews/menu/ → /reviews/item/
  getItemReviews: (menuItemId: string) =>
    api.get(`/reviews/item/${menuItemId}`), // FIXED HERE

  // Submit new review
  submitReview: (data: { menuItemId: string; rating: number; comment: string }) =>
    api.post("/reviews", data),
};

// ===============================
// ADMIN SIDE SERVICE
// ===============================
export const adminReviewService = {
  getAllReviews: (page = 1, limit = 20, status?: string) =>
    api.get<{ reviews: Review[]; pagination: any; stats: any }>(
      `/reviews?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`
    ),

  updateReviewStatus: (id: string, status: "approved" | "rejected" | "pending") =>
    api.patch<{ message: string; review: Review }>(`/reviews/${id}/status`, { status }),

  deleteReview: (id: string) => api.delete<{ message: string }>(`/reviews/${id}`),
};
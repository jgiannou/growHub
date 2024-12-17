import { create } from "zustand";
import { Review } from "../types";
import { api } from "../services/api";

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  fetchReviews: (developerIds: number | number[]) => Promise<void>;
  addReview: (review: Partial<Review>) => Promise<Review | undefined>;
  updateReview: (review: Review) => Promise<Review | undefined>;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  reviews: [],
  loading: false,
  fetchReviews: async (developerIds) => {
    set({ loading: true });
    try {
      const ids = Array.isArray(developerIds) ? developerIds : [developerIds];
      const allReviews = await Promise.all(
        ids.map((id) => api.reviews.getByDeveloperId(id))
      );
      const reviews = allReviews.flat();
      set({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      set({ loading: false });
    }
  },
  addReview: async (review) => {
    try {
      const newReview = await api.reviews.add(review);
      set((state) => ({ reviews: [...state.reviews, newReview] }));
      return newReview;
    } catch (error) {
      console.error("Error adding review:", error);
      return undefined;
    }
  },
  updateReview: async (review: Review) => {
    try {
      const updatedReview = await api.reviews.update(review);
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === updatedReview.id ? updatedReview : r
        ),
      }));
      return updatedReview;
    } catch (error) {
      console.error("Error updating review:", error);
      return undefined;
    }
  },
}));

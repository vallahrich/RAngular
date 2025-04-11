export interface Review {
    reviewId: number;
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
    createdAt: Date | string;
    username?: string; // Only for display, not sent to API
  }
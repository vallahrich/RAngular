export interface Review {
    reviewId: number;
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
    createdAt: Date;
    username?: string; // Additional field to display username with review
}
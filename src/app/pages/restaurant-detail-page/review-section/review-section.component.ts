import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../../models/review.model';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-review-section',
  templateUrl: './review-section.component.html',
  styleUrls: ['./review-section.component.css']
})
export class ReviewSectionComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() isLoggedIn = false;
  
  reviews: Review[] = [];
  userReview: Review | null = null;
  loading = true;
  error = '';
  showReviewForm = false;
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadReviews();
    
    if (this.isLoggedIn) {
      this.checkUserReview();
    }
  }
  
  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviewsByRestaurantId(this.restaurantId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load reviews.';
        this.loading = false;
        console.error('Error loading reviews:', error);
      }
    });
  }
  
  checkUserReview(): void {
    this.reviewService.getUserReviewForRestaurant(this.currentUserId, this.restaurantId).subscribe({
      next: (data) => {
        this.userReview = data;
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error checking user review:', error);
        }
      }
    });
  }
  
  onReviewSubmitted(review: Review): void {
    this.userReview = review;
    this.loadReviews();
    this.showReviewForm = false;
  }
  
  onReviewDeleted(): void {
    this.userReview = null;
    this.loadReviews();
  }
  
  onEditReview(): void {
    this.showReviewForm = true;
  }
  
  isUserReview(review: Review): boolean {
    return this.isLoggedIn && review.userId === this.currentUserId;
  }
}
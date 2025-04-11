// File: src/app/pages/restaurant-detail-page/review-section/review-form/review-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../../../../models/review.model';
import { ReviewService } from '../../../../services/review.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() review: Review | null = null;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  @Output() canceled = new EventEmitter<void>();
  
  reviewForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  get isEditing(): boolean {
    return !!this.review;
  }
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  // Convenience getter for form fields
  get f() { return this.reviewForm.controls; }
  
  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(1000)]
    });
    
    if (this.review) {
      this.reviewForm.patchValue({
        rating: this.review.rating,
        comment: this.review.comment
      });
    }
  }
  
  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.reviewForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    if (this.isEditing && this.review) {
      // Updating existing review
      const updatedReview: Review = {
        reviewId: this.review.reviewId,
        userId: this.currentUserId,
        restaurantId: this.restaurantId,
        rating: Number(this.f['rating'].value), // Ensure it's a number
        comment: this.f['comment'].value || "", // Ensure not null
        createdAt: this.review.createdAt  // Keep the original creation date
      };

      console.log('Updating review:', updatedReview);
      
      this.reviewService.updateReview(updatedReview).subscribe({
        next: (review) => {
          console.log('Review updated successfully:', review);
          this.loading = false;
          this.reviewSubmitted.emit(review);
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.loading = false;
          if (error.status === 400) {
            this.error = 'Invalid review data. Please check your input.';
          } else if (error.status === 404) {
            this.error = 'Review not found. It may have been deleted.';
          } else {
            this.error = 'Failed to update review. Please try again.';
          }
        }
      });
    } else {
      // Creating new review
      const newReview: Review = {
        reviewId: 0, // Will be set by server
        userId: this.currentUserId,
        restaurantId: this.restaurantId,
        rating: Number(this.f['rating'].value), // Ensure it's a number
        comment: this.f['comment'].value || "", // Ensure not null
        createdAt: new Date() // Use current date
      };

      console.log('Creating new review:', newReview);
      console.log('User ID:', this.currentUserId);
      console.log('Restaurant ID:', this.restaurantId);
      
      this.reviewService.createReview(newReview).subscribe({
        next: (review) => {
          console.log('Review created successfully:', review);
          this.loading = false;
          this.reviewSubmitted.emit(review);
        },
        error: (error) => {
          console.error('Error creating review:', error);
          this.loading = false;
          
          if (error.status === 409) {
            this.error = 'You have already reviewed this restaurant.';
          } else if (error.status === 400) {
            this.error = 'Invalid review data. Please check your input.';
          } else if (error.status === 404) {
            this.error = 'Restaurant or user not found.';
          } else {
            this.error = 'Failed to submit review. Please try again.';
          }
        }
      });
    }
  }
  
  onCancel(): void {
    this.canceled.emit();
  }
}
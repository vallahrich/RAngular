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
    
    if (this.reviewForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    if (this.isEditing && this.review) {
      // Updating existing review
      const updatedReview: Review = {
        ...this.review,
        rating: parseInt(this.reviewForm.value.rating),
        comment: this.reviewForm.value.comment
      };
      
      this.reviewService.updateReview(updatedReview).subscribe({
        next: (review) => {
          this.loading = false;
          this.reviewSubmitted.emit(review);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to update review. Please try again.';
          console.error('Error updating review:', error);
        }
      });
    } else {
      // Creating new review
      const newReview: Review = {
        reviewId: 0, // Will be set by server
        userId: this.currentUserId,
        restaurantId: this.restaurantId,
        rating: parseInt(this.reviewForm.value.rating),
        comment: this.reviewForm.value.comment,
        createdAt: new Date()
      };
      
      this.reviewService.createReview(newReview).subscribe({
        next: (review) => {
          this.loading = false;
          this.reviewSubmitted.emit(review);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to submit review. Please try again.';
          console.error('Error submitting review:', error);
        }
      });
    }
  }
  
  onCancel(): void {
    this.canceled.emit();
  }
}
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Review } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';

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
  
  @ViewChild('reviewForm') reviewForm!: NgForm;
  
  reviewModel: Review = {
    reviewId: 0,
    userId: 0,
    restaurantId: 0,
    rating: 5,
    comment: '',
    createdAt: new Date()
  };
  
  loading = false;
  error = '';
  
  get isEditing(): boolean {
    return !!this.review;
  }
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Initialize with proper IDs
    this.reviewModel.userId = this.currentUserId;
    this.reviewModel.restaurantId = this.restaurantId;
    
    // If editing existing review, copy its properties
    if (this.review) {
      this.reviewModel = {...this.review};
    }
  }
  
  onSubmit(): void {
    // Check if form is available and valid
    if (!this.reviewForm || !this.reviewForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    if (this.isEditing) {
      this.reviewService.updateReview(this.reviewModel).subscribe({
        next: (response) => {
          this.loading = false;
          this.reviewSubmitted.emit(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
    } else {
      this.reviewService.createReview(this.reviewModel).subscribe({
        next: (response) => {
          this.loading = false;
          this.reviewSubmitted.emit(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
    }
  }
  
  handleError(error: HttpErrorResponse): void {
    this.loading = false;
    
    if (error.status === 409) {
      this.error = 'You have already reviewed this restaurant.';
    } else if (error.status === 400) {
      this.error = 'Invalid review data. Please check your input.';
    } else if (error.status === 404) {
      this.error = 'Restaurant or user not found.';
    } else {
      this.error = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
    }
    console.error('Full error object:', error);
  }
  
  onCancel(): void {
    this.canceled.emit();
  }
}
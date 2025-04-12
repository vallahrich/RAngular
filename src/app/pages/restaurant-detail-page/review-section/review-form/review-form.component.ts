import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { environment } from 'src/environments/enviroment';
import { Review } from '../../../../models/review.model';

@Component({
  selector: 'app-review-form',
  template: `
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">{{ isEditing ? 'Edit Your Review' : 'Add Your Review' }}</h5>
      </div>
      <div class="card-body">
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="rating" class="form-label">Rating (1-5 stars) <span class="text-danger">*</span></label>
            <select formControlName="rating" id="rating" class="form-select">
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea 
              formControlName="comment" 
              id="comment" 
              class="form-control" 
              rows="3"
              placeholder="Share your experience...">
            </textarea>
          </div>
          
          <div class="d-flex">
            <button type="submit" class="btn btn-primary me-2" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditing ? 'Update Review' : 'Submit Review' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
              Cancel
            </button>
          </div>
          
          <div *ngIf="error" class="alert alert-danger mt-3">
            {{ error }}
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() review: Review | null = null;
  @Output() reviewSubmitted = new EventEmitter<any>();
  @Output() canceled = new EventEmitter<void>();
  
  reviewForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';
  apiUrl = `${environment.apiUrl}/review`;
  
  get isEditing(): boolean {
    return !!this.review;
  }
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  get f() { return this.reviewForm.controls; }
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      rating: ['5', [Validators.required]],
      comment: ['', Validators.maxLength(1000)]
    });
    
    if (this.review) {
      this.reviewForm.patchValue({
        rating: this.review.rating.toString(),
        comment: this.review.comment
      });
    }
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    this.error = '';
    this.successMessage = '';

    if (this.reviewForm.invalid) {
      return;
    }

    this.loading = true;
    
    // ASP.NET Core model binding likes it when numbers are sent as numbers, not strings
    const rating = parseInt(this.f['rating'].value);
    
    if (this.isEditing && this.review) {
      // Update existing review with navigation properties
      const reviewModel = {
        reviewId: this.review.reviewId,
        userId: this.currentUserId,
        restaurantId: this.restaurantId,
        rating: rating,
        comment: this.f['comment'].value || "",
        // Include navigation properties that the backend requires
        User: { userId: this.currentUserId },
        Restaurant: { restaurantId: this.restaurantId }
      };
      
      console.log('Updating review with payload:', JSON.stringify(reviewModel));
      
      // Explicitly set content-type for ASP.NET Core
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
      
      this.http.put(this.apiUrl, reviewModel, { headers })
        .subscribe({
          next: (response) => {
            console.log('Review updated successfully:', response);
            this.loading = false;
            this.successMessage = "Review updated successfully!";
            this.reviewSubmitted.emit(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    } else {
      // Create new review with navigation properties
      const reviewModel = {
        userId: this.currentUserId,
        restaurantId: this.restaurantId,
        rating: rating,
        comment: this.f['comment'].value || "",
        // Include navigation properties that the backend requires
        User: { userId: this.currentUserId },
        Restaurant: { restaurantId: this.restaurantId }
      };
      
      console.log('Submitting new review with payload:', JSON.stringify(reviewModel));
      
      // Explicitly set content-type for ASP.NET Core
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
      
      this.http.post(this.apiUrl, reviewModel, { headers })
        .subscribe({
          next: (response) => {
            console.log('Review created successfully:', response);
            this.loading = false;
            this.successMessage = "Review submitted successfully!";
            this.reviewSubmitted.emit(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    }
  }
  
  handleError(error: any): void {
    this.loading = false;
    
    if (error.status === 409) {
      this.error = 'You have already reviewed this restaurant.';
    } else if (error.status === 400) {
      this.error = 'Invalid review data. Please check your input.';
      
      if (error.error) {
        console.error('Error response detail:', error.error);
        
        // Try to extract validation errors from ASP.NET Core response
        if (error.error.errors) {
          let validationErrors = '';
          for (const key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
              validationErrors += `${key}: ${error.error.errors[key].join(', ')}; `;
            }
          }
          if (validationErrors) {
            this.error += ` - ${validationErrors}`;
          }
        } else if (typeof error.error === 'string') {
          this.error += ` - ${error.error}`;
        }
      }
      
      console.error('Full error object:', error);
    } else if (error.status === 404) {
      this.error = 'Restaurant or user not found.';
    } else {
      this.error = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
      console.error('Full error object:', error);
    }
  }
  
  onCancel(): void {
    this.canceled.emit();
  }
}